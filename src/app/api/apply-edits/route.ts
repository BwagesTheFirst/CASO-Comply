import { NextRequest, NextResponse } from "next/server";

const CASO_API_URL =
  process.env.NEXT_PUBLIC_CASO_API_URL || "http://localhost:8787";

interface TagAssignment {
  type: string;
  text: string;
  page: number;
  mcid: number;
  font_size: number;
  bbox: [number, number, number, number];
}

interface ApplyEditsRequest {
  file_id: string;
  edits: TagAssignment[];
}

export async function POST(req: NextRequest) {
  let body: ApplyEditsRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body.file_id || typeof body.file_id !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid file_id" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.edits) || body.edits.length === 0) {
    return NextResponse.json(
      { error: "Missing or empty edits array" },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${CASO_API_URL}/api/apply-edits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_id: body.file_id,
        edits: body.edits,
      }),
      signal: AbortSignal.timeout(120_000),
    });

    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => "Unknown error");
      return NextResponse.json(
        { error: `Upstream API error: ${upstream.status}`, detail: errorText },
        { status: upstream.status }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to reach remediation API";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
