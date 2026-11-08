import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Aura/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `YouTube returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      title: data.title ?? "YouTube Audio",
      author_name: data.author_name ?? "YouTube Artist",
      thumbnail_url: data.thumbnail_url,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch YouTube metadata" },
      { status: 500 }
    );
  }
}
