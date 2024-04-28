import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../lib/server/withHandler";
import { withApiSession } from "../../lib/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  req.session.destroy();
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: false })
);
