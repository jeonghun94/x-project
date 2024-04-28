import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/server/db";
import { randomColor } from "../../lib/client/utils";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, name } = req.body;

  const isExisted = await client.user.findUnique({
    where: {
      email,
    },
  });

  if (isExisted) {
    res.send({
      ok: false,
      error: "해당 계정이 존재 합니다. 다른 이메일을 사용해주세요.",
    });
    return;
  }

  await client.user.create({
    data: {
      name,
      email,
      color: randomColor().toUpperCase(),
    },
  });

  res.send({
    ok: true,
  });
}
