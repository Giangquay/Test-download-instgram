import { NextRequest, NextResponse } from "next/server";
// TobyG74
const Tiktok = require("@tobyg74/tiktok-api-dl");
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.url) {
      return NextResponse.json({ error: "Please provide an invalid link" });
    }
    let video;
    if (body.url.includes("photo")) {
      video = await Tiktok.Downloader(body.url.replace("photo", "video"));
    } else {
      video = await Tiktok.Downloader(body.url, { version: "v1" });
      if (video.status === "error") {
        video = await Tiktok.Downloader(body.url, { version: "v3" });
      }
    }

    if (!video) {
      return NextResponse.json({ error: "Video does not exist" });
    }
    return NextResponse.json({ data: video });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
