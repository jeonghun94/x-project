import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../lib/server/withHandler";
import { withApiSession } from "../../../lib/server/withSession";
import client from "../../../lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const tweets = await client.tweet.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      ok: true,
      tweets,
    });
  } else {
    const { text, photoId } = req.body;
    console.log(photoId, "photoId");
    await client.tweet.create({
      data: {
        text,
        userId: Number(req.session.user?.id),
        createdById: Number(req.session.user?.id),
        imageUrl: photoId,
      },
    });

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
