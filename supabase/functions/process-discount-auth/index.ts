
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-DISCOUNT-AUTH] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Use service role key to perform writes
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Extract Google user information from user metadata
    const googleUserId = user.user_metadata?.sub || user.user_metadata?.provider_id;
    const googleUsername = user.user_metadata?.full_name || 
                          user.user_metadata?.name ||
                          user.email?.split('@')[0];
    
    logStep("Google user info extracted", { googleUserId, googleUsername });

    // Use UPSERT to prevent duplicates - insert or update existing record
    const { data: upsertedUser, error: upsertError } = await supabaseClient
      .from("discounted_users")
      .upsert({
        user_id: user.id,
        email: user.email,
        twitter_username: googleUsername, // Store Google username in twitter_username field for now
        subscribe_status: 'pending',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (upsertError) {
      logStep("Error upserting user", { error: upsertError });
      throw new Error(`Failed to create/update discount record: ${upsertError.message}`);
    }

    logStep("Successfully created/updated discount record", { userId: upsertedUser.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Discount user recorded successfully",
      user_id: upsertedUser.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
