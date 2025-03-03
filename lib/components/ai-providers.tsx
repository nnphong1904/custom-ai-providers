import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider } from "@/types";
import { AiProvidersList } from "@/components/ai-providers-list";
import { Button } from "@/components/form/button";
import { ModelForm } from "@/components/model-form";
import { JsonBuilderOutput } from "@/utils/json-builder";
const queryClient = new QueryClient();

export function AIProviders({ onSave }: { onSave: (result: JsonBuilderOutput) => void }) {
  const [provider, setProvider] = useState<Provider | null>(null);

  const handleProviderSelect = (selectedProvider: Provider) => {
    setProvider(selectedProvider);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center w-full dark:bg-[#1F2937]">
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
