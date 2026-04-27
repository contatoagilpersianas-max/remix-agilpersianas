import * as React from "react";

import { Input } from "@/components/ui/input";

type NumericInputProps = Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> & {
  value?: number | null;
  onValueChange: (value: number | null) => void;
  decimal?: boolean;
};

function formatValue(value: number | null | undefined, decimal: boolean) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return decimal ? String(value).replace(".", ",") : String(value);
}

function stripLeadingZeros(raw: string) {
  return raw.replace(/^0+(?=\d)/, "");
}

function normalizeValue(raw: string, decimal: boolean) {
  if (!decimal) return stripLeadingZeros(raw.replace(/\D+/g, ""));

  const cleaned = raw.replace(/[^\d.,]/g, "");
  if (!cleaned) return "";

  const separatorIndex = cleaned.search(/[.,]/);
  if (separatorIndex === -1) {
    return stripLeadingZeros(cleaned);
  }

  const separator = cleaned[separatorIndex];
  const wholeRaw = cleaned.slice(0, separatorIndex).replace(/[.,]/g, "");
  const fraction = cleaned.slice(separatorIndex + 1).replace(/[.,]/g, "");
  const whole = stripLeadingZeros(wholeRaw) || "0";

  return `${whole}${separator}${fraction}`;
}

function parseValue(raw: string, decimal: boolean) {
  if (!raw) return null;

  const parsed = decimal
    ? Number.parseFloat(raw.replace(",", ".").replace(/[^\d.]/g, ""))
    : Number.parseInt(raw, 10);

  return Number.isFinite(parsed) ? parsed : null;
}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ value, onValueChange, decimal = false, onBlur, onFocus, inputMode, ...props }, ref) => {
    const [text, setText] = React.useState(() => formatValue(value, decimal));
    const isFocusedRef = React.useRef(false);

    React.useEffect(() => {
      if (!isFocusedRef.current) {
        setText(formatValue(value, decimal));
      }
    }, [value, decimal]);

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
          setText(formatValue(value, decimal));
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