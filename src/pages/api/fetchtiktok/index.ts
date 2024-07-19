import { getInfoTiktok, getInfoTiktokV2 } from "@/lib/tiktokScraper";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body == "string") {
        body = JSON.parse(body);
      }
      const tiktokV1: any = await getInfoTiktok(body.url);
      if (tiktokV1?.success) {
        return res.status(200).json({ data: tiktokV1 });
      } else {
        let tiktokV2 = await getInfoTiktokV2(body.url);
        return res.status(200).json({ data: tiktokV2 });
      }
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
