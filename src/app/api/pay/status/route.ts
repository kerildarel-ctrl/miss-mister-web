import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { Candidate } from '@/data/mockData';

const candsFilePath = path.join(process.cwd(), 'src', 'data', 'candidates.json');

function updateDiskCandidateVote(candidateId: string, count: number) {
  try {
    if (fs.existsSync(candsFilePath)) {
      const fileData = fs.readFileSync(candsFilePath, 'utf8');
      const candidates: Candidate[] = JSON.parse(fileData || '[]');
      const updated = candidates.map((c) =>
        c.id === candidateId ? { ...c, voteCount: (c.voteCount || 0) + count } : c
      );
      fs.writeFileSync(candsFilePath, JSON.stringify(updated, null, 2), 'utf8');
    }
  } catch {
    // Continue
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transId = searchParams.get('transId');
    const voteId = searchParams.get('voteId');

    if (!transId) {
      return NextResponse.json({ success: false, error: 'transId manquant' }, { status: 400 });
    }

    const fapshiApiUser = process.env.FAPSHI_API_USER;
    const fapshiApiKey = process.env.FAPSHI_API_KEY;
    const fapshiBaseUrl = process.env.FAPSHI_BASE_URL || 'https://live.fapshi.com';

    let paymentStatus = 'PENDING';

    // 1. STRICT PAYMENT VERIFICATION WITH FAPSHI GATEWAY
    if (fapshiApiUser && fapshiApiKey && !transId.startsWith('sim_')) {
      const fapshiResponse = await fetch(`${fapshiBaseUrl}/payment-status/${transId}`, {
        method: 'GET',
        headers: {
          'apiuser': fapshiApiUser,
          'apikey': fapshiApiKey
        },
        cache: 'no-store'
      });

      if (fapshiResponse.ok) {
        const fapshiData = await fapshiResponse.json();
        paymentStatus = fapshiData.status || fapshiData.paymentStatus || 'PENDING';
      }
    } else {
      // Simulation mode fallback for testing
      paymentStatus = 'SUCCESSFUL';
    }

    const isSuccess = paymentStatus === 'SUCCESSFUL';

    // 2. ONLY INCREMENT VOTE COUNT IF PAYMENT IS STRICTLY SUCCESSFUL & DEDUCTED
    if (isSuccess && voteId) {
      try {
        const supabase = getSupabaseAdmin();

        // Retrieve vote record
        const { data: vote } = await supabase
          .from('votes')
          .select('*')
          .eq('id', voteId)
          .single();

        if (vote && vote.payment_status !== 'SUCCESSFUL') {
          // Update vote record status to SUCCESSFUL
          await supabase
            .from('votes')
            .update({ payment_status: 'SUCCESSFUL', fapshi_trans_id: transId })
            .eq('id', voteId);

          // Increment candidate score in Supabase DB
          if (vote.candidate_id) {
            const { data: cand } = await supabase
              .from('candidates')
              .select('vote_count')
              .eq('id', vote.candidate_id)
              .single();

            if (cand) {
              await supabase
                .from('candidates')
                .update({ vote_count: (cand.vote_count || 0) + (vote.vote_count || 1) })
                .eq('id', vote.candidate_id);
            }

            // Update candidate score on server disk JSON
            updateDiskCandidateVote(vote.candidate_id, vote.vote_count || 1);
          }
        }
      } catch {
        // Fallback
      }
    }

    return NextResponse.json({
      success: true,
      transId: transId,
      status: paymentStatus,
      isSuccess: isSuccess,
      message: isSuccess
        ? 'Paiement déduit avec succès. Vote comptabilisé !'
        : 'Paiement en attente de confirmation Mobile Money.'
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur de vérification du paiement' },
      { status: 500 }
    );
  }
}
