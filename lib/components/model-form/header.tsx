import { Provider } from "@/types";

interface ModelFormHeaderProps {
  provider: Provider;
}

export function ModelFormHeader({ provider }: ModelFormHeaderProps) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-300 dark:border-gray-500">
      <img
        src={provider.icon}
        alt={`${provider.name} icon`}
        className="h-12 w-12 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-900"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#ECECEC]">
          Add {provider.name} Model
        </h1>
        <p className="text-sm text-gray-500 dark:text-[#ECECEC]/70">
          Configure your model settings and API credentials
        </p>
      </div>
    </div>
  );
}
