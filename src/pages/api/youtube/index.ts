import {
  convertToHoursMinutesSeconds,
  extractVideoYT,
} from "@/extractors/youtube";
import { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
const ytdl = require("@distube/ytdl-core");
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body == "string") {
        body = JSON.parse(body);
      }
      if (!body.url) {
        return res.status(400).json({ error: "Please provide a valid link" });
      }
      const checkLink = await ytdl.validateURL(body.url);
      if (!checkLink) {
        return res.status(400).json({ error: "Link youtube is not exists" });
      }
      const { videoDetails, thumbnail_url, formats } = await ytdl.getInfo(
        body.url
      );
      if (!videoDetails) {
        return res.status(400).json({
          error: "link youtube is not exists",
        });
      }
      // const infor = await ytdl.getInfo(body.url);
      const videoFormats: any = await ytdl.filterFormats(
        formats,
        "audioandvideo"
      );
      const fetchYT = extractVideoYT(
        videoDetails.videoId,
        body.url,
        videoDetails,
        thumbnail_url,
        formats,
        videoFormats
      );
      return res.status(200).json({ data: fetchYT });
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
