import StudentsList from "@/components/studentsList.component";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

function Students_Page() {
  return (
    <div className="p-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground">جميع الطلاب</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            إدارة بيانات الطلاب وعرض جميع السجلات الحالية.
          </p>
        </div>
        <Button variant="default">
          <Link to="/dashboard/students/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            <span className="font-semibold">طالب جديد</span>
          </Link>
        </Button>{" "}
        {/* Optional action */}
      </div>

      {/* Students List */}
      <div>
        <StudentsList />
      </div>
    </div>
  );
}

export default Students_Page;
