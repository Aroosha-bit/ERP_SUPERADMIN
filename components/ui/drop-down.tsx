"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";


function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface DropDownSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: string[];
  required?: boolean;
  className?: string;
  searchable?: boolean;
}

export function DropDownSelect({
  name,
  label,
  placeholder,
  options,
  required = true,
  className,
  searchable = true,
}: DropDownSelectProps) {
  const id = `field-${name}`;

  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = React.useState(false);

  const errorMsg = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-sm font-semibold text-[#51586a]"
      >
        {label}{" "}
        {required && (
          <span className="text-[#36a9e1]">*</span>
        )}
      </Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const fieldOptions =
            field.value && !options.includes(field.value)
              ? [field.value, ...options]
              : options;

          const selectedOption = fieldOptions.find((option) => option === field.value);

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <Button
                  id={id}
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-required={required}
                  aria-invalid={Boolean(errorMsg)}
                  aria-describedby={
                    errorMsg ? `${id}-error` : undefined
                  }
                  className={cn(
                    "h-10 w-full justify-between rounded-md border bg-white px-2.5 text-sm font-normal hover:bg-white",
                    errorMsg
                      ? "border-red-500"
                      : "border-[#d7e6ed]",
                    selectedOption
                      ? "text-[#4b5568]"
                      : "text-[#a9adb6]",
                    className
                  )}
                  >
                  <span className="truncate">
                    {selectedOption ||
                      placeholder ||
                      `Select ${label}`}
                  </span>

                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                }
              />

              <PopoverContent
                align="start"
                className="w-[var(--radix-popover-trigger-width)] p-0"
              >
                <Command>
                  {searchable && (
                    <CommandInput
                      placeholder={`Search ${label}...`}
                    />
                  )}

                  <CommandList>
                    <CommandEmpty>
                      No {label.toLowerCase()} found.
                    </CommandEmpty>

                    <CommandGroup>
                      {fieldOptions.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => {
                            field.onChange(option);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              field.value === option
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />

                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />

      {errorMsg && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-600"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}