import React from "react";
import { CategoryDTO } from "@fluxos/contracts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PartCategorySelectProps {
  categories: CategoryDTO[];
  value?: string | null;
  onChange: (value: string) => void;
  className?: string;
}

export function PartCategorySelect({
  categories,
  value,
  onChange,
  className = "",
}: PartCategorySelectProps) {
  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger className={`h-9 text-sm bg-white border-input ${className}`.trim()}>
        <SelectValue placeholder="Selecione a categoria" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((c) => (
          <SelectItem key={c.id} value={c.id} className="text-sm">
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
