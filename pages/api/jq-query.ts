// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const jq = require("jq-wasm");

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("request", req.body, req.body.data);

  const input = { foo: "bar", list: [1, 2, 3] };
  console.log("input", typeof input, input, JSON.stringify(input));
  console.log("Result::>", typeof req.body.data, req.body.data);

  // Using jq.raw for raw text output
  //   const rawResult = await jq.raw(req.body.data, ".foo", ["-c"]);
  //   console.log(rawResult); // Output: "1\n2\n3"

  // Using jq.json for parsed JSON output
  const result = await jq.json(JSON.parse(req.body.data), req.body.query);
  console.log(result); // Output: ["bar"]

  res.status(200).json(result);
}
