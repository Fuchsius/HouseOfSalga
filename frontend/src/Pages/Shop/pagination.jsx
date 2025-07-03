import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../Components/ui/button";
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pagesToShow = [1, 2, 3];

  return (
    <div className="flex  items-center justify-center gap-[216px] mt-8 mb-7">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 bg-[#FFFFFF]"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4 " />
        Previous
      </Button>

      <div className="flex items-center gap-2 ">
        {pagesToShow.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            className={`w-8 h-8 p-0 ${
              page === currentPage ? "bg-[#0000000F]" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        <span className="mx-1">...</span>
        {/* Last Pages */}
        {[7, 9, 10].map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            className={`w-8 h-8 p-0 ${
              page === currentPage ? "bg-[#0000000F]" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 bg-[#FFFFFF]"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
