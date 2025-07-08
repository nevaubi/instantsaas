
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

    // Extract Twitter username from user metadata
    const twitterUsername = user.user_metadata?.user_name || 
                           user.user_metadata?.preferred_username ||
                           user.user_metadata?.screen_name;
    
    logStep("Twitter username extracted", { twitterUsername });

    // Check if user already exists in discounted_users
    const { data: existingUser } = await supabaseClient
      .from("discounted_users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (existingUser) {
      logStep("User already exists in discounted_users", { existingUserId: existingUser.id });
      return new Response(JSON.stringify({ 
        success: true, 
        message: "User already recorded",
        user_id: existingUser.id 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Insert new discounted user record
    const { data: newUser, error: insertError } = await supabaseClient
      .from("discounted_users")
      .insert({
        user_id: user.id,
        email: user.email,
        twitter_username: twitterUsername,
        subscribe_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      logStep("Error inserting user", { error: insertError });
      throw new Error(`Failed to create discount record: ${insertError.message}`);
    }

    logStep("Successfully created discount record", { newUserId: newUser.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Discount user recorded successfully",
      user_id: newUser.id 
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
