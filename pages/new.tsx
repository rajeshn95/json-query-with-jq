import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
// import "@uiw/react-textarea-code-editor/dist.css";
// import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [jsonData, setJsonData] = useState("");
  const [jqQuery, setJqQuery] = useState("");
  const [outputData, setOutputData] = useState("");
  const [jsonError, setJsonError] = useState("");

  // Example data to quickly fill in for demonstration
  const sampleJson = `{
  "users": [
    { "name": "Alice", "age": 25 },
    { "name": "Bob", "age": 30 }
  ],
  "active": true
}`;
  const sampleQuery = `.users[] | select(.age > 25)`;

  // Validate JSON as user types
  const handleJsonChange = (value: string) => {
    setJsonData(value);
    try {
      JSON.parse(value);
      setJsonError("");
    } catch (err) {
      setJsonError("Invalid JSON format");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // If JSON is invalid, don't proceed
    if (jsonError) return;

    try {
      const response = await fetch("/api/jq-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: jqQuery, data: jsonData }),
      });
      const result = await response.json();
      setOutputData(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutputData(`Error: ${error}`);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputData);
    alert("Output copied to clipboard!");
  };

  const handleDownloadOutput = () => {
    const blob = new Blob([outputData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "output.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setJsonData(sampleJson);
    setJqQuery(sampleQuery);
    setJsonError("");
  };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen py-6 px-4 bg-gray-50`}
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <main className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to the JSON Query Tester
        </h1>
        <p className="text-lg text-gray-600 mb-4 text-center">
          Test <code className="bg-gray-100 px-1 py-0.5 rounded">jq</code>{" "}
          queries quickly and easily.
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={loadSample}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Load Sample
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* JSON Input and Output */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* JSON Input */}
            <div className="flex-1 flex flex-col">
              <label
                className="font-semibold mb-2 text-gray-800"
                htmlFor="jsonInput"
              >
                JSON Input
              </label>
              <CodeEditor
                id="jsonInput"
                value={jsonData}
                language="json"
                placeholder="Enter your JSON data here..."
                onChange={(e) => handleJsonChange(e.target.value)}
                padding={10}
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 14,
                  backgroundColor: "#f8f8f8",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  minHeight: "200px",
                }}
              />
              {jsonError && (
                <p className="text-red-600 text-sm mt-1">{jsonError}</p>
              )}
            </div>

            {/* Output */}
            <div className="flex-1 flex flex-col">
              <label
                className="font-semibold mb-2 text-gray-800"
                htmlFor="outputData"
              >
                Output
              </label>
              <div className="relative">
                <CodeEditor
                  id="outputData"
                  value={outputData}
                  language="json"
                  readOnly
                  placeholder="Result will appear here..."
                  padding={10}
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 14,
                    backgroundColor: "#f8f8f8",
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    minHeight: "200px",
                  }}
                />
                {outputData && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopyOutput}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadOutput}
                      className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 text-sm"
                    >
                      Download
                    </button>
                  </div>
                )}
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
            <CodeEditor
              id="jqQuery"
              value={jqQuery}
              language="bash"
              placeholder="Enter your jq query here..."
              onChange={(e) => setJqQuery(e.target.value)}
              padding={10}
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 14,
                backgroundColor: "#f8f8f8",
                border: "1px solid #ccc",
                borderRadius: 6,
                minHeight: "80px",
              }}
            />
          </div>

          {/* Run Query Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={Boolean(jsonError)}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Run Query
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// import { Geist, Geist_Mono } from "next/font/google";
// import { useState } from "react";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function Home() {
//   const [jsonData, setJsonData] = useState(""); // Add state for JSON data
//   const [jqQuery, setJqQuery] = useState(""); // State for jq query
//   const [outputData, setOutputData] = useState(""); // State for output data

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const response = await fetch("/api/jq-query", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query: jqQuery, data: jsonData }), // Send JSON data as payload
//     });
//     const result = await response.json();
//     console.log(result); // Handle the response as needed
//     setOutputData(JSON.stringify(result, null, 2));
//   };
//   return (
//     <div
//       className={`${geistSans.variable} ${geistMono.variable} min-h-screen py-6 px-4`}
//       style={{ fontFamily: "var(--font-geist-sans)" }}
//     >
//       <main className="max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-md p-8">
//         <h1 className="text-3xl text-black font-bold mb-4 text-center">
//           Welcome to the JSON Query Tester
//         </h1>
//         <p className="text-lg text-gray-700 mb-8 text-center">
//           Test <code className="bg-gray-200 p-1 rounded text-sm">jq</code> JSON
//           queries quickly and easily.
//         </p>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//           {/* Input and Output Container */}
//           <div className="flex flex-col md:flex-row gap-6">
//             {/* JSON Input */}
//             <div className="flex-1 flex flex-col">
//               <label
//                 className="font-semibold mb-2 text-gray-800"
//                 htmlFor="jsonInput"
//               >
//                 JSON Input
//               </label>
//               <textarea
//                 id="jsonInput"
//                 className="border border-gray-300 rounded-md p-2 w-full text-black h-48 focus:outline-blue-500"
//                 placeholder="Enter your JSON data here..."
//                 value={jsonData}
//                 onChange={(e) => setJsonData(e.target.value)}
//               />
//             </div>

//             {/* Output */}
//             <div className="flex-1 flex flex-col">
//               <label
//                 className="font-semibold mb-2 text-gray-800"
//                 htmlFor="outputData"
//               >
//                 Output
//               </label>
//               <div
//                 id="outputData"
//                 className="border border-gray-300 rounded-md p-2 w-full h-48 bg-gray-100 overflow-auto text-sm"
//               >
//                 <pre className="whitespace-pre-wrap break-words text-gray-800">
//                   {outputData}
//                 </pre>
//               </div>
//             </div>
//           </div>

//           {/* jq Query */}
//           <div className="flex flex-col">
//             <label
//               className="font-semibold mb-2 text-gray-800"
//               htmlFor="jqQuery"
//             >
//               jq Query
//             </label>
//             <textarea
//               id="jqQuery"
//               className="border border-gray-300 rounded-md p-2 w-full text-black h-24 focus:outline-blue-500"
//               placeholder="Enter your jq query here..."
//               value={jqQuery}
//               onChange={(e) => setJqQuery(e.target.value)}
//             />
//           </div>

//           {/* Checkbox for Edge runtime */}
//           {/* <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               id="edgeRuntime"
//               className="w-4 h-4"
//               checked={useEdgeRuntime}
//               onChange={(e) => setUseEdgeRuntime(e.target.checked)}
//             />
//             <label htmlFor="edgeRuntime" className="text-gray-800">
//               Run with Edge runtime
//             </label>
//           </div> */}

//           {/* Run Query Button */}
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Run Query
//             </button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// }

// [
//   {
//     uuid: "431d5192-5ae9-4b82-a598-a05a943ccfe6",
//     password: "$2b$05$tfQqIgmOvOnHeSlq5jS9qOEU7CSFkFpM22fUqhwjXbhBfcims8txm",
//     profile: {
//       bio: {
//         full_name: "Rajesh",
//       },
//       meta: {
//         shortlisted_properties: ["ebf3cd29-cce6-4fd7-a794-3336bec6150b"],
//       },
//       name: "raj",
//     },
//     created_at: "2024-12-11 12:37:07.038+05:30",
//     updated_at: "2024-12-11 12:37:07.039+05:30",
//     deleted_at: null,
//   },
// ];
