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
    __hs: "19624.HYP:instagram_web_pkg.2.1..0.0",
    dpr: "3",
    __ccg: "UNKNOWN",
    __rev: "1014225007",
    __s: "tenn85:noxj0g:5mecg3",
    __hsi: "7380267066089280555",
    __dyn:
      "7xeUjG1mxu1syUbFp40NonwgU7SbzEdF8aUco2qwJw5ux609vCwjE1xoswaq0yE7i0n24oaEd86a3a1YwBgao6C0Mo2iyo7u3i4U2zxe2GewGw9a362W2K0zK5o4q3y1Sx-0iS2Sq2-azo7u1xwIwbS1LwTwKG1pg2Xwr86C1mwrd6goK2O4UrAwCAxW6Uf9EObzVU8U",
    __csr:
      "s8gqPhSBkLin5FuAJWmmGQB9ivETGOuiVG9KFFQiiQtJeQHLBVWjiy7Kq4pUy-FcFJ4F4AVF-A8zt7zppah94lki4QcJ-XL-Zbzumax2mq4rwwgy8iCgmG_zpEjBGVA4ogtel1eCi8yKUoJ0Axam9w05tUxa5dwry1uh042g0VW07J4x98bo60sQaxe363a1Ixa0zoixja0cnwd20vAU0-Su0ia00BO8",
    __comet_req: "7",
    lsd: "AVp1qTQY1qE",
    jazoest: "2910",
    __spin_r: "1014225007",
    __spin_b: "trunk",
    __spin_t: "1718352331",
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
    variables: JSON.stringify({
      shortcode: shortcode,
      fetch_comment_count: "null",
      fetch_related_profile_media_count: "null",
      parent_comment_count: "null",
      child_comment_count: "null",
      fetch_like_count: "null",
      fetch_tagged_user_count: "null",
      fetch_preview_comment_count: "null",
      has_threaded_comments: "false",
      hoisted_comment_id: "null",
      hoisted_reply_id: "null",
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
