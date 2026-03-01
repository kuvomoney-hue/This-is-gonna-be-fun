/**
 * Obsidian Inventory System
 * Beautiful, markdown-first inventory management for WayofWoof
 * Updates Obsidian vault → Git commit → Syncs to Google Sheet
 */

import fs from 'fs/promises';
import path from 'path';
import simpleGit from 'simple-git';

const VAULT_PATH = '/Users/koovican/Documents/Obsidian Vault';
const INVENTORY_PATH = path.join(VAULT_PATH, 'WayofWoof/Inventory/Ingredients');

interface IngredientUpdate {
  ingredient: string;
  stock: number;
  unit?: string;
  threshold?: number;
  supplier?: string;
  cost_per_unit?: number;
}

/**
 * Update an ingredient's stock level in Obsidian
 * Writes to markdown file with beautiful formatting
 */
export async function updateIngredientStock(
  ingredient: string,
  stock: number
): Promise<void> {
  // Convert ingredient name to filename (e.g., "Pumpkin Powder" → "Pumpkin-Powder.md")
  const filename = ingredient.replace(/ /g, '-') + '.md';
  const filepath = path.join(INVENTORY_PATH, filename);

  // Read current file
  let content = '';
  try {
    content = await fs.readFile(filepath, 'utf-8');
  } catch (err) {
    throw new Error(`Ingredient file not found: ${ingredient}`);
  }

  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    throw new Error(`Invalid markdown format for ${ingredient}`);
  }

  const frontmatter = frontmatterMatch[1];
  const bodyStart = frontmatterMatch[0].length;
  const body = content.slice(bodyStart);

  // Update stock in frontmatter
  const updatedFrontmatter = frontmatter
    .split('\n')
    .map(line => {
      if (line.startsWith('stock:')) {
        return `stock: ${stock}`;
      }
      if (line.startsWith('updated:')) {
        return `updated: ${new Date().toISOString()}`;
      }
      return line;
    })
    .join('\n');

  // Recalculate status and fill rate
  const thresholdMatch = frontmatter.match(/threshold: ([\d.]+)/);
  const threshold = thresholdMatch ? parseFloat(thresholdMatch[1]) : 0;
  
  const status = stock >= threshold ? 'ok' : stock > 0 ? 'low' : 'out';
  const needsReorder = stock < threshold;
  const fillRate = threshold > 0 ? ((stock / threshold) * 100).toFixed(1) : 0;

  const costMatch = frontmatter.match(/cost_per_unit: ([\d.]+)/);
  const costPerUnit = costMatch ? parseFloat(costMatch[1]) : 0;
  const totalValue = ((stock / 1000) * costPerUnit).toFixed(2);

  // Update calculated fields
  const finalFrontmatter = updatedFrontmatter
    .split('\n')
    .map(line => {
      if (line.startsWith('status:')) return `status: "${status}"`;
      if (line.startsWith('needs_reorder:')) return `needs_reorder: ${needsReorder}`;
      if (line.startsWith('total_value:')) return `total_value: ${totalValue}`;
      return line;
    })
    .join('\n');

  // Update body content
  const updatedBody = body.replace(
    /## Current Stock\n- \*\*On Hand\*\*: [\d.]+g/,
    `## Current Stock\n- **On Hand**: ${stock}g`
  ).replace(
    /- \*\*Fill Rate\*\*: [\d.]+%/,
    `- **Fill Rate**: ${fillRate}%`
  ).replace(
    /- \*\*Total Value\*\*: \$[\d.]+/,
    `- **Total Value**: $${totalValue}`
  ).replace(
    /## Reorder\n[^\n]+/,
    status === 'ok' 
      ? '## Reorder\nStock levels good.'
      : status === 'low'
      ? `## Reorder\n⚠️ Low stock — reorder soon (${stock}g / ${threshold}g threshold)`
      : '## Reorder\n🚨 OUT OF STOCK — reorder immediately'
  );

  // Write updated file
  const finalContent = `---\n${finalFrontmatter}\n---${updatedBody}`;
  await fs.writeFile(filepath, finalContent, 'utf-8');

  console.log(`✅ Updated ${ingredient}: ${stock}g (${status})`);
}

/**
 * Log a batch to Obsidian
 * Creates a batch note in WayofWoof/Inventory/Batches/
 */
export async function logBatchToObsidian(
  product: string,
  quantity: number,
  notes: string,
  by: string = 'Big Papa'
): Promise<string> {
  const batchesPath = path.join(VAULT_PATH, 'WayofWoof/Inventory/Batches');
  
  // Generate batch ID
  const files = await fs.readdir(batchesPath);
  const batchFiles = files.filter(f => f.startsWith('BATCH-'));
  const nextNum = batchFiles.length + 1;
  const batchId = `BATCH-${String(nextNum).padStart(3, '0')}`;
  
  const today = new Date().toISOString().split('T')[0];
  const timestamp = new Date().toISOString();
  
  // Create batch note
  const content = `---
batch_id: ${batchId}
date: ${today}
product: ${product}
quantity: ${quantity}
by: ${by}
timestamp: ${timestamp}
tags: [wayofwoof, batch, production]
---

# ${batchId} — ${product}

**Date**: ${today}  
**Quantity**: ${quantity} units  
**By**: ${by}

## Notes
${notes || 'No additional notes.'}

## Related
- [[WayofWoof/Products/${product.replace(/ /g, '-')}|${product}]]
- [[WayofWoof/Inventory/Full-Inventory|Full Inventory]]
- [[WayofWoof/Dashboard|Dashboard]]
`;

  const filename = `${batchId}-${today}.md`;
  await fs.writeFile(path.join(batchesPath, filename), content, 'utf-8');
  
  console.log(`✅ Logged batch ${batchId}: ${quantity}x ${product}`);
  return batchId;
}

/**
 * Commit and push changes to git
 * Beautiful commit messages with emojis
 */
export async function commitInventoryChanges(
  message: string
): Promise<void> {
  const git = simpleGit(VAULT_PATH);
  
  try {
    // Add changed files
    await git.add([
      'WayofWoof/Inventory/Ingredients/*.md',
      'WayofWoof/Inventory/Batches/*.md',
      'WayofWoof/Inventory/Live-Inventory.md',
      'WayofWoof/Inventory/Full-Inventory.md',
    ]);
    
    // Commit with emoji
    const emoji = message.includes('batch') ? '📦' : '📊';
    await git.commit(`${emoji} ${message}`);
    
    // Push (if remote exists)
    try {
      await git.push();
      console.log('✅ Pushed to git');
    } catch (err) {
      console.log('⚠️ No git remote configured (local only)');
    }
    
  } catch (err: any) {
    console.error('Git commit failed:', err.message);
    // Don't throw — file update succeeded even if git failed
  }
}

/**
 * Update stock with git commit
 */
export async function updateStockWithCommit(
  ingredient: string,
  stock: number
): Promise<void> {
  await updateIngredientStock(ingredient, stock);
  await commitInventoryChanges(`Update ${ingredient} stock to ${stock}g`);
}

/**
 * Log batch with git commit
 */
export async function logBatchWithCommit(
  product: string,
  quantity: number,
  notes: string,
  by: string = 'Big Papa'
): Promise<string> {
  const batchId = await logBatchToObsidian(product, quantity, notes, by);
  await commitInventoryChanges(`Log ${batchId}: ${quantity}x ${product}`);
  return batchId;
}
