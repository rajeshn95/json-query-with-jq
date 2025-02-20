// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const jq = require("jq-wasm");
// declare module "*.wasm" {
//   const src: string;
//   export default src;
// }

// import * as jq from "jq-wasm";
// import wasmModule from "../../jq.wasm?module"; // jq.wasm
declare module "../../jq.wasm" {
  const src: string;
  export default src;
}

type JqResult = object | object[] | null;

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  // console.log("wasmModule:::>", wasmModule);
  // const { exports } = (await WebAssembly.instantiate(wasmModule)) as any;

  // const wasmResponse = await fetch("/wasm/jq.wasm");
  // const wasmResponse = await fetch(
  //   new URL("http://localhost:3000/wasm/jq.wasm", import.meta.url)
  // );
  const wasmResponse = await fetch(`http://localhost:3000/wasm/jq.wasm`);
  console.log("Fetched wasm response:", wasmResponse);
  if (!wasmResponse.ok) {
    return new Response("Failed to fetch jq.wasm", { status: 500 });
  }
  console.log("Content-Type:", wasmResponse.headers.get("content-type"));

  // const wasmModule = await WebAssembly.instantiateStreaming(
  //   // await fetch("http://localhost:3000/wasm/jq.wasm")
  //   wasmResponse
  // );

  const wasmBuffer = await wasmResponse.arrayBuffer();
  console.log("wasmBuffer::>", wasmBuffer);
  const wasmModule = await WebAssembly.instantiate(wasmBuffer);
  const { instance } = await WebAssembly.instantiateStreaming(wasmResponse, {
    wasi_snapshot_preview1: {
      // Implement the required functions here
      // For example, if the module requires a `fd_write` function:
      fd_write: (fd, iovs, iovs_len, result) => {
        // Implement your logic here
      },
      // Add other required functions as needed
    },
  });
  // Get jq exports
  const { exports } = wasmModule.instance;

  const body = await req.json();
  console.log("EDGE-RUNTIME Request--->", body, body.data);
  console.log("EDGE-RUNTIME Data--->", typeof body.data, body.data);

  const result: JqResult = await exports.run(JSON.parse(body.data), body.query);
  console.log("EDGE-RUNTIME Result--->", result); // Output: ["bar"]

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
