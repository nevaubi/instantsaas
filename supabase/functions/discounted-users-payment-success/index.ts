
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hardcoded Zapier webhook URL for automated template delivery
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/23353457/ub674xa/";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[DISCOUNTED-USERS-PAYMENT-SUCCESS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    logStep("Processing payment success for session", { sessionId });

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session with customer details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer_details']
    });

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    logStep("Payment confirmed for session", { sessionId });

    // Get the customer's email from Stripe
    const customerEmail = session.customer_details?.email || session.customer_email;
    
    if (!customerEmail) {
      throw new Error("No customer email found in Stripe session");
    }

    logStep("Customer email from Stripe", { email: customerEmail });

    // Create Supabase client with service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update discounted_users record with payment details and status
    const { data: discountedUserData, error: updateError } = await supabaseService
      .from("discounted_users")
      .update({
        amount: 39.00, // Fixed amount for discounted users
        currency: "usd",
        delivery_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_checkout_session_id", sessionId)
      .select()
      .single();

    if (updateError) {
      logStep("Database update error", { error: updateError });
      throw new Error("Failed to update discounted user status");
    }

    logStep("Discounted user status updated to paid");

    // Automatically trigger Zapier webhook
    logStep("Triggering Zapier webhook", { webhook: ZAPIER_WEBHOOK_URL });
    
    const zapierPayload = {
      order_id: discountedUserData.id,
      email: customerEmail,
      amount: 39.00, // Fixed amount for discounted template
      currency: "usd",
      stripe_session_id: sessionId,
      customer_name: session.customer_details?.name || "",
      payment_date: new Date().toISOString(),
      template_name: "Discounted_SaaS_Template", // Updated template name
      template_description: "Production-ready SaaS boilerplate with 40% discount",
      github_username: discountedUserData.github_username || "",
      twitter_username: discountedUserData.twitter_username || ""
    };

    try {
      const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zapierPayload),
      });

      logStep("Zapier webhook response", { status: zapierResponse.status });

      // Update delivery status to indicate webhook was triggered
      await supabaseService
        .from("discounted_users")
        .update({
          delivery_status: "webhook_triggered",
          updated_at: new Date().toISOString(),
        })
        .eq("id", discountedUserData.id);

      logStep("Template delivery triggered successfully");
    } catch (zapierError) {
      logStep("Zapier webhook error", { error: zapierError });
      // Don't throw error here, just log it - payment was successful
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment processed and template delivery triggered",
        discountedUser: discountedUserData,
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
