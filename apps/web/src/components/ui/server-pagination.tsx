import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ServerPaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ServerPagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  className = "",
}: ServerPaginationProps) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Paginação da tabela"
      className={`flex items-center justify-between gap-4 py-3 px-1 text-xs text-muted-foreground ${className}`.trim()}
    >
      <div>
        {typeof totalItems === "number" ? (
          <span>
            Total de <strong className="text-foreground">{totalItems}</strong> registros
          </span>
        ) : (
          <span>
            Página <strong className="text-foreground">{page}</strong> de{" "}
            <strong className="text-foreground">{Math.max(totalPages, 1)}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="h-7 px-2 text-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Anterior
        </Button>
        <span className="text-xs px-2 font-medium text-foreground">
          {page} / {Math.max(totalPages, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="h-7 px-2 text-xs"
        >
          Próxima
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </nav>
  );
}
