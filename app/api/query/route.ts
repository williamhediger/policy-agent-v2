import { NextRequest, NextResponse } from "next/server";
import { loadAndQuery } from "../../../src/lib/langchain";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ answer: "Missing question." }, { status: 400 });
    }
    const answer = await loadAndQuery(question);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ answer: "Internal error." }, { status: 500 });
  }
}
