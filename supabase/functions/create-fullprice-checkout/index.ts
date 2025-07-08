
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

    // Create placeholder full-price order record without email
    const { data: orderData, error: orderError } = await supabaseClient
      .from('fullprice_orders')
      .insert({
        email: 'pending', // Placeholder - will be updated after Stripe checkout
        amount: 69.00,
        currency: 'usd',
        subscribe_status: 'pending',
        delivery_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating placeholder full-price order:', orderError);
      throw orderError;
    }

    console.log('Placeholder full-price order created:', orderData);

    // Create Stripe checkout session using SDK
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1RigQuCvgd1ruEdY3O3YkbSn', // Correct price ID for $69
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout-success-fullprice?order_id=${orderData.id}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        order_id: orderData.id,
        tier: 'fullprice'
      },
    });

    console.log('Stripe checkout session created successfully:', session.id);

    // Update order with Stripe session ID
    const { error: updateError } = await supabaseClient
      .from('fullprice_orders')
      .update({
        stripe_checkout_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderData.id);

    if (updateError) {
      console.error('Error updating order with session ID:', updateError);
      // Don't throw here as the session was created successfully
    }

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
