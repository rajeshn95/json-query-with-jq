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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/jq-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: jqQuery, data: jsonData }), // Send JSON data as payload
    });
    const result = await response.json();
    console.log(result); // Handle the response as needed
    setOutputData(JSON.stringify(result, null, 2));
  };
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Welcome to the JSON Query Tester</h1>
        <p className="text-lg">
          This application allows you to test jq JSON queries against sample
          data.
        </p>
        <h2 className="text-xl font-semibold">How to Use:</h2>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Enter your JSON data in the input field.</li>
          <li>Write your jq query in the provided query box.</li>
          <li>Click &quot;Run Query&quot; to see the results.</li>
        </ol>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="w-full flex flex-row gap-4">
            <textarea
              className="border p-2 w-full text-black"
              rows={5}
              placeholder="Enter your JSON data here..."
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)} // Update state on change
            />
            <div className="border p-2 w-full h-40 overflow-auto">
              <h3 className="font-semibold">Output:</h3>
              <pre className="text-sm whitespace-pre-wrap">
                {outputData}
              </pre>{" "}
              {/* Display output data */}
            </div>
          </div>
          <textarea
            className="border p-2 w-full text-black"
            rows={3}
            placeholder="Enter your jq query here..."
            value={jqQuery}
            onChange={(e) => setJqQuery(e.target.value)} // Update state on change
          />
          <button
            type="submit"
            className="bg-blue-500 w-24 text-white p-2 rounded"
          >
            Run Query
          </button>
        </form>
      </main>
    </div>
  );
}
