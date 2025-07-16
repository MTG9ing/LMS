import axios from "axios";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function StudentID() {
  const { id } = useParams();
  const [student, setStudent] = useState({});

  useEffect(() => {
    axios
      .get(
        `http://${import.meta.env.VITE_API_HOST}:${
          import.meta.env.VITE_API_PORT
        }/api/students/${id}`
      )
      .then((res) => {
        setStudent(res.data.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const formatDate = (date) =>
    date ? format(new Date(date), "dd MMMM yyyy", { locale: arEG }) : "—";

  return (
    <div className="px-4 py-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Profile Overview */}
      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {student.fullName}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {student.studentNumber}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {!student.isStillAttending && (
                <Badge variant="destructive">منقطع</Badge>
              )}
              {student.isOnline && <Badge variant="secondary">أونلاين</Badge>}
              {student.gradeLevel && (
                <Badge className="bg-blue-100 text-blue-800">
                  {student.gradeLevel.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 font-bold gap-4 text-sm">
          <div>
            <span className="font-medium">تاريخ الميلاد:</span>{" "}
            {formatDate(student.dateOfBirth)}
          </div>
          <div>
            <span className="font-medium">رقم الهاتف:</span>{" "}
            <a
              href={`tel:${student.phone}`}
              className="text-blue-600 hover:underline"
            >
              {student.phone}
            </a>
          </div>
          <div>
            <span className="font-medium">البريد الإلكتروني:</span>{" "}
            {student.email || "—"}
          </div>
          <div>
            <span className="font-medium">تاريخ التسجيل:</span>{" "}
            {formatDate(student.createdAt)}
          </div>
        </CardContent>
      </Card>

      {/* Parent & Payment Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ولي الأمر</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {student.parent ? (
              <>
                <div>الاسم: {student.parent.name}</div>
                <div>
                  الهاتف:{" "}
                  <a
                    href={`tel:${student.parent.primaryPhone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {student.parent.primaryPhone}
                  </a>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">لا يوجد بيانات ولي أمر</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">خطة الدفع</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {student.paymentPlan ? (
              <>
                <div>الاسم: {student.paymentPlan.name}</div>
                <div>النوع: {student.paymentPlan.type}</div>
              </>
            ) : (
              <p className="text-muted-foreground">لا يوجد خطة دفع</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">ملاحظات</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          {Array.isArray(student.notes) && student.notes.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {student.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">لا توجد ملاحظات</p>
          )}

          {student.sensitiveNotes && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-300">
              ملاحظة حساسة: {student.sensitiveNotes}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="flex sm:flex-row flex-col w-full flex-wrap gap-2 overflow-scroll">
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          <TabsTrigger value="exams">الامتحانات</TabsTrigger>
          <TabsTrigger value="homework">الواجبات</TabsTrigger>
          <TabsTrigger value="behaviors">السلوك</TabsTrigger>
          <TabsTrigger value="payments">المدفوعات</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements">
          <DataSection title="الإنجازات" data={student.achievements} />
        </TabsContent>
        <TabsContent value="exams">
          <DataSection title="الامتحانات" data={student.exams} />
        </TabsContent>
        <TabsContent value="homework">
          <DataSection title="الواجبات" data={student.homework} />
        </TabsContent>
        <TabsContent value="behaviors">
          <DataSection title="السلوك" data={student.behaviors} />
        </TabsContent>
        <TabsContent value="payments">
          <DataSection title="المدفوعات" data={student.payments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DataSection({ title, data }) {
  return data?.length > 0 ? (
    <div className="space-y-3 mt-4">
      {data.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border p-3 text-sm bg-muted text-muted-foreground"
        >
          {JSON.stringify(item)}
        </div>
      ))}
    </div>
  ) : (
    <div className="py-6 text-center text-muted-foreground">
      لا يوجد {title}
    </div>
  );
}

export default StudentID;
