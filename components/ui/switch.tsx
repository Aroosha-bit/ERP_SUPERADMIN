"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "cn"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn("group relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[size=default]:h-[22px] data-[size=default]:w-[40px] data-[size=sm]:h-[18px] data-[size=sm]:w-[32px] data-[checked]:bg-[#2563EB] data-[unchecked]:bg-[#DDE5F0]", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-white shadow-sm transition-transform group-data-[size=default]:size-[18px] group-data-[size=sm]:size-[14px] group-data-[checked]:translate-x-[20px] group-data-[unchecked]:translate-x-[2px] group-data-[size=sm]:group-data-[checked]:translate-x-[16px]"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };