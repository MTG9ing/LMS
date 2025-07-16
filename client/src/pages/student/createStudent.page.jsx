import CreateStudent from "@/components/createStudent.component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateStudentPage() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          إضافة طالب جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CreateStudent />
      </CardContent>
    </Card>
  );
}
