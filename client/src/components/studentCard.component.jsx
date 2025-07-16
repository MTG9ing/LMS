import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Arabic date formatter
const formatArabicDate = (dateString) => {
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export default function StudentCard({ student }) {
  const {
    id,
    studentNumber,
    fullName,
    phone,
    dateOfBirth,
    gradeLevel,
    isOnline,
    isStillAttending,
  } = student;

  return (
    <Card className="group relative border rounded-2xl shadow-sm hover:shadow-lg hover:border-primary transition-all duration-200 overflow-hidden">
      <CardHeader className="">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg  font-semibold text-foreground truncate">
            {fullName}
          </CardTitle>
        </div>
        <div className="">
          {gradeLevel?.name && (
            <Badge className="text-xs m-0.5 bg-blue-100 text-blue-800 px-2 py-0.5">
              {gradeLevel.name}
            </Badge>
          )}
          <Badge
            className={`text-xs m-0.5 ${
              isOnline
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            } px-2 py-0.5`}
          >
            {isOnline ? "في السنتر" : "عبر الانترنت"}
          </Badge>
          <Badge className="text-xs bg-gray-100 text-gray-800 m-0.5 px-2 py-0.5">
            {new Date(dateOfBirth).getFullYear()}
          </Badge>
          <Badge
            className={`text-xs m-0.5 ${
              isStillAttending
                ? "bg-yellow-200 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            } px-2 py-0.5`}
          >
            {isStillAttending ? "مستمر" : "غير مستمر"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="text-sm space-y-3">
        <Detail label="رقم الطالب" value={studentNumber} />
        <Detail
          label="رقم الهاتف"
          value={
            <a
              href={`tel:${phone}`}
              className="text-primary hover:underline font-medium"
            >
              {phone}
            </a>
          }
        />
        <Detail label="تاريخ الميلاد" value={formatArabicDate(dateOfBirth)} />

        <Link to={`/dashboard/students/${id}`}>
          <Button
            size="sm"
            className="mt-4 w-full font-medium group-hover:bg-primary/90 transition-colors"
            aria-label={`عرض الملف الشخصي لـ ${fullName}`}
          >
            عرض الملف الشخصي
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm text-muted-foreground">
      <span className="font-medium text-foreground whitespace-nowrap">
        {label}
      </span>
      <span className="text-right truncate">{value}</span>
    </div>
  );
}
