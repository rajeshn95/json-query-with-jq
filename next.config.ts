import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // webpack: (config) => {
  //   config.experiments = {
  //     asyncWebAssembly: true,
  //     layers: true,
  //   };
  //   config.module.rules.push({
  //     test: /\.wasm$/,
  //     type: "webassembly/async",
  //   });
  //   return config;
  // },
  webpack(config, { isServer, dev }) {
    // Use the client static directory in the server bundle and prod mode
    // Fixes `Error occurred prerendering page "/"`
    config.output.webassemblyModuleFilename =
      isServer && !dev
        ? "../static/wasm/[modulehash].wasm"
        : "static/wasm/[modulehash].wasm";

    // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    return config;
  },
};

export default nextConfig;
