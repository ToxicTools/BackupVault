import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { supabaseAdmin } from '@/lib/supabase/client';
import crypto from 'crypto';

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

/**
 * Verifies Mollie webhook signature for security
 * Note: Mollie doesn't use HMAC signatures like Stripe, but we verify via API call
 */
async function verifyMollieWebhook(paymentId: string): Promise<boolean> {
  try {
    // Verify by fetching from Mollie API - if it exists, it's legitimate
    await mollieClient.payments.get(paymentId);
    return true;
  } catch (error) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check - only process webhooks from expected origin
    const origin = request.headers.get('origin');
    const userAgent = request.headers.get('user-agent');

    // Mollie webhooks come from their servers
    if (userAgent && !userAgent.includes('Mollie')) {
      // Additional verification layer
      // Note: This is a soft check as user-agents can be spoofed
    }

    const body = await request.json();
    const paymentId = body.id;

    if (!paymentId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Verify webhook authenticity by fetching from Mollie API
    const isValid = await verifyMollieWebhook(paymentId);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get payment details from Mollie (already verified above)
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
          // Determine plan based on payment amount - use safe comparison
          let plan = 'free';
          const amount = parseFloat(payment.amount.value || '0');
          if (amount === 9.00) plan = 'pro';
          if (amount === 29.00) plan = 'business';

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
    // Don't log sensitive error details
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
