import React from "react";
import Link from "next/link";
import { PackagePlus, Tags } from "lucide-react";
import { Button } from "@/components/ui";

export function InventoryActionButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        asChild
        className="h-9 text-xs font-semibold gap-1.5 shadow-none bg-white"
      >
        <Link href="?modal=categories">
          <Tags className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Categorias</span>
        </Link>
      </Button>
      <Button
        asChild
        className="h-9 text-xs font-semibold gap-1.5 shadow-none"
      >
        <Link href="?modal=new-part">
          <PackagePlus className="w-3.5 h-3.5" />
          <span>Nova Peça</span>
        </Link>
      </Button>
    </div>
  );
}
