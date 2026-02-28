import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_ID = process.env.WOOF_SHEET_ID || '11SgIzbobjs7u6RFeN-mJYrfqYOQJHPY8ab6S13pFXxo';

// Server-side credentials (use service account for production)
// For now, we'll use a simple approach with API key or manual OAuth
export async function POST(request: NextRequest) {
  try {
    const { ingredient, newStock, unit } = await request.json();

    if (!ingredient || newStock === undefined) {
      return NextResponse.json(
        { error: 'Missing ingredient or newStock' },
        { status: 400 }
      );
    }

    // For now, return success (client-side will handle actual update)
    // In production, you'd use service account credentials here
    return NextResponse.json({
      success: true,
      ingredient,
      newStock,
      unit,
      message: 'Update queued (manual sheet update required for now)',
    });
  } catch (error) {
    console.error('Inventory update error:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
