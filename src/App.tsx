import { AIProviders, JsonBuilderOutput } from "custom-ai-providers";
import { useState } from "react";
import "custom-ai-providers/styles.css";

function App() {
  const [result, setResult] = useState<JsonBuilderOutput | null>(null);

  return (
    <div className="flex gap-3 dark:bg-[#1F2937] p-8">
      <div className="flex-1">
        <AIProviders
          onSave={(result) => {
            setResult(result);
          }}
        />
      </div>
      <div className="w-[400px] p-6 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 h-fit sticky top-8 bg-">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#ECECEC]">Result</h2>
          <button
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-[#ECECEC] transition-colors"
            onClick={() => {
              if (result) {
                navigator.clipboard.writeText(JSON.stringify(result, null, 2));
              }
            }}
          >
            Copy
          </button>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-[#ECECEC]/90 bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-500">
          {result ? JSON.stringify(result, null, 2) : "No result yet"}
        </pre>
      </div>
    </div>
  );
}

export default App;
