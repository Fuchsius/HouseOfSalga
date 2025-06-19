import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
export default function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6].map((page) => (
          <Button
            key={page}
            variant={page === 1 ? "default" : "outline"}
            size="sm"
            className="w-8 h-8 p-0"
          >
            {page}
          </Button>
        ))}
      </div>

      <Button variant="outline" size="sm" className="flex items-center gap-1">
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
