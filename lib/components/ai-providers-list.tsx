import { Button } from "@/components/form/button";
import { Provider } from "@/types";
import { providers as aiProviders } from "@/ai-providers";

const providers: Provider[] = Object.values(aiProviders).map((provider) => ({
  id: provider.information.id,
  name: provider.information.name,
}));

interface AiProvidersListProps {
  onSelect: (provider: Provider) => void;
}

export function AiProvidersList({ onSelect }: AiProvidersListProps) {
  return (
    <div className="w-full space-y-2 p-4">
      <h1 className="text-2xl font-semibold mb-6">Select AI Provider</h1>
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant="secondary"
          className="w-full justify-start text-blue-500 bg-blue-50 hover:bg-blue-100"
          onClick={() => onSelect(provider)}
        >
          → {provider.name}
        </Button>
      ))}
    </div>
  );
}
