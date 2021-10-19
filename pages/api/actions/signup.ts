import bcrypt from "bcryptjs";
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "../../../utils/cookies";
import { client } from "../../../utils/client";
import { generateJWT } from "../../../utils/auth/jwt";

const handler = nc<NextApiRequest, NextApiResponse>();

const checkMessage = (message: any) => (arr: any[]) => {
  let status;
  if (arr.length) {
    arr.map((error: any) => {
      if (error.message.includes(message)) {
        status = true;
      }
    });
  }
  return status;
};

const notUnique = checkMessage("Uniqueness violation");

handler.post<NextApiRequest, NextApiResponse>(async (req, res) => {
  try {
    console.log("Signup called with body:", req.body);
    const { email, password, name } = req.body.input.params;
    const data = await client.mutation({
      insert_user_one: [
        {
          object: {
            name,
            email,
            password: await bcrypt.hash(password, 10),
          },
        },
        {
          id: true,
          name: true,
          email: true,
        },
      ],
    });
    const user = data.insert_user_one;
    if (!user) return res.status(400).json({ message: "Something went wrong" });

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
    console.log(e);
    if (notUnique(e.response.errors)) {
      return res.status(400).json({ message: "Not Permitted" });
    } else {
      console.log("Got error at /api/actions/signup", e);
      return res.status(400).json({ code: e.name, message: e.message });
    }
  }
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default handler;
