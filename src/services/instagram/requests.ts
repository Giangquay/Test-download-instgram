import { apiClient } from "@/lib/api-client";

import { GraphQLResponse } from "@//features/instagram/types";
import { encodeGraphqlRequestData } from "@/features/instagram/utils";

import { InstagramEndpoints } from "./constants";

export async function getPostPageHTML({
  postId,
}: {
  postId: string;
}): Promise<string> {
  const res = await apiClient.get(`${InstagramEndpoints.GetByPost}/${postId}`, {
    baseURL: "https://www.instagram.com",
    headers: {
      accept: "*/*",
      host: "www.instagram.com",
      referer: "https://www.instagram.com/",
      DNT: "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
    },
  });

  const data = await res.text();

  return data;
}

export async function getPostGraphqlData({
  postId,
}: {
  postId: string;
}): Promise<GraphQLResponse> {
  const encodedData = encodeGraphqlRequestData(postId);

  const res = await apiClient.post(InstagramEndpoints.GetByGraphQL, {
    baseURL: "https://www.instagram.com",
    body: encodedData,
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-FB-Friendly-Name": "QuickPromotionIGWebBatchFetchQuery",
      "X-CSRFToken": "RVDUooU5MYsBbS1CNN3CzVAuEP8oHB52",
      "X-IG-App-ID": "1217981644879628",
      "X-FB-LSD": "AVqbxe3J_YA",
      "X-ASBD-ID": "129477",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/125.0.0.0",
    },
  });

  const data = await res.json();

  return data;
}
