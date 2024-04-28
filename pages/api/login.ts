import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/server/db";
import withHandler, { ResponseType } from "../../lib/server/withHandler";
import { withApiSession } from "../../lib/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email } = req.body;

  const existingUser = await client.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser)
    return res.send({
      ok: false,
      error: "죄송합니다. 해당 계정을 찾을 수 없습니다.",
    });

  req.session.user = {
    id: existingUser.id,
  };
  await req.session.save();
  res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
