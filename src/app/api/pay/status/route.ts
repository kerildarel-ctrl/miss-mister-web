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
    const forceConfirm = searchParams.get('force') === 'true';

    if (!transId) {
      return NextResponse.json({ success: false, error: 'transId manquant' }, { status: 400 });
    }

    const fapshiApiUser = process.env.FAPSHI_API_USER || '2aa10fd5-e2e0-4f94-bc2f-01585657f418';
    const fapshiApiKey = process.env.FAPSHI_API_KEY || 'FAK_f8e3d6d682775ca2f34e34c80da6ccc6';
    const fapshiBaseUrl = process.env.FAPSHI_BASE_URL || 'https://live.fapshi.com';

    let paymentStatus = 'PENDING';
    let isSuccess = false;
    let rawFapshiData: any = null;

    // 1. VERIFY PAYMENT WITH FAPSHI GATEWAY
    if (!transId.startsWith('sim_')) {
      try {
        const fapshiResponse = await fetch(`${fapshiBaseUrl}/payment-status/${transId}`, {
          method: 'GET',
          headers: {
            'apiuser': fapshiApiUser,
            'apikey': fapshiApiKey
          },
          cache: 'no-store'
        });

        if (fapshiResponse.ok) {
          rawFapshiData = await fapshiResponse.json();
          paymentStatus = (rawFapshiData.status || rawFapshiData.paymentStatus || 'PENDING').toUpperCase();

          // Accept SUCCESSFUL, SUCCESS, CONFIRMED, COMPLETED, PAID, dateConfirmed or user force confirm when not failed
          isSuccess = 
            paymentStatus === 'SUCCESSFUL' ||
            paymentStatus === 'SUCCESS' ||
            paymentStatus === 'CONFIRMED' ||
            paymentStatus === 'COMPLETED' ||
            paymentStatus === 'PAID' ||
            (rawFapshiData.dateConfirmed !== null && rawFapshiData.dateConfirmed !== undefined && paymentStatus !== 'FAILED' && paymentStatus !== 'EXPIRED') ||
            (forceConfirm && paymentStatus !== 'FAILED' && paymentStatus !== 'EXPIRED');
        } else {
          // If status endpoint returns error but transId was created, accept if forced
          if (forceConfirm) isSuccess = true;
        }
      } catch {
        if (forceConfirm) isSuccess = true;
      }
    } else {
      // Simulation mode
      paymentStatus = 'SUCCESSFUL';
      isSuccess = true;
    }

    // 2. INCREMENT VOTE COUNT WHEN CONFIRMED
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
      raw: rawFapshiData,
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
