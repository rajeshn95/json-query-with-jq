// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// export const config = {
//   runtime: "edge",
// };

// export default function handler() {
//   const response = new Response(JSON.stringify({ name: "John Doe" }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
//   return response;
// }

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}
