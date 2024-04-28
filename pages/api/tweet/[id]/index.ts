import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../lib/server/withHandler";
import { withApiSession } from "../../../../lib/server/withSession";
import client from "../../../../lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;

  if (id) {
    const tweet = await client.tweet.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
      },
    });

    res.json({
      ok: true,
      tweet,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
