import { NextResponse } from "next/server";

import { HTTPError } from "@/lib/errors";
import { makeErrorResponse, makeSuccessResponse } from "@/lib/http";
import { INSTAGRAM_CONFIGS } from "@/features/instagram/constants";
import { getPostIdFromUrl } from "@/features/instagram/utils";
// const instagramDl = require("@sasmeee/igdl");

// // const { igdl } = require("imran-download-servar");
// const instagramGetUrl = require("instagram-url-direct");

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
  // let links = await instagramDl(postUrl);
  // const links = await instagramDl(postUrl);
  return NextResponse.json(postId, { status: 200 });
}
