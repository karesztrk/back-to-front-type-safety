// @ts-nocheck
import { Chain } from "./generated/zeus";

export const client = Chain(process.env.HASURA_ENDPOINT, {
  credentials: "include",
  mode: "cors",
  headers: (() =>
    typeof window === "undefined"
      ? { "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET }
      : {})(),
});

export const openclient = Chain(process.env.HASURA_ENDPOINT, {
  credentials: "include",
});