import { icons, HelpCircle, type LucideProps } from "lucide-react";

function toPascalCase(name: string) {
  return name
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/** Renders a lucide-react icon from an admin-editable kebab-case name (e.g. "battery-charging"). */
export function DynamicIcon({
  name,
  ...props
}: { name?: string | null } & Omit<LucideProps, "name">) {
  const Icon = name ? icons[toPascalCase(name) as keyof typeof icons] : undefined;
  const Component = Icon ?? HelpCircle;
  return <Component {...props} />;
}
