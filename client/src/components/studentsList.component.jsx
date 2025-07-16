import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import StudentCard from "@/components/studentCard.component";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Debounce Hook (JavaScript version)
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function StudentsList() {
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isOnline, setIsOnline] = useState("all");
  const [isStillAttending, setIsStillAttending] = useState("all");
  const [gradeLevelId, setGradeLevelId] = useState("all");
  const [order, setOrder] = useState("createdAt");
  const [sort, setSort] = useState("desc");

  const debouncedSearch = useDebounce(search);
  useEffect(() => {
    setPageNumber(1); // reset page on filters change
  }, [debouncedSearch, isOnline, isStillAttending, gradeLevelId, sort, order]);

  // TODO: add select for grade level from the data base
  // TODO: test select filter

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "students",
      pageNumber,
      debouncedSearch,
      isOnline,
      isStillAttending,
      gradeLevelId,
    ],
    queryFn: async () => {
      const res = await axios.get(
        `http://${import.meta.env.VITE_API_HOST}:${
          import.meta.env.VITE_API_PORT
        }/api/students`,
        {
          params: {
            page: pageNumber,
            limit: 6,
            isStillAttending,
            isOnline,
            gradeLevelId,
            sort,
            order,
            search: debouncedSearch,
          },
        }
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const students = Array.isArray(data?.data) ? data.data : [];

  const meta = data?.meta || {};

  return (
    <div>
      {/* Search & Filters */}
      <div className="bg-background py-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            placeholder="ابحث باسم الطالب أو رقمه..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={() => {
              setSearch("");
              setIsOnline("all");
              setIsStillAttending("all");
              setGradeLevelId("all");
              setOrder("createdAt");
              setSort("desc");
            }}
            variant="outline"
          >
            مسح
          </Button>
        </div>

        <div className="flex overflow-auto gap-2">
          <Select value={isOnline} onValueChange={setIsOnline}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="نوع التعليم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">أونلاين</SelectItem>
              <SelectItem value="true">حضوري</SelectItem>
              <SelectItem value="all">الكل</SelectItem>
            </SelectContent>
          </Select>

          <Select value={isStillAttending} onValueChange={setIsStillAttending}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="الحالة الدراسية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">مستمر</SelectItem>
              <SelectItem value="false">منقطع</SelectItem>
              <SelectItem value="all">الكل</SelectItem>
            </SelectContent>
          </Select>

          <Select value={gradeLevelId} onValueChange={setGradeLevelId}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="الصف الدراسي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="1">الأول</SelectItem>
              <SelectItem value="2">الثاني</SelectItem>
              <SelectItem value="ee56efab-3444-424b-a7ed-65cc19a1e34e">
                الثالث
              </SelectItem>
              {/* Add more grade levels if needed */}
            </SelectContent>
          </Select>

          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="الفرز" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">بتوقيت الإنشاء</SelectItem>
              <SelectItem value="fullName">بالاسم</SelectItem>
              <SelectItem value="dateOfBirth">بتاريخ الميلاد</SelectItem>
              <SelectItem value="phone">برقم الهاتف</SelectItem>
              <SelectItem value="studentNumber">برقم الطالب</SelectItem>
              <SelectItem value="email">بالبريد الالكتروني</SelectItem>
              {/* Add more grade levels if needed */}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">طبيعي</SelectItem>
              <SelectItem value="desc">عكسي</SelectItem>
              {/* Add more grade levels if needed */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl shadow-sm border space-y-3 bg-muted"
            >
              <Skeleton className="h-6 w-3/4 bg-muted-foreground/20" />
              <Skeleton className="h-4 w-2/3 bg-muted-foreground/20" />
              <Skeleton className="h-4 w-1/2 bg-muted-foreground/20" />
              <Skeleton className="h-4 w-1/3 bg-muted-foreground/20" />
              <Skeleton className="h-9 w-full rounded-md bg-muted-foreground/20" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="text-red-500 font-semibold text-center py-6">
          فشل تحميل بيانات الطلاب.
        </p>
      ) : students.length > 0 ? (
        <>
          {/* Student Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                {meta.hasPreviousPage && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setPageNumber((prev) => Math.max(prev - 1, 1))
                      }
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: meta.totalPages || 1 }).map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === meta.totalPages ||
                    Math.abs(page - pageNumber) <= 1
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === pageNumber}
                          onClick={() => setPageNumber(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (Math.abs(page - pageNumber) === 2) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                {meta.hasNextPage && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPageNumber((prev) =>
                          Math.min(prev + 1, meta.totalPages || prev + 1)
                        )
                      }
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <div className="text-center font-[arial] font-bold text-muted-foreground py-12">
          لا يوجد نتائج مطابقة لــــ{" "}
          <span className="font-medium">({search})</span>
        </div>
      )}
    </div>
  );
}
