
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADD-TO-NEWSLETTER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Newsletter signup function started");

    const { email } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    logStep("Processing newsletter signup", { email });

    // Send email to Zapier webhook
    const zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch/23353457/u3aw2ho/";
    
    const zapierPayload = {
      email: email,
      timestamp: new Date().toISOString(),
      source: "discount_flow",
      signup_type: "google_auth_discount"
    };

    logStep("Sending to Zapier webhook", { url: zapierWebhookUrl, payload: zapierPayload });

    const zapierResponse = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zapierPayload),
    });

    if (!zapierResponse.ok) {
      logStep("Zapier webhook failed", { 
        status: zapierResponse.status, 
        statusText: zapierResponse.statusText 
      });
      throw new Error(`Zapier webhook failed: ${zapierResponse.status}`);
    }

    logStep("Successfully added to newsletter", { email });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email added to newsletter successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    // Return success even on error to not interfere with main flow
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      message: "Newsletter signup failed but discount flow continues" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Return 200 to not break main flow
    });
  }
});
