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
      "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
      "X-CSRFToken": "Ulh5GMqVpS1c3YjJzwiM3v",
      "X-IG-App-ID": "936619743392459",
      "X-FB-LSD": "AVr6h1MO5Go",
      cookie:
        "csrftoken=Ulh5GMqVpS1c3YjJzwiM3v; dpr=1.1979166269302368; mid=ZoN0VQALAAE_ATNF-OdK00uM9X1v; ig_did=0AD2C0D5-1203-40E6-9FFE-21B609D6A13C; datr=VXSDZs-ptKFamiRgJ3cFcO3I; wd=1595x318; ig_nrcb=1",
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
