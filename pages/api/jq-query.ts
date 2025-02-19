// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// const jq = require("jq-wasm");
import jq from "jq-wasm";

type JqResult = object | object[] | null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Request--->", req.body, req.body.data);
  console.log("Data--->", typeof req.body.data, req.body.data);

  // Using jq.raw for raw text output
  //   const rawResult = await jq.raw(req.body.data, ".foo", ["-c"]);
  //   console.log(rawResult); // Output: "1\n2\n3"

  if (!jq) {
    console.error("jq is not initialized");
    res.status(500).json({ error: "jq is not initialized" });
    return;
  }

  // Using jq.json for parsed JSON output
  const result: JqResult = await jq.json(
    JSON.parse(req.body.data),
    req.body.query
  );
  console.log("Result--->", result); // Output: ["bar"]

  res.status(200).json(result);
}
