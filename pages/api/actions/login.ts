import bcrypt from "bcryptjs";
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "../../../utils/cookies";
import { client } from "../../../utils/client";
import { generateJWT } from "../../../utils/auth/jwt";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  try {
    console.log("Login called with body:", req.body);
    // Get input from Hasura Action query variables payload
    const { email, password } = req.body.input.params;
    const data = await client.query({
      user: [
        {
          where: { email: { _eq: email } },
        },
        {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      ],
    });

    const user = data.user[0];
    if (!user) return res.status(401).json({ message: "Invalid" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send({ message: "Invalid" });

    const token = generateJWT({
      defaultRole: "user",
      allowedRoles: ["user"],
      otherClaims: {
        "X-Hasura-User-Id": user.id.toString(),
      },
    });

    setCookie(res, "hasura-user-token", token, {
      httpOnly: true,
      secure: true || process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 60 * 60,
      sameSite: "none",
      path: "/",
    });

    return res.json({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (e: any) {
    console.log("Got error at /api/actions/login", e);
    return res.status(400).json({ code: e.name, message: e.message });
  }
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default handler;
