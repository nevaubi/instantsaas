
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-DISCOUNT-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

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

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if Stripe customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    } else {
      logStep("No existing Stripe customer found");
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Look up the AUTH30OFF promotion code
    let discounts = [];
    try {
      const promotionCodes = await stripe.promotionCodes.list({
        code: "AUTH30OFF",
        active: true,
        limit: 1,
      });
      
      if (promotionCodes.data.length > 0) {
        const promoCode = promotionCodes.data[0];
        discounts = [{ promotion_code: promoCode.id }];
        logStep("Found AUTH30OFF promotion code", { promoCodeId: promoCode.id });
      } else {
        logStep("AUTH30OFF promotion code not found or inactive");
      }
    } catch (error) {
      logStep("Error looking up promotion code", { error: error.message });
      // Continue without the promotion code if lookup fails
    }
    
    // Create checkout session with the specific price ID and auto-applied promotion code
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: "price_1RigQuCvgd1ruEdY3O3YkbSn", // The 40% discount price ID
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment for the discounted product
      discounts: discounts, // Auto-apply AUTH30OFF promotion code if found
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout-cancel`,
      metadata: {
        user_id: user.id,
        discount_type: "twitter_40_percent"
      }
    });

    logStep("Created Stripe checkout session with auto-applied promotion code", { 
      sessionId: session.id, 
      discountsApplied: discounts.length > 0 
    });

    // Update the discounted_users record with checkout session ID
    const { error: updateError } = await supabaseClient
      .from("discounted_users")
      .update({
        stripe_checkout_session_id: session.id,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      logStep("Error updating discount record", { error: updateError });
      // Don't fail the request, just log the error
    } else {
      logStep("Updated discount record with checkout session");
    }

    return new Response(JSON.stringify({ url: session.url }), {
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
