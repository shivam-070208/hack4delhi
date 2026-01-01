import React from "react";

export default function Loader({ size = 40, className = "" }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ minHeight: size + 24 }}
      aria-label="Loading"
    >
      <span
        className="border-muted border-t-primary inline-block animate-spin rounded-full border-4 border-solid"
        style={{
          width: size,
          height: size,
        }}
      ></span>
    </div>
  );
}
