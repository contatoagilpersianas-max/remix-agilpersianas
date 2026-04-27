import * as React from "react";

import { Input } from "@/components/ui/input";

type NumericInputProps = Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> & {
  value?: number | null;
  onValueChange: (value: number | null) => void;
  decimal?: boolean;
};

function formatValue(value: number | null | undefined) {
  return value === null || value === undefined || Number.isNaN(value) ? "" : String(value);
}

function normalizeValue(raw: string, decimal: boolean) {
  if (!decimal) return raw.replace(/\D+/g, "");

  const cleaned = raw.replace(/[^\d.,]/g, "").replace(/\./g, ",");
  const [whole = "", ...fractionParts] = cleaned.split(",");

  return fractionParts.length > 0 ? `${whole},${fractionParts.join("")}` : whole;
}

function parseValue(raw: string, decimal: boolean) {
  if (!raw) return null;

  const parsed = decimal
    ? Number.parseFloat(raw.replace(",", "."))
    : Number.parseInt(raw, 10);

  return Number.isFinite(parsed) ? parsed : null;
}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ value, onValueChange, decimal = false, onBlur, onFocus, inputMode, ...props }, ref) => {
    const [text, setText] = React.useState(() => formatValue(value));
    const isFocusedRef = React.useRef(false);

    React.useEffect(() => {
      if (!isFocusedRef.current) {
        setText(formatValue(value));
      }
    }, [value]);

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode={inputMode ?? (decimal ? "decimal" : "numeric")}
        value={text}
        onFocus={(event) => {
          isFocusedRef.current = true;
          onFocus?.(event);
        }}
        onBlur={(event) => {
          isFocusedRef.current = false;
          setText(formatValue(value));
          onBlur?.(event);
        }}
        onChange={(event) => {
          const normalized = normalizeValue(event.target.value, decimal);
          setText(normalized);
          onValueChange(parseValue(normalized, decimal));
        }}
      />
    );
  },
);

NumericInput.displayName = "NumericInput";

export { NumericInput };