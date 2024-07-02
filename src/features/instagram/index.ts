import { load } from "cheerio";

import {
  getPostPageHTML,
  getPostGraphqlData,
} from "@/services/instagram/requests";

import { VideoInfo } from "@/types";
import { HTTPError } from "@/lib/errors";

import { INSTAGRAM_CONFIGS } from "./constants";
import { formatGraphqlJson, formatPageJson, getPostIdFromUrl } from "./utils";

const getVideoJsonFromHTML = async (postId: string) => {
  const data = await getPostPageHTML({ postId });

  const postHtml = load(data);
  const videoElement = postHtml("meta[property='og:video']");

  if (videoElement.length === 0) {
    return null;
  }

  const videoInfo = formatPageJson(postHtml);
  return videoInfo;
};

const getVideoJSONFromGraphQL = async (postId: string) => {
  const data = await getPostGraphqlData({ postId });

  return data;
};

export const getVideoInfo = async (postId: string) => {
  let videoInfo: any = null;

  // if (INSTAGRAM_CONFIGS.enableWebpage) {
  //   videoInfo = await getVideoJsonFromHTML(postId);
  //   if (videoInfo) return videoInfo;
  // }

  if (INSTAGRAM_CONFIGS.enableGraphQL) {
    videoInfo = await getVideoJSONFromGraphQL(postId);
    if (videoInfo) return videoInfo;
  }

  throw new HTTPError("Video link for this post is not public.", 401);
};
