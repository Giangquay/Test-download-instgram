import { NextResponse } from "next/server";

import { HTTPError } from "@/lib/errors";
import { makeErrorResponse, makeSuccessResponse } from "@/lib/http";

import { VideoInfo } from "@/types";
import { getVideoInfo } from "@/features/instagram";
import { INSTAGRAM_CONFIGS } from "@/features/instagram/constants";
import { getPostIdFromUrl } from "@/features/instagram/utils";
import axios from "axios";

function handleError(error: any) {
  if (error instanceof HTTPError) {
    const response = makeErrorResponse(error.message);
    return NextResponse.json(response, { status: error.status });
  } else {
    console.error(error);
    const response = makeErrorResponse();
    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!INSTAGRAM_CONFIGS.enableServerAPI) {
    const notImplementedResponse = makeErrorResponse("Not Implemented");
    return NextResponse.json(notImplementedResponse, { status: 501 });
  }

  const postUrl = new URL(request.url).searchParams.get("postUrl");
  if (!postUrl) {
    const badRequestResponse = makeErrorResponse("Post URL is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }

  const postId = getPostIdFromUrl(postUrl);
  const data = await axios.get(
    `https://www.instagram.com/p/${postId}/?__a=1&__d=dis`,
    {
      headers: {
        "Content-Type": "application/json",
        Cookie:
          "csrftoken=GY8fc5OXHKrtFDs4C3tdqyfZPh1gixde; ig_did=8C45A16A-CBCC-4DDE-A290-45D326C6DA2A; ig_nrcb=1; mid=ZoN_zwAEAAHVSo0NOROu1Ah4lrnS",
      },
    }
  );
  return NextResponse.json(data.data, { status: 200 });
}
