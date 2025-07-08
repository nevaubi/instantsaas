
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Zapier webhook URL for full-price repo creation process
const REPO_CREATION_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/23353457/u3fp6g0/";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBMIT-GITHUB-USERNAME-FULLPRICE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, orderId, githubUsername } = await req.json();
    logStep("Processing GitHub username submission", {
      email,
      orderId,
      githubUsername,
    });

    if (!email || !orderId || !githubUsername) {
      throw new Error("Missing required fields: email, orderId, or githubUsername");
    }

    // Validate GitHub username format
    const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!githubUsernameRegex.test(githubUsername)) {
      throw new Error("Invalid GitHub username format");
    }

    // Create Supabase client with service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // First, verify the order exists and matches the email
    const { data: existingOrder, error: fetchError } = await supabaseService
      .from("fullprice_orders")
      .select("*")
      .eq("id", orderId)
      .eq("email", email)
      .single();

    if (fetchError || !existingOrder) {
      logStep("Order verification failed", { error: fetchError });
      throw new Error("Order not found or email mismatch. Please check your email for the correct link.");
    }

    logStep("Order verified, updating with GitHub username", { orderId: existingOrder.id });

    // Update the order with GitHub username and status
    const { data: updatedOrder, error: updateError } = await supabaseService
      .from("fullprice_orders")
      .update({
        github_username: githubUsername,
        delivery_status: "github_collected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError) {
      logStep("Database update error", { error: updateError });
      throw new Error("Failed to update order with GitHub username");
    }

    logStep("Order updated successfully, triggering repo creation webhook");

    // Trigger the Zapier webhook for repo creation
    const zapierPayload = {
      order_id: updatedOrder.id,
      email: updatedOrder.email,
      github_username: githubUsername,
      amount: updatedOrder.amount || 69.00,
      currency: updatedOrder.currency || "usd",
      stripe_session_id: updatedOrder.stripe_checkout_session_id,
      delivery_status: "github_collected",
      created_at: updatedOrder.created_at,
      updated_at: updatedOrder.updated_at,
      template_name: "Full_Price_SaaS_Template",
      template_description: "Production-ready SaaS boilerplate at full price",
      subscribe_status: updatedOrder.subscribe_status || "pending",
    };

    try {
      const webhookResponse = await fetch(REPO_CREATION_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zapierPayload),
      });

      logStep("Repo creation webhook response", { status: webhookResponse.status });

      if (webhookResponse.ok) {
        logStep("Repo creation webhook triggered successfully");
      } else {
        logStep("Repo creation webhook failed", { status: webhookResponse.status });
      }
    } catch (webhookError) {
      logStep("Error triggering repo creation webhook", { error: webhookError });
      // Don't throw error here - the username was saved successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "GitHub username saved and repo creation triggered",
        order: updatedOrder,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
