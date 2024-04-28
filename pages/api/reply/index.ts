import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../lib/server/withHandler";
import { withApiSession } from "../../../lib/server/withSession";
import client from "../../../lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const tweetId = req.query.tweetId;

    const replies = await client.reply.findMany({
      where: {
        tweetId: Number(tweetId),
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      ok: true,
      replies,
    });
  } else {
    const { text, tweetId } = req.body;

    await client.reply.create({
      data: {
        text,
        userId: Number(req.session.user?.id),
        tweetId,
      },
    });

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
