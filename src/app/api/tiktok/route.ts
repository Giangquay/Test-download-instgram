import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
// TobyG74
// const { Headers } = require("node-fetch");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.url) {
      return NextResponse.json({ error: "Please provide an invalid link" });
    }
    const data = await axios.options(
      "https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/?aweme_id=7359954067986173191&iid=7318518857994389254&device_id=7318517321748022790&channel=googleplay&app_name=musical_ly&version_code=300904&device_platform=android&device_type=ASUS_Z01QD&version=9"
    );

    return NextResponse.json({ data: data.data });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
