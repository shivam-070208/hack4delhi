import React from "react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "text-lg font-semibold",
  md: "text-xl font-semibold",
  lg: "text-2xl font-bold",
  xl: "text-3xl font-bold",
  "2xl": "text-4xl font-extrabold",
};

const alignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function Heading({
  children,
  as: Component = "h2",
  className,
  size = "lg",
  color,
  align = "left",
  ...rest
}) {
  return (
    <Component
      className={cn(
        sizeMap[size],
        alignMap[align],
        "text-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

export { Heading };
