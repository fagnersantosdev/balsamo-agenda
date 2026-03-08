import { cn } from "@/lib/utils";

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-px w-full bg-[#8D6A93]/20", className)}
      {...props}
    />
  );
}