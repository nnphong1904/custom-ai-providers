import { cn } from "@/utils";
import * as React from "react";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Label } from "@/components/form/label";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-[#3F3F46]",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));

interface ToggleProps {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
}: ToggleProps) {
  const id = React.useId();
  return (
    <div className="flex items-start space-x-4">
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-[#ECECEC]"
        >
          {label}
        </Label>
        {description && (
          <Label htmlFor={id} className="text-[12px] text-gray-500 dark:text-[#ECECEC]/70">
            {description}
          </Label>
        )}
      </div>
    </div>
  );
}
