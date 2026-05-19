import { useState, useRef, useEffect } from "react";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const AnimatedInput = ({ placeholder, value, onChange, type, style, ...props }: AnimatedInputProps) => {
  const [focused, setFocused] = useState(false);
  const [chars, setChars] = useState<{ char: string; id: number; fresh: boolean }[]>([]);
  const prevValue = useRef("");
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPassword = type === "password";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    const oldVal = prevValue.current;

    if (newVal.length > oldVal.length) {
      const added = newVal.slice(oldVal.length).split("").map((char) => ({
        char,
        id: idRef.current++,
        fresh: true,
      }));
      setChars((prev) => {
        const next = [...prev, ...added];
        added.forEach((c) => {
          setTimeout(() => {
            setChars((p) => p.map((x) => x.id === c.id ? { ...x, fresh: false } : x));
          }, 200);
        });
        return next;
      });
    } else {
      setChars((prev) => prev.slice(0, newVal.length));
    }

    prevValue.current = newVal;
    onChange?.(e);
  };

  useEffect(() => {
    if ((value as string)?.length === 0) {
      setChars([]);
      prevValue.current = "";
    }
  }, [value]);

  return (
    <div style={{ position: "relative" }}>
      <style>{`
        @keyframes smoothIn {
          from { opacity: 0; transform: translateY(4px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Glow ring on focus */}
      <div style={{
        position: "absolute", inset: -2, borderRadius: 10, zIndex: 0, pointerEvents: "none",
        background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
        opacity: focused ? 0.3 : 0,
        transition: "opacity 0.25s ease",
      }} />

      {/* Character overlay — only for non-password */}
      {!isPassword && (
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            display: "flex", alignItems: "center",
            paddingLeft: 12, paddingRight: 12,
            fontSize: 14, fontFamily: "inherit",
            color: "hsl(var(--foreground))",
            overflow: "hidden",
          }}
        >
          {chars.length === 0 && (
            <span style={{ color: "hsl(var(--muted-foreground))" }}>{placeholder}</span>
          )}
          {chars.map((c) => (
            <span
              key={c.id}
              style={{
                display: "inline-block",
                animation: c.fresh ? "smoothIn 0.2s ease forwards" : "none",
              }}
            >
              {c.char === " " ? "\u00A0" : c.char}
            </span>
          ))}
        </div>
      )}

      <input
        {...props}
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={isPassword ? placeholder : ""}
        style={{
          position: "relative", zIndex: 1,
          width: "100%", height: 40,
          paddingLeft: 12,
          paddingRight: type === "password" ? 40 : 12,
          borderRadius: 8,
          border: "1px solid hsl(var(--border))",
          background: "hsl(var(--background))",
          fontSize: 14, outline: "none",
          transition: "box-shadow 0.2s ease, transform 0.15s ease",
          transform: focused ? "scale(1.01)" : "scale(1)",
          boxShadow: focused ? "0 0 0 2px hsl(var(--primary) / 0.2)" : "none",
          color: isPassword ? "hsl(var(--foreground))" : "transparent",
          caretColor: "hsl(var(--primary))",
          ...style,
        }}
      />
    </div>
  );
};

export default AnimatedInput;
