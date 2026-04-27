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

function stripLeadingZeros(raw: string, decimal: boolean) {
  if (!raw) return "";

  if (!decimal) {
    return raw.replace(/^0+(\d)/, "$1") || "0";
  }

  const [whole = "", fraction] = raw.split(",");
  const normalizedWhole = whole.replace(/^0+(\d)/, "$1") || (fraction !== undefined ? "0" : whole);

  return fraction !== undefined ? `${normalizedWhole},${fraction}` : normalizedWhole;
}

function normalizeValue(raw: string, decimal: boolean) {
  if (!decimal) return stripLeadingZeros(raw.replace(/\D+/g, ""), false);

  const cleaned = raw.replace(/[^\d.,]/g, "").replace(/\./g, ",");
  const [whole = "", ...fractionParts] = cleaned.split(",");
  const normalizedWhole = stripLeadingZeros(whole, true);

  return fractionParts.length > 0 ? `${normalizedWhole},${fractionParts.join("")}` : normalizedWhole;
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