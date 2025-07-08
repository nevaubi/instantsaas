
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hardcoded Zapier webhook URL for automated template delivery (full-price tier)
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/23353457/u3fidh2/";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    console.log("Processing full-price payment success for session:", sessionId);

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

    console.log("Payment confirmed for session:", sessionId);

    // Get the customer's email from Stripe
    const customerEmail = session.customer_details?.email || session.customer_email;
    
    if (!customerEmail) {
      throw new Error("No customer email found in Stripe session");
    }

    console.log("Customer email from Stripe:", customerEmail);

    // Create Supabase client with service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update order with actual email and payment status
    const { data: orderData, error: updateError } = await supabaseService
      .from("fullprice_orders")
      .update({
        email: customerEmail,
        delivery_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_checkout_session_id", sessionId)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
      throw new Error("Failed to update order status");
    }

    console.log("Full-price order status updated to paid with customer email");

    // Automatically trigger Zapier webhook
    console.log("Triggering Zapier webhook:", ZAPIER_WEBHOOK_URL);
    
    const zapierPayload = {
      order_id: orderData.id,
      email: customerEmail,
      amount: orderData.amount,
      currency: orderData.currency,
      stripe_session_id: sessionId,
      customer_name: session.customer_details?.name || "",
      payment_date: new Date().toISOString(),
      template_name: "Complete SaaS Template - Full Price",
      template_description: "Production-ready boilerplate with Stripe, Supabase, and more (Full Price Tier)",
      tier: "fullprice"
    };

    try {
      const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zapierPayload),
      });

      console.log("Zapier webhook response status:", zapierResponse.status);

      // Update delivery status to indicate webhook was triggered
      await supabaseService
        .from("fullprice_orders")
        .update({
          delivery_status: "webhook_triggered",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderData.id);

      console.log("Full-price template delivery triggered successfully");
    } catch (zapierError) {
      console.error("Zapier webhook error:", zapierError);
      // Don't throw error here, just log it - payment was successful
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment processed and full-price template delivery triggered",
        order: orderData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing full-price payment success:", error);
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
