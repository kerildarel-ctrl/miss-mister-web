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
    
    // Primary & Fallback Fapshi API Credentials
    const primaryApiUser = process.env.FAPSHI_API_USER || '2aa10fd5-e2e0-4f94-bc2f-01585657f418';
    const primaryApiKey = process.env.FAPSHI_API_KEY || 'FAK_f8e3d6d682775ca2f34e34c80da6ccc6';
    const backupApiKey = 'FAK_33a74dc61c2d8b6046d9ab212d375885';
    
    const fapshiBaseUrl = process.env.FAPSHI_BASE_URL || 'https://live.fapshi.com';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://miss-mister-web.netlify.app';

    // Format phone number to clean 9 digits (e.g., 699000000 or 670000000)
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

    // Helper function to call Fapshi Direct Pay
    const tryDirectPay = async (apiKey: string) => {
      const res = await fetch(`${fapshiBaseUrl}/direct-pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiuser': primaryApiUser,
          'apikey': apiKey
        },
        body: JSON.stringify({
          amount: Number(amount),
          phone: cleanPhone,
          medium: paymentMethod === 'orange' ? 'OM' : 'MOMO',
          userId: candidateId,
          externalId: voteId,
          webhookUrl: `${siteUrl}/api/pay/webhook`,
          message: `Vote MISS MISTER (${voteCount} vote(s)) pour ${candidateName}`,
          email: 'voter@missmister.com'
        })
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    };

    // 2. FAPSHI DIRECT PAY (USSD Push Prompt directly to phone screen)
    if (cleanPhone && cleanPhone.length === 9) {
      // Try with primary new API key first
      let directRes = await tryDirectPay(primaryApiKey);

      // If invalid apiuser or apikey error, try backup API key
      if (!directRes.ok && directRes.data?.message?.includes('Invalid')) {
        console.log('Primary key invalid, switching to verified backup key...');
        directRes = await tryDirectPay(backupApiKey);
      }

      if (directRes.ok && (directRes.data.transId || directRes.data.id)) {
        return NextResponse.json({
          success: true,
          directPay: true,
          voteId: voteId,
          transId: directRes.data.transId || directRes.data.id,
          phone: cleanPhone,
          message: 'Un prompt de confirmation a été envoyé directement sur votre téléphone.'
        });
      }
    }

    // 3. FAPSHI HOSTED CHECKOUT LINK (Fallback when no phone is entered)
    const fapshiResponse = await fetch(`${fapshiBaseUrl}/initiate-pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiuser': primaryApiUser,
        'apikey': backupApiKey // Use verified working key
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
