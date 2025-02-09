import { useState } from "react";
import { AiProvidersList } from "@/components/ai-providers-list";
import { ModelForm } from "@/components/model-form";
import { Button } from "@/components/form/button";
import { Provider } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModelConfig } from "@/utils/json-builder";

const queryClient = new QueryClient();

function AIProviders({ onSave }: { onSave: (result: ModelConfig[]) => void }) {
  const [provider, setProvider] = useState<Provider | null>(null);

  const handleProviderSelect = (selectedProvider: Provider) => {
    setProvider(selectedProvider);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center w-full">
        {!provider ? (
          // Show providers list when no provider is selected
          <AiProvidersList onSelect={handleProviderSelect} />
        ) : (
          // Show model form when a provider is selected
          <div className="w-full pt-2">
            <div className="flex items-center mb-2 px-4">
              <Button variant="ghost" className="mr-4 px-0" onClick={() => setProvider(null)}>
                ← Back
              </Button>
            </div>
            <ModelForm provider={provider} onSave={onSave} />
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export type { ModelConfig };
export { AIProviders };
