import { Button } from "@/components/form/button";
import { Input } from "@/components/form/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ModelFormData } from "@/schemas/model-form";

export function AdvancedSettings() {
  const form = useFormContext<ModelFormData>();
  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control: form.control,
    name: "headers",
  });

  const {
    fields: paramFields,
    append: appendParam,
    remove: removeParam,
  } = useFieldArray({
    control: form.control,
    name: "bodyParams",
  });

  return (
    <div className="space-y-4">
      <div>
        <button
          type="button"
          className="flex gap-4 items-center py-4 text-left cursor-pointer transition-colors duration-200 hover:[&>span]:text-blue-500 hover:[&>svg]:stroke-blue-500"
          onClick={() => {
            const el = document.getElementById("advanced-settings");
            if (el) {
              el.classList.toggle("max-h-0");
              el.classList.toggle("max-h-[2000px]");
              el.classList.toggle("opacity-0");
              el.classList.toggle("opacity-100");
              const arrow = el.previousElementSibling?.querySelector("svg");
              if (arrow) {
                arrow.classList.toggle("rotate-180");
              }
            }
          }}
        >
          <span className="text-lg font-semibold dark:text-[#ECECEC]">Advanced Settings</span>
          <svg
            className="w-5 h-5 transition-transform duration-300 transform dark:stroke-[#ECECEC]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          id="advanced-settings"
          className="max-h-0 opacity-0 overflow-hidden transition-all duration-700 ease-in-out"
        >
          {/* Custom Headers */}
          <div className="space-y-2 mb-6">
            <h3 className="text-lg font-semibold dark:text-[#ECECEC]">Custom Headers</h3>
            {headerFields.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="x-header-key"
                  className="flex-1"
                  {...form.register(`headers.${index}.key`)}
                  error={form.formState.errors.headers?.[index]?.key?.message}
                />
                <Input
                  placeholder="Header Value"
                  className="flex-1"
                  {...form.register(`headers.${index}.value`)}
                  error={form.formState.errors.headers?.[index]?.value?.message}
                />
                <Button
                  type="button"
                  variant="danger"
                  className="w-full sm:w-auto"
                  onClick={() => removeHeader(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              className="p-0 h-auto text-blue-500 dark:text-blue-400"
              onClick={() => appendHeader({ key: "", value: "" })}
            >
              + Add Custom Headers
            </Button>
          </div>

          {/* Custom Body Params */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold dark:text-[#ECECEC]">Custom Body Params</h3>
            {paramFields.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3">
                <select
                  className="rounded border p-2 w-full sm:w-auto dark:bg-gray-800 dark:border-gray-600 dark:text-[#ECECEC]"
                  {...form.register(`bodyParams.${index}.type`)}
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                  <option value="object">object</option>
                </select>
                <Input
                  placeholder="Key"
                  className="flex-1"
                  {...form.register(`bodyParams.${index}.key`)}
                  error={form.formState.errors.bodyParams?.[index]?.key?.message}
                />
                <Input
                  placeholder="Value"
                  className="flex-1"
                  {...form.register(`bodyParams.${index}.value`)}
                  error={form.formState.errors.bodyParams?.[index]?.value?.message}
                />
                <Button
                  type="button"
                  variant="danger"
                  className="w-full sm:w-auto"
                  onClick={() => removeParam(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              className="p-0 h-auto text-blue-500 dark:text-blue-400"
              onClick={() => appendParam({ type: "string", key: "", value: "" })}
            >
              + Add Custom Body Params
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
