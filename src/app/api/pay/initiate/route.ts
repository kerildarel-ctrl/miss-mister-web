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
      phone = ''
    } = body;

    const voteId = `vote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // HARDCODED ACTIVE FAPSHI LIVE CREDENTIALS (IMMUNE TO NETLIFY ENV VAR MISSES)
    const fapshiApiUser = '2aa10fd5-e2e0-4f94-bc2f-01585657f418';
    const fapshiApiKey = 'FAK_f8e3d6d682775ca2f34e34c80da6ccc6';
    const fapshiBaseUrl = 'https://live.fapshi.com';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://miss-mister-web.netlify.app';

    // Clean phone number to 9 digits (e.g. 699000000 or 670000000)
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
          payment_method: 'mobile_money',
          payment_status: 'PENDING',
          created_at: new Date().toISOString()
        }
      ]);
    } catch {
      // Continue
    }

    // 2. FAPSHI DIRECT PAY (USSD Push Prompt directly to phone screen)
    // NOTE: Fapshi auto-detects Orange Money vs MTN Mobile Money from phone number prefix. Do NOT pass 'medium' field.
    if (cleanPhone && cleanPhone.length === 9) {
      console.log(`[FAPSHI] Calling Direct Pay for phone: ${cleanPhone}, amount: ${amount}`);
      
      const directPayRes = await fetch(`${fapshiBaseUrl}/direct-pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiuser': fapshiApiUser,
          'apikey': fapshiApiKey
        },
        body: JSON.stringify({
          amount: Number(amount),
          phone: cleanPhone,
          userId: candidateId,
          externalId: voteId,
          webhookUrl: `${siteUrl}/api/pay/webhook`,
          message: `Vote MISS MISTER (${voteCount} vote(s)) pour ${candidateName}`,
          email: 'voter@missmister.com'
        })
      });

      const directPayData = await directPayRes.json();
      console.log('[FAPSHI] Direct Pay API response:', directPayData);

      if (directPayRes.ok && (directPayData.transId || directPayData.id)) {
        return NextResponse.json({
          success: true,
          directPay: true,
          voteId: voteId,
          transId: directPayData.transId || directPayData.id,
          phone: cleanPhone,
          message: 'Un prompt de confirmation a été envoyé directement sur votre téléphone.'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: directPayData?.message || directPayData?.error || 'Erreur d’envoi de la demande de paiement.'
        }, { status: 400 });
      }
    }

    // 3. FAPSHI HOSTED CHECKOUT LINK (Fallback if phone is not 9 digits)
    const fapshiResponse = await fetch(`${fapshiBaseUrl}/initiate-pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiuser': fapshiApiUser,
        'apikey': fapshiApiKey
      },
      body: JSON.stringify({
        amount: Number(amount),
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

    return NextResponse.json({
      success: false,
      error: fapshiData?.message || fapshiData?.error || 'Erreur lors de l’initialisation du paiement Fapshi.'
    }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur serveur lors du paiement' },
      { status: 500 }
    );
  }
}
