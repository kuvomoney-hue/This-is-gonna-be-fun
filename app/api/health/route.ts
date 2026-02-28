import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "public/data");
    const files = fs.readdirSync(dataDir);
    
    const fileStats = files
      .filter(f => f.endsWith('.json'))
      .map(file => {
        const filePath = path.join(dataDir, file);
        const stats = fs.statSync(filePath);
        const size = stats.size;
        
        // Try to read and validate JSON
        let valid = false;
        let hasData = false;
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const json = JSON.parse(content);
          valid = true;
          hasData = Object.keys(json).length > 0;
        } catch (e) {
          // Invalid JSON
        }
        
        return {
          file,
          size,
          valid,
          hasData,
          modified: stats.mtime.toISOString(),
        };
      });
    
    return NextResponse.json({
      status: "healthy",
      dataDirectory: "public/data",
      filesFound: fileStats.length,
      files: fileStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
