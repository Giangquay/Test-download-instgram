import { NextApiRequest, NextApiResponse } from "next";
// const { Headers } = require("node-fetch");
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body == "string") {
        body = JSON.parse(body);
      }
      // console.log(body.url);
      const headers = new Headers();
      let videoId = null;
      if (body.url.includes("video")) {
        videoId = body.url.match(/video\/(\d+)/)[1];
      } else if (body.url.includes("photo")) {
        videoId = body.url.match(/photo\/(\d+)/)[1];
      }
      const API_URL = `https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/?aweme_id=7306302809719328001&iid=7318518857994389254&device_id=7318517321748022790&channel=googleplay&app_name=musical_ly&version_code=300904&device_platform=android&device_type=ASUS_Z01QD&version=9`;
      const requestAPI = await fetch(API_URL, {
        method: "OPTIONS",
        headers: headers,
      });
      return res.status(200).json({ data: await requestAPI.json() });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
export const config = {
  api: {
    responseLimit: false,
  },
};
