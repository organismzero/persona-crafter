import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary/80 shadow-inner">
      <SliderPrimitive.Range className="absolute h-full bg-primary/90" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-6 -translate-y-1 rounded-full border-2 border-background bg-primary shadow-lg ring-2 ring-primary/30 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
