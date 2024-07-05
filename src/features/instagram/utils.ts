import { CheerioAPI } from "cheerio";
import querystring from "querystring";

import { getTimedFilename } from "@/lib/utils";

import { VideoInfo } from "@/types";
import { MediaData } from "./types";

export const getIGVideoFileName = () =>
  getTimedFilename("ig-downloader", "mp4");

export const getPostIdFromUrl = (postUrl: string) => {
  const postRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/;
  const reelRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;

  return postUrl.match(postRegex)?.at(-1) || postUrl.match(reelRegex)?.at(-1);
};

export const encodeGraphqlRequestData = (shortcode: string) => {
  const requestData = {
    av: "0",
    __d: "www",
    __user: "0",
    __a: "1",
    __req: "3",
    __hs: "19906.HYP:instagram_web_pkg.2.1..0.0",
    dpr: "3",
    __ccg: "UNKNOWN",
    __rev: "1014604059",
    __s: "oc4dsp:1nt3v4:75x762",
    __hsi: "7386875971548327627",
    __dyn:
      "7xeUjG1mxu1syUbFp40NonwgU7SbzEdF8aUco2qwJw5ux609vCwjE1xoswaq0yE7i0n24oaEd86a3a1YwBgao6C0Mo2iyo7u3i4U2zxe2GewGw9a362W2K0zK5o4q3y1Sx-0iS2Sq2-azo7u1xwIwbS1LwTwKG1pg2Xwr86C1mwrd6goK2O4UrAwCAxW6Uf9EObzVU8U",
    __csr:
      "gg8dMzsl5TFqtO5nOAjtqHRmAJp24ZGiBJlq-GhQjGHVeQVuHBheUBfBzWmmVfCFaQqECA8Dx2iQXhF9WgCWpqWAG6p44VGCLAHUz-V99VqCUbrUCtoxqBHxfDzEkBDyXypFUC5XoCegy00lO20Ejwywc50r21v-04TU0rXDhFRC50bW0M8y5t3A2MMfut8M2Tx507rw9K0NE1G41w40147w5vzE02gMw",
    __comet_req: "7",
    lsd: "AVr6h1MO5Go",
    jazoest: "2934",
    __spin_r: "1014604059",
    __spin_b: "trunk",
    __spin_t: "1719891087",
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
    variables: JSON.stringify({
      shortcode: shortcode,
      fetch_comment_count: 40,
      parent_comment_count: 24,
      child_comment_count: 3,
      fetch_like_count: 10,
      fetch_tagged_user_count: null,
      fetch_preview_comment_count: 2,
      has_threaded_comments: true,
      hoisted_comment_id: null,
      hoisted_reply_id: null,
    }),
    server_timestamps: "true",
    doc_id: "25531498899829322",
  };
  const encoded = querystring.stringify(requestData);
  return encoded;
};

export const formatGraphqlJson = (data: MediaData) => {
  const filename = getIGVideoFileName();
  const width = data.dimensions.width.toString();
  const height = data.dimensions.height.toString();
  const videoUrl = data.video_url;

  const videoJson: VideoInfo = {
    filename,
    width,
    height,
    videoUrl,
  };

  return videoJson;
};

export const formatPageJson = (postHtml: CheerioAPI) => {
  const videoElement = postHtml("meta[property='og:video']");

  if (videoElement.length === 0) {
    return null;
  }

  const videoUrl = videoElement.attr("content");
  if (!videoUrl) return null;

  const width =
    postHtml("meta[property='og:video:width']").attr("content") ?? "";
  const height =
    postHtml("meta[property='og:video:height']").attr("content") ?? "";

  const filename = getIGVideoFileName();

  const videoJson: VideoInfo = {
    filename,
    width,
    height,
    videoUrl,
  };

  return videoJson;
};

export const isValidInstagramURL = (postUrl: string) => {
  if (!postUrl) {
    return "Instagram URL was not provided";
  }

  if (!postUrl.includes("instagram.com/")) {
    return "Invalid URL does not contain Instagram domain";
  }

  if (!postUrl.startsWith("https://")) {
    return 'Invalid URL it should start with "https://www.instagram.com..."';
  }

  const postRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/;

  const reelRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;

  if (!postRegex.test(postUrl) && !reelRegex.test(postUrl)) {
    return "URL does not match Instagram post or reel";
  }

  return "";
};
