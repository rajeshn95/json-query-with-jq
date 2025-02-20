import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [jsonData, setJsonData] = useState(""); // Add state for JSON data
  const [jqQuery, setJqQuery] = useState(""); // State for jq query
  const [outputData, setOutputData] = useState(""); // State for output data
  // const [useEdgeRuntime, setUseEdgeRuntime] = useState(false); // NEW: State for the checkbox
  const [useEdgeRuntime] = useState(false); // NEW: State for the checkbox

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(
      useEdgeRuntime ? "/api/jq-query-edge" : "/api/jq-query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: jqQuery, data: jsonData }), // Send JSON data as payload
      }
    );
    const result = await response.json();
    console.log(result); // Handle the response as needed
    setOutputData(JSON.stringify(result, null, 2));
  };
  return (
    // <div
    //   className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]`}
    // >
    //   <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
    //     <h1 className="text-2xl font-bold">Welcome to the JSON Query Tester</h1>
    //     <p className="text-lg">
    //       This application allows you to test jq JSON queries against sample
    //       data.
    //     </p>
    //     <h2 className="text-xl font-semibold">How to Use:</h2>
    //     <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
    //       <li className="mb-2">Enter your JSON data in the input field.</li>
    //       <li>Write your jq query in the provided query box.</li>
    //       <li>Click &quot;Run Query&quot; to see the results.</li>
    //     </ol>
    //     <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
    //       <div className="w-full flex flex-row gap-4">
    //         <textarea
    //           className="border p-2 w-full text-black"
    //           rows={5}
    //           placeholder="Enter your JSON data here..."
    //           value={jsonData}
    //           onChange={(e) => setJsonData(e.target.value)} // Update state on change
    //         />
    //         <div className="border p-2 w-full h-40 overflow-auto">
    //           <h3 className="font-semibold">Output:</h3>
    //           <pre className="text-sm whitespace-pre-wrap">
    //             {outputData}
    //           </pre>{" "}
    //           {/* Display output data */}
    //         </div>
    //       </div>
    //       <textarea
    //         className="border p-2 w-full text-black"
    //         rows={3}
    //         placeholder="Enter your jq query here..."
    //         value={jqQuery}
    //         onChange={(e) => setJqQuery(e.target.value)} // Update state on change
    //       />
    //       <button
    //         type="submit"
    //         className="bg-blue-500 w-24 text-white p-2 rounded"
    //       >
    //         Run Query
    //       </button>
    //     </form>
    //   </main>
    // </div>
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen py-6 px-4`}
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <main className="max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-md p-8">
        <h1 className="text-3xl text-black font-bold mb-4 text-center">
          Welcome to the JSON Query Tester
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Test <code className="bg-gray-200 p-1 rounded text-sm">jq</code> JSON
          queries quickly and easily.
        </p>

        {/* <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How to Use:</h2>
          <ol className="list-inside list-decimal text-gray-600 font-[family-name:var(--font-geist-mono)] ml-4">
            <li className="mb-1">Enter your JSON data in the input field.</li>
            <li className="mb-1">
              Write your jq query in the provided query box.
            </li>
            <li className="mb-1">
              Click <strong>Run Query</strong> to see the results.
            </li>
          </ol>
        </div> */}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Input and Output Container */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* JSON Input */}
            <div className="flex-1 flex flex-col">
              <label
                className="font-semibold mb-2 text-gray-800"
                htmlFor="jsonInput"
              >
                JSON Input
              </label>
              <textarea
                id="jsonInput"
                className="border border-gray-300 rounded-md p-2 w-full text-black h-48 focus:outline-blue-500"
                placeholder="Enter your JSON data here..."
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
              />
            </div>

            {/* Output */}
            <div className="flex-1 flex flex-col">
              <label
                className="font-semibold mb-2 text-gray-800"
                htmlFor="outputData"
              >
                Output
              </label>
              <div
                id="outputData"
                className="border border-gray-300 rounded-md p-2 w-full h-48 bg-gray-100 overflow-auto text-sm"
              >
                <pre className="whitespace-pre-wrap break-words text-gray-800">
                  {outputData}
                </pre>
              </div>
            </div>
          </div>

          {/* jq Query */}
          <div className="flex flex-col">
            <label
              className="font-semibold mb-2 text-gray-800"
              htmlFor="jqQuery"
            >
              jq Query
            </label>
            <textarea
              id="jqQuery"
              className="border border-gray-300 rounded-md p-2 w-full text-black h-24 focus:outline-blue-500"
              placeholder="Enter your jq query here..."
              value={jqQuery}
              onChange={(e) => setJqQuery(e.target.value)}
            />
          </div>

          {/* Checkbox for Edge runtime */}
          {/* <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edgeRuntime"
              className="w-4 h-4"
              checked={useEdgeRuntime}
              onChange={(e) => setUseEdgeRuntime(e.target.checked)}
            />
            <label htmlFor="edgeRuntime" className="text-gray-800">
              Run with Edge runtime
            </label>
          </div> */}

          {/* Run Query Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              Run Query
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
