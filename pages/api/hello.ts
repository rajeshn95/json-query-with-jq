// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export const config = {
  runtime: "edge",
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = new Response(JSON.stringify({ name: "John Doe" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  return response;
}
