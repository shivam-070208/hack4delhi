import { cn } from "@/lib/utils";
import React from "react";

const sizeClassMap = {
  full: "w-full",
  xtraLarge: "max-w-8xl",
  large: "max-w-6xl",
  medium: "max-w-3xl",
  small: "max-w-md",
};

const paddingClassMap = {
  small: "p-2 sm:p-3 lg:p-4",
  medium: "p-4 sm:p-6 lg:p-8",
  large: "p-6 sm:p-10 lg:p-16",
  none: "p-0",
};

const Container = ({
  children,
  className = "",
  as: Component = "div",
  style,
  size = "large",
  padding = "medium",
  "data-testid": dataTestId,
}) => {
  return (
    <Component
      className={cn(
        "mx-auto ",
        sizeClassMap[size],
        paddingClassMap[padding],
        className
      )}
      style={style}
      data-testid={dataTestId}
    >
      {children}
    </Component>
  );
};

export default Container;