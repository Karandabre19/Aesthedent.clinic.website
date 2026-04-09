import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground shadow-sm transition-all duration-300 placeholder:text-muted-foreground focus-visible:border-[hsl(var(--color-accent))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-accent))]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
