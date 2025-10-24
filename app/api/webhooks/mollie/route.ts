import { NextRequest, NextResponse } from 'next/server';
import { createClient as createMollieClient } from '@mollie/api-client';
import { supabaseAdmin } from '@/lib/supabase/client';

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = body.id;

    // Get payment details from Mollie
    const payment = await mollieClient.payments.get(paymentId);

    if (payment.status === 'paid') {
      // Update user subscription
      const customerId = payment.customerId;

      if (customerId) {
        // Get user by Mollie customer ID
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('mollie_customer_id', customerId)
          .single();

        if (profile) {
          // Determine plan based on payment amount
          let plan = 'free';
          if (payment.amount.value === '9.00') plan = 'pro';
          if (payment.amount.value === '29.00') plan = 'business';

          // Update subscription
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_plan: plan,
              subscription_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Mollie webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
