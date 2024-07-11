// import { encryptBackEnd } from "@/contants/common";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
// TobyG74
const Tiktok = require("@tobyg74/tiktok-api-dl");
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
      if (!body.url) {
        return NextResponse.json({ error: "Please provide an invalid link" });
      }
      let video;
      if (body.url.includes("photo")) {
        video = await Tiktok.Downloader(body.url.replace("photo", "video"));
      } else {
        video = await Tiktok.Downloader(body.url, { version: "v1" });
        if (video.status === "error") {
          video = await Tiktok.Downloader(body.url, { version: "v3" });
        }
      }

      if (!video) {
        return res.status(400).json({ error: "Video does not exist" });
      }
      return res.status(200).json({ data: video });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
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
