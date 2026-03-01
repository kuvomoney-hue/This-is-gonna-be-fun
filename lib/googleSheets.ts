/**
 * Google Sheets API utilities for WayofWoof inventory management
 * Uses service account credentials for Vercel deployment
 */

import { google } from 'googleapis';

const SHEET_ID = '11SgIzbobjs7u6RFeN-mJYrfqYOQJHPY8ab6S13pFXxo';

/**
 * Get authenticated Google Sheets client
 * Uses service account credentials from environment variables or file
 */
function getAuthClient() {
  // Try environment variable first (Vercel deployment)
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  // Fallback to local file (development)
  const credentialsPath = '/Users/koovican/.openclaw/workspace/bot/google_sheets_creds.json';
  return new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

/**
 * Update stock level for a specific ingredient
 */
export async function updateStock(ingredient: string, newStock: number): Promise<void> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  // Read current inventory to find the ingredient row
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Inventory!A2:F100',
  });

  const rows = result.data.values || [];

  // Find ingredient row
  let rowIndex: number | null = null;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i] && rows[i][0] === ingredient) {
      rowIndex = i + 2; // +2 because A2 is row 2 (1-indexed + header)
      break;
    }
  }

  if (rowIndex === null) {
    throw new Error(`Ingredient "${ingredient}" not found in sheet`);
  }

  // Update stock (column B)
  const updateRange = `Inventory!B${rowIndex}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: updateRange,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[newStock]],
    },
  });

  console.log(`✅ Updated ${ingredient} stock to ${newStock}`);
}

/**
 * Log a batch production run
 */
export async function logBatch(
  product: string,
  quantity: number,
  notes: string,
  by: string
): Promise<string> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  // Get current batches to determine next batch ID
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Batches!A2:G100',
  });

  const rows = result.data.values || [];
  const nextBatchNum = rows.length + 1;
  const batchId = `BATCH-${String(nextBatchNum).padStart(3, '0')}`;

  // Get product cost
  const productsResult = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Products!A2:D20',
  });

  const productRows = productsResult.data.values || [];
  let unitCost = 0;

  for (const row of productRows) {
    if (row && row[0] === product) {
      unitCost = parseFloat(row[2]); // Column C = Unit Cost
      break;
    }
  }

  if (unitCost === 0) {
    throw new Error(`Product "${product}" not found or has invalid cost`);
  }

  const totalCost = unitCost * quantity;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Append new batch row
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Batches!A2:G2',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[today, product, quantity, notes, by, totalCost, batchId]],
    },
  });

  console.log(`✅ Logged batch ${batchId}: ${quantity}x ${product}`);
  return batchId;
}

/**
 * Get current inventory data
 */
export async function getInventory(): Promise<any[]> {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Inventory!A2:F100',
  });

  const rows = result.data.values || [];
  
  return rows.map(row => ({
    ingredient: row[0],
    stock: parseFloat(row[1]) || 0,
    unit: row[2],
    threshold: parseFloat(row[3]) || 0,
    supplier: row[4],
    cost_per_unit: parseFloat(row[5]) || 0,
    status: parseFloat(row[1]) >= parseFloat(row[3]) ? 'ok' : parseFloat(row[1]) > 0 ? 'low' : 'out',
  }));
}
