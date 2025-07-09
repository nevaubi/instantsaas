
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

const isMobileUserAgent = (req: Request): boolean => {
  const userAgent = req.headers.get("user-agent") || "";
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    const isMobile = isMobileUserAgent(req);
    logStep("Processing payment success for session", { sessionId, isMobile });

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

    logStep("Payment confirmed for session", { sessionId, isMobile });

    // Get the customer's email from Stripe
    const customerEmail = session.customer_details?.email || session.customer_email;
    
    if (!customerEmail) {
      throw new Error("No customer email found in Stripe session");
    }

    logStep("Customer email from Stripe", { email: customerEmail, isMobile });

    // Create Supabase client with service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    let finalUserData = null;

    // First, try to find the record by session ID (most reliable)
    logStep("Attempting to find record by session ID", { sessionId });
    const { data: sessionData, error: sessionError } = await supabaseService
      .from("discounted_users")
      .update({
        amount: 39.00, // Fixed amount for discounted users
        currency: "usd",
        delivery_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_checkout_session_id", sessionId)
      .select()
      .maybeSingle();

    if (sessionError) {
      logStep("Database update error (session ID)", { error: sessionError, isMobile });
      throw new Error(`Failed to update discounted user status by session ID: ${sessionError.message}`);
    }

    if (sessionData) {
      logStep("Successfully updated record by session ID", { recordId: sessionData.id, isMobile });
      finalUserData = sessionData;
    } else {
      // If no record found by session ID, try to find by email as fallback
      logStep("No record found by session ID, trying by email fallback", { customerEmail, isMobile });
      
      // Add small delay for mobile to handle potential timing issues
      if (isMobile) {
        logStep("Mobile detected, adding delay before email fallback");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const { data: emailData, error: emailError } = await supabaseService
        .from("discounted_users")
        .update({
          amount: 39.00,
          currency: "usd",
          delivery_status: "paid",
          stripe_checkout_session_id: sessionId, // Update with the session ID
          updated_at: new Date().toISOString(),
        })
        .eq("email", customerEmail)
        .select()
        .maybeSingle();

      if (emailError) {
        logStep("Fallback update error", { error: emailError, isMobile });
        throw new Error(`Failed to update discounted user by email: ${emailError.message}`);
      }

      if (!emailData) {
        logStep("No record found by email either", { customerEmail, isMobile });
        throw new Error("No discounted user record found for this payment");
      }

      logStep("Updated discounted user record via email fallback", { recordId: emailData.id, isMobile });
      finalUserData = emailData;
    }

    // Validate that we have the final user data
    if (!finalUserData || !finalUserData.id) {
      logStep("ERROR: Final user data is invalid", { finalUserData, isMobile });
      throw new Error("Failed to retrieve valid user data after update");
    }

    logStep("Final user data confirmed", { recordId: finalUserData.id, email: customerEmail, isMobile });

    // Automatically trigger Zapier webhook
    logStep("Triggering Zapier webhook", { webhook: ZAPIER_WEBHOOK_URL, isMobile });
    
    const zapierPayload = {
      order_id: finalUserData.id,
      email: customerEmail,
      amount: 39.00, // Fixed amount for discounted template
      currency: "usd",
      stripe_session_id: sessionId,
      customer_name: session.customer_details?.name || "",
      payment_date: new Date().toISOString(),
      template_name: "Discounted_SaaS_Template",
      template_description: "Production-ready SaaS boilerplate with 40% discount",
      github_username: finalUserData.github_username || "",
      twitter_username: finalUserData.twitter_username || "",
      github_setup_url: `https://instantsaas.dev/github-username?email=${encodeURIComponent(customerEmail)}&order_id=${finalUserData.id}`,
      is_mobile: isMobile
    };

    try {
      const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zapierPayload),
      });

      logStep("Zapier webhook response", { status: zapierResponse.status, isMobile });

      // Update delivery status to indicate webhook was triggered
      await supabaseService
        .from("discounted_users")
        .update({
          delivery_status: "webhook_triggered",
          updated_at: new Date().toISOString(),
        })
        .eq("id", finalUserData.id);

      logStep("Template delivery triggered successfully", { isMobile });
    } catch (zapierError) {
      logStep("Zapier webhook error", { error: zapierError, isMobile });
      // Don't throw error here, just log it - payment was successful
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment processed and template delivery triggered",
        discountedUser: finalUserData,
        mobile_detected: isMobile,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    logStep("ERROR", { message: error.message, stack: error.stack });
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
