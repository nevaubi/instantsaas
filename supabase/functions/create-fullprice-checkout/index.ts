
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating full-price checkout session...');

    // Validate required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey) {
      console.error('Missing required environment variables');
      throw new Error('Server configuration error');
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client with service role key
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Create Stripe checkout session - let Stripe collect the email
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1RigQuCvgd1ruEdY3O3YkbSn', // Correct price ID for $69
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout-success-fullprice?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });

    console.log('Created Stripe session:', session.id);

    // Store initial order in database with placeholder email
    const { error: dbError } = await supabaseClient
      .from('fullprice_orders')
      .insert({
        email: 'pending', // Will be updated after payment with actual email
        stripe_checkout_session_id: session.id,
        amount: 69.00,
        currency: 'usd',
        delivery_status: 'pending',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store order');
    }

    console.log('Order stored in database');

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in create-fullprice-checkout:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create checkout session',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
