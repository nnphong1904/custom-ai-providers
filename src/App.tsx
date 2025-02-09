import { AIProviders } from "custom-ai-providers";

function App() {
  return (
    <div className="w-[684px]">
      <AIProviders
        onSave={(result) => {
          console.log("🚀 ~ App ~ result:", result);
        }}
      />
    </div>
  );
}

export default App;
