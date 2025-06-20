import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
export default function Pagination() {
  const currentPage = 1;

  return (
    <div className="flex  items-center justify-center gap-[216px] mt-8 mb-7">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 bg-[#FFFFFF]"
      >
        <ChevronLeft className="w-4 h-4 " />
        Previous
      </Button>

      <div className="flex items-center gap-2 ">
        {[1, 2, 3].map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            className={`w-8 h-8 p-0 ${
              page === currentPage ? "bg-[#0000000F]" : ""
            }`}
          >
            {page}
          </Button>
        ))}
        <span className="mx-1">...</span>
        {/* Last Pages */}
        {[7, 9, 10].map((page) => (
          <Button
            key={page}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 bg-[#FFFFFF]"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
