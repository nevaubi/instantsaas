
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    console.log('Creating full-price checkout without upfront email');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Create placeholder full-price order record without email
    const { data: orderData, error: orderError } = await supabaseClient
      .from('fullprice_orders')
      .insert({
        email: '', // Placeholder - will be updated after Stripe checkout
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

    // Create Stripe checkout session
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    const checkoutData = {
      success_url: `${req.headers.get('origin')}/checkout-success-fullprice?order_id=${orderData.id}`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: 'price_1QVrdsEecc1GnxaLVgFklE8r', // Using same price ID for testing as requested
          quantity: 1,
        },
      ],
      metadata: {
        order_id: orderData.id,
        tier: 'fullprice'
      },
    };

    console.log('Creating Stripe checkout session with data:', checkoutData);

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(checkoutData as any).toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', errorText);
      throw new Error(`Stripe API error: ${stripeResponse.status} ${errorText}`);
    }

    const session = await stripeResponse.json();
    console.log('Stripe checkout session created:', session.id);

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
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
