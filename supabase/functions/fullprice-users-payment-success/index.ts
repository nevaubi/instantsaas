
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    console.log('Received webhook for full-price payment');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    // Parse the Stripe event
    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error('Error parsing webhook body:', err);
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    console.log('Processing event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Checkout session completed:', session.id);

      // Get the order from our database using the session ID
      const { data: order, error: orderError } = await supabaseClient
        .from('fullprice_orders')
        .select('*')
        .eq('stripe_checkout_session_id', session.id)
        .single();

      if (orderError || !order) {
        console.error('Order not found:', orderError);
        return new Response('Order not found', { status: 404, headers: corsHeaders });
      }

      // Update the order status with email from Stripe
      const customerEmail = session.customer_details?.email || session.customer_email || '';
      
      const { error: updateError } = await supabaseClient
        .from('fullprice_orders')
        .update({
          email: customerEmail,
          subscribe_status: 'completed',
          stripe_customer_id: session.customer,
          amount: session.amount_total / 100, // Convert from cents
          currency: session.currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Error updating order:', updateError);
        return new Response('Database update failed', { status: 500, headers: corsHeaders });
      }

      // Send webhook to Zapier
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/23353457/u3fidh2/';
      
      const zapierData = {
        email: customerEmail,
        order_id: order.id,
        tier: 'fullprice',
        amount: session.amount_total / 100,
        currency: session.currency,
        stripe_customer_id: session.customer,
        stripe_checkout_session_id: session.id,
        timestamp: new Date().toISOString()
      };

      console.log('Sending data to Zapier:', zapierData);

      try {
        const zapierResponse = await fetch(zapierWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(zapierData)
        });

        if (!zapierResponse.ok) {
          console.error('Zapier webhook failed:', zapierResponse.status);
        } else {
          console.log('Zapier webhook sent successfully');
        }
      } catch (zapierError) {
        console.error('Error sending to Zapier:', zapierError);
      }

      console.log('Full-price payment processing completed successfully');
    }

    return new Response('OK', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Error in fullprice payment webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
