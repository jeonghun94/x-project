import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../lib/server/withHandler";
import { withApiSession } from "../../lib/server/withSession";
import client from "../../lib/server/db";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const users = await client.user.findMany({});

  res.json({
    ok: true,
    users,
  });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: false })
);
