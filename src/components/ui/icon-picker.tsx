import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { ICON_OPTIONS, getIcon, type IconName } from "@/lib/icons";

interface IconPickerProps {
  value: IconName;
  onChange: (name: IconName) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className
          )}
          aria-label="Choose icon"
        >
          {getIcon(value)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[70vh] overflow-y-auto p-1 w-72" align="end">
        {ICON_OPTIONS.map((o) => {
          const selected = value === o.name;
          return (
            <DropdownMenuItem
              key={o.name}
              className="flex items-center gap-3 px-2 py-1.5 text-sm text-left cursor-pointer"
              onClick={() => onChange(o.name)}
              value={selected ? "true" : undefined}
            >
              <IconPickIcon name={o.name} />
              <span className="truncate">{o.label}</span>
              {selected && (
                <Check className="ml-auto h-4 w-4 shrink-0 text-accent-foreground" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function IconPickIcon({ name }: { name: IconName }) {
  const Icon = getIcon(name);
  return <Icon className="h-4 w-4 shrink-0" />;
}
