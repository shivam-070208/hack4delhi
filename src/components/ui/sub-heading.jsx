import React from "react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "text-base font-medium",
  md: "text-lg font-semibold",
  lg: "text-xl font-bold",
};

const alignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function SubHeading({
  children,
  as: Component = "h3",
  className,
  size = "md",
  align = "left",
  ...rest
}) {
  return (
    <Component
      className={cn(
        sizeMap[size],
        alignMap[align],
        "text-muted-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

export { SubHeading };
