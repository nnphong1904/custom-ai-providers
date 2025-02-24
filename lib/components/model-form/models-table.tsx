import { Input } from "@/components/form/input";
import { ModelCapabilitiesDialog } from "@/components/model-capabilities-dialog";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ModelFormData } from "@/schemas/model-form";
import { Model } from "@/types";

interface ModelsTableProps {
  models: Model[];
  filteredModels: Model[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ModelsTable({
  models,
  filteredModels,
  searchTerm,
  onSearchChange,
}: ModelsTableProps) {
  const form = useFormContext<ModelFormData>();

  const {
    fields: modelFields,
    append: appendModel,
    remove: removeModel,
  } = useFieldArray({
    control: form.control,
    name: "models",
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search models..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#ECECEC]/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Models Table */}
      <div className="rounded-lg border border-gray-300 dark:border-gray-500 overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
              <tr className="border-b border-gray-300 dark:border-gray-500">
                <th className="w-8 p-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      if (isChecked) {
                        modelFields.forEach((_, index) => {
                          removeModel(index);
                        });
                        filteredModels.forEach((model) => {
                          appendModel({
                            ...model,
                            supportedParams:
                              model.supportedParams?.map((param) => ({
                                key: param,
                                enabled: true,
                              })) || [],
                          });
                        });
                      } else {
                        form.setValue("models", []);
                      }
                    }}
                  />
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                  Name
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                  Context Length
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                  Price
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                  Capabilities
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {(filteredModels.length > 0 ? filteredModels : models).map((model) => (
                <tr key={model.id} className="border-b border-gray-300 dark:border-gray-500">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      checked={form.watch("models").some((m) => m.id === model.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          appendModel({
                            ...model,
                            supportedParams:
                              model.supportedParams?.map((param) => ({
                                key: param,
                                enabled: true,
                              })) || [],
                          });
                        } else {
                          const index = modelFields.findIndex((m) => m.modelId === model.modelId);
                          if (index !== -1) {
                            removeModel(index);
                          }
                        }
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                        {model.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-[#ECECEC]/70">
                        {model.id}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-900 dark:text-[#ECECEC]">
                    {model.contextLength.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm text-gray-900 dark:text-[#ECECEC]">
                    {model.pricePerMillionTokens &&
                    (model.pricePerMillionTokens.completion ||
                      model.pricePerMillionTokens.prompt) ? (
                      <div>
                        ${model.pricePerMillionTokens.prompt}/1M input tokens
                        <br />${model.pricePerMillionTokens.completion}/1M output tokens
                      </div>
                    ) : (
                      "Free"
                    )}
                  </td>
                  <td className="p-3">
                    {form.watch("models").some((m) => m.id === model.id) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#ECECEC]/70">
                        <p className="dark:text-[#ECECEC]">Auto detected</p>
                        <ModelCapabilitiesDialog modelId={model.modelId} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No Results Message */}
          {filteredModels.length === 0 && searchTerm && (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500 dark:text-[#ECECEC]/70">
                No models found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
