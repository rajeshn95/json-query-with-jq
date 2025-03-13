import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

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
  const [darkMode, setDarkMode] = useState(false);
  const [jsonError, setJsonError] = useState("");

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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

  return (
    <div
      className={`${geistSans.variable} ${
        geistMono.variable
      } min-h-screen py-6 px-4 ${darkMode ? "dark" : ""}`}
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <main className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            JSON Query Tester
          </h1>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 text-center">
          Test{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
            jq
          </code>{" "}
          queries quickly and easily.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* JSON Input and Output */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* JSON Input */}
            <div className="flex-1 flex flex-col">
              <label
                className="font-semibold mb-2 text-gray-800 dark:text-gray-200"
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
                  backgroundColor: darkMode ? "#1f2937" : "#f8f8f8",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  minHeight: "200px",
                  color: darkMode ? "#f3f4f6" : "#111827",
                }}
              />
              {jsonError && (
                <p className="text-red-600 text-sm mt-1">{jsonError}</p>
              )}
            </div>

            {/* Output */}
            <div className="flex-1 flex flex-col">
              <label
                className="font-semibold mb-2 text-gray-800 dark:text-gray-200"
                htmlFor="outputData"
              >
                Output
              </label>
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
                  backgroundColor: darkMode ? "#1f2937" : "#f8f8f8",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  minHeight: "200px",
                  color: darkMode ? "#f3f4f6" : "#111827",
                }}
              />
            </div>
          </div>

          {/* jq Query */}
          <div className="flex flex-col">
            <label
              className="font-semibold mb-2 text-gray-800 dark:text-gray-200"
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
                backgroundColor: darkMode ? "#1f2937" : "#f8f8f8",
                border: "1px solid #ccc",
                borderRadius: 6,
                minHeight: "80px",
                color: darkMode ? "#f3f4f6" : "#111827",
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
