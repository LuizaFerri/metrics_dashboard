import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CoinPaginationProps<T> {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function CoinPagination<T>({
  items,
  itemsPerPage,
  renderItem,
  className = "",
}: CoinPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  if (items.length <= itemsPerPage) {
    return (
      <div className={className}>
        {items.map((item, index) => renderItem(item, index))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={className}>
        {paginatedData.map((item, index) => renderItem(item, index))}
      </div>

      <div className="space-y-3">
        <div className="block md:hidden">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>

            <div className="text-center">
              <div className="text-sm text-slate-400">
                Página {currentPage} de {totalPages}
              </div>
              <div className="text-xs text-slate-500">{items.length} total</div>
            </div>

            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, currentPage - 1) + i;
                if (pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-8 h-8 text-sm font-medium rounded transition-colors ${
                      currentPage === pageNumber
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>

            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <span>•</span>
            <span>{items.length} items total</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, currentPage - 2) + i;
                if (pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-8 h-8 text-sm font-medium rounded transition-colors ${
                      currentPage === pageNumber
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
