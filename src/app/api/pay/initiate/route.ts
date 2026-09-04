import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      candidateId,
      candidateName,
      competitionSlug,
      voteCount = 1,
      amount = 100,
      paymentMethod = 'orange',
      phone = ''
    } = body;

    const voteId = `vote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fapshiApiUser = process.env.FAPSHI_API_USER;
    const fapshiApiKey = process.env.FAPSHI_API_KEY;
    const fapshiBaseUrl = process.env.FAPSHI_BASE_URL || 'https://live.fapshi.com';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Format and clean phone number (remove spaces, +237, etc.)
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '').slice(-9) : '';

    // 1. Record pending vote in Supabase
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('votes').insert([
        {
          id: voteId,
          candidate_id: candidateId,
          candidate_name: candidateName,
          competition_slug: competitionSlug,
          vote_count: voteCount,
          amount_fcfa: amount,
          payment_method: paymentMethod,
          payment_status: 'PENDING',
          created_at: new Date().toISOString()
        }
      ]);
    } catch {
      // Continue even if Supabase table is not created yet
    }

    // 2. Call Fapshi Payment Gateway API (Direct Pay vs Hosted Checkout)
    if (fapshiApiUser && fapshiApiKey) {
      
      // OPTION A: DIRECT PAY (If phone number is provided)
      if (cleanPhone && cleanPhone.length === 9) {
        try {
          const directPayRes = await fetch(`${fapshiBaseUrl}/direct-pay`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apiuser': fapshiApiUser,
              'apikey': fapshiApiKey
            },
            body: JSON.stringify({
              amount: amount,
              phone: cleanPhone,
              medium: paymentMethod === 'orange' ? 'OM' : 'MOMO',
              userId: candidateId,
              externalId: voteId,
              webhookUrl: `${siteUrl}/api/pay/webhook`,
              message: `Vote MISS MISTER (${voteCount} vote(s)) pour ${candidateName}`,
              email: 'voter@missmister.com'
            })
          });

          const directPayData = await directPayRes.json();

          if (directPayRes.ok && (directPayData.transId || directPayData.id)) {
            return NextResponse.json({
              success: true,
              directPay: true,
              voteId: voteId,
              transId: directPayData.transId || directPayData.id,
              phone: cleanPhone,
              message: 'Un prompt de confirmation a été envoyé directement sur votre téléphone.'
            });
          }
        } catch {
          // Fallback to initiate-pay if direct-pay fails
        }
      }

      // OPTION B: HOSTED CHECKOUT PAY LINK (Fallback or when no phone is provided)
      const fapshiResponse = await fetch(`${fapshiBaseUrl}/initiate-pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiuser': fapshiApiUser,
          'apikey': fapshiApiKey
        },
        body: JSON.stringify({
          amount: amount,
          email: 'voter@missmister.com',
          userId: candidateId,
          externalId: voteId,
          redirectUrl: `${siteUrl}/competition/${competitionSlug}`,
          webhookUrl: `${siteUrl}/api/pay/webhook`,
          message: `Vote MISS MISTER (${voteCount} vote(s)) pour ${candidateName}`,
          serviceName: 'MISS MISTER',
          phone: cleanPhone || undefined
        })
      });

      const fapshiData = await fapshiResponse.json();

      if (fapshiResponse.ok && (fapshiData.link || fapshiData.transId)) {
        return NextResponse.json({
          success: true,
          directPay: false,
          voteId: voteId,
          transId: fapshiData.transId || fapshiData.id,
          link: fapshiData.link,
          message: 'Paiement Fapshi initialisé avec succès.'
        });
      }
    }

    // Fallback response for instant demo simulation when API keys are not set
    return NextResponse.json({
      success: true,
      directPay: true,
      voteId: voteId,
      transId: `sim_${voteId}`,
      link: null,
      message: 'Vote enregistré en mode simulation.'
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de l’initialisation du vote' },
      { status: 500 }
    );
  }
}
