import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import Head from "next/head";

// Import your tailwind styles (if needed, e.g., from _app.tsx)

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
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Example JSON data & query
  const sampleJson = `{
  "name": "Alice",
  "age": 25,
  "languages": ["English", "Spanish"],
  "address": {
    "city": "Wonderland",
    "zip": 12345
  }
}`;

  const sampleQuery = `.name`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Clear previous error
    setError("");

    // Validate JSON
    try {
      JSON.parse(jsonData);
    } catch (err) {
      setError("Invalid JSON. Please check your input.");
      return;
    }

    try {
      const response = await fetch("/api/jq-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: jqQuery, data: jsonData }),
      });

      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const result = await response.json();
      setOutputData(JSON.stringify(result, null, 2));
    } catch (err) {
      setError("Something went wrong while fetching the data.");
    }
  };

  const handleLoadSample = () => {
    setJsonData(sampleJson);
    setJqQuery(sampleQuery);
    setOutputData("");
    setError("");
  };

  const handleCopyOutput = () => {
    if (!outputData) return;
    navigator.clipboard.writeText(outputData);
    alert("Output copied to clipboard!");
  };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen transition-colors duration-300`}
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <Head>
        <title>JSON Query Tester</title>
        <meta
          name="description"
          content="Test jq queries quickly and easily with JSON data."
        />
      </Head>

      {/* Header */}
      <header
        className={`${
          darkMode
            ? "bg-gray-800"
            : "bg-gradient-to-r from-blue-500 to-blue-600"
        } py-6 px-4 shadow-md text-white`}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">JSON Query Tester</h1>
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full border-2 border-white p-1"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div
          className={`${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          } rounded-xl shadow-md p-8 transition-colors duration-300`}
        >
          <h2 className="text-3xl font-bold mb-4 text-center">
            Welcome to the JSON Query Tester
          </h2>
          <p className="text-lg mb-8 text-center">
            Test{" "}
            <code
              className={`${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } p-1 rounded text-sm`}
            >
              jq
            </code>{" "}
            JSON queries quickly and easily.
          </p>

          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={handleLoadSample}
              className={`${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } font-semibold py-2 px-6 rounded-md transition-colors`}
            >
              Load Sample
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Input and Output Container */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* JSON Input */}
              <div className="flex-1 flex flex-col">
                <label className="font-semibold mb-2" htmlFor="jsonInput">
                  JSON Input
                </label>
                <textarea
                  id="jsonInput"
                  className={`border ${
                    darkMode
                      ? "border-gray-700 bg-gray-900 text-gray-100"
                      : "border-gray-300 bg-white text-gray-800"
                  } rounded-md p-2 w-full h-48 focus:outline-blue-500`}
                  placeholder="Enter your JSON data here..."
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                />
              </div>

              {/* Output */}
              <div className="flex-1 flex flex-col">
                <label className="font-semibold mb-2" htmlFor="outputData">
                  Output
                </label>
                <div
                  id="outputData"
                  className={`border ${
                    darkMode
                      ? "border-gray-700 bg-gray-900 text-gray-100"
                      : "border-gray-300 bg-gray-50 text-gray-800"
                  } rounded-md p-2 w-full h-48 overflow-auto text-sm`}
                >
                  <pre className="whitespace-pre-wrap break-words">
                    {outputData}
                  </pre>
                </div>
                <button
                  type="button"
                  onClick={handleCopyOutput}
                  className={`mt-2 w-fit ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  } font-semibold py-1 px-3 rounded-md transition-colors`}
                >
                  Copy Output
                </button>
              </div>
            </div>

            {/* jq Query */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2" htmlFor="jqQuery">
                jq Query
              </label>
              <textarea
                id="jqQuery"
                className={`border ${
                  darkMode
                    ? "border-gray-700 bg-gray-900 text-gray-100"
                    : "border-gray-300 bg-white text-gray-800"
                } rounded-md p-2 w-full h-24 focus:outline-blue-500`}
                placeholder="Enter your jq query here..."
                value={jqQuery}
                onChange={(e) => setJqQuery(e.target.value)}
              />
            </div>

            {/* Run Query Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className={`${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white font-semibold py-2 px-6 rounded-md transition-colors`}
              >
                Run Query
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4">
        <p
          className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}
        >
          &copy; {new Date().getFullYear()} JSON Query Tester
        </p>
      </footer>
    </div>
  );
}
