import { Button } from "@/components/form/button";
import { Provider } from "@/types";
import { providers as aiProviders } from "@/ai-providers";

const providers: Provider[] = Object.values(aiProviders).map((provider) => ({
  id: provider.information.id,
  name: provider.information.name,
  icon: provider.information.icon,
}));

interface AiProvidersListProps {
  onSelect: (provider: Provider) => void;
}

export function AiProvidersList({ onSelect }: AiProvidersListProps) {
  return (
    <div className="w-full space-y-2">
      <h1 className="text-2xl dark:text-white font-semibold mb-6">Select AI Provider</h1>
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant="secondary"
          className="w-full justify-start text-blue-500 dark:bg-blue-50 bg-blue-50 hover:bg-blue-100 dark:hover:bg-blue-100 dark:text-blue-500"
          onClick={() => onSelect(provider)}
        >
          <img src={provider.icon} alt={`${provider.name} icon`} className="mr-2 h-5 w-5" />
          {provider.name}
        </Button>
      ))}
    </div>
  );
}
