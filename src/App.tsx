import { AIProviders, JsonBuilderOutput } from "custom-ai-providers";
import { useState } from "react";
import "custom-ai-providers/styles.css";

function App() {
  const [result, setResult] = useState<JsonBuilderOutput[] | null>(null);

  return (
    <div className="flex gap-4">
      <div className="w-[684px]">
        <AIProviders
          onSave={(result) => {
            setResult(result);
          }}
        />
      </div>
      <div className="w-[400px] p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Result</h2>
          <button
            className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
            onClick={() => {
              if (result) {
                navigator.clipboard.writeText(JSON.stringify(result, null, 2));
              }
            }}
          >
            Copy
          </button>
        </div>
        <pre className="whitespace-pre-wrap">
          {result ? JSON.stringify(result, null, 2) : "No result yet"}
        </pre>
      </div>
    </div>
  );
}

export default App;
