
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
    console.log('Creating full-price checkout without authentication');

    // Validate required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !stripeSecretKey) {
      console.error('Missing required environment variables');
      throw new Error('Server configuration error');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

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

    // Prepare Stripe checkout session data with proper form encoding
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const successUrl = `${origin}/checkout-success-fullprice?order_id=${orderData.id}`;
    const cancelUrl = `${origin}/?canceled=true`;

    // Build form data manually for Stripe API
    const formData = new URLSearchParams();
    formData.append('success_url', successUrl);
    formData.append('cancel_url', cancelUrl);
    formData.append('mode', 'payment');
    formData.append('payment_method_types[0]', 'card');
    formData.append('line_items[0][price]', 'price_1QVrdsEecc1GnxaLVgFklE8r');
    formData.append('line_items[0][quantity]', '1');
    formData.append('metadata[order_id]', orderData.id);
    formData.append('metadata[tier]', 'fullprice');

    console.log('Creating Stripe checkout session with form data');

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', stripeResponse.status, errorText);
      throw new Error(`Stripe API error: ${stripeResponse.status} - ${errorText}`);
    }

    const session = await stripeResponse.json();
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
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
