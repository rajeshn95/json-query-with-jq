// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// // const jq = require("jq-wasm");
// import * as jq from "jq-wasm";

// type JqResult = object | object[] | null;

// export const config = {
//   runtime: "edge",
// };

// export default async function handler(req: Request) {
//   const body = await req.json();
//   console.log("EDGE-RUNTIME Request--->", body, body.data);
//   console.log("EDGE-RUNTIME Data--->", typeof body.data, body.data);

//   // Using jq.raw for raw text output
//   //   const rawResult = await jq.raw(req.body.data, ".foo", ["-c"]);
//   //   console.log(rawResult); // Output: "1\n2\n3"

//   if (!jq) {
//     console.error("EDGE-RUNTIME jq is not initialized");
//     return new Response(JSON.stringify({ error: "jq is not initialized" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   // Using jq.json for parsed JSON output
//   const result: JqResult = await jq.json(JSON.parse(body.data), body.query);
//   console.log("EDGE-RUNTIME Result--->", result); // Output: ["bar"]

//   return new Response(JSON.stringify(result), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }
