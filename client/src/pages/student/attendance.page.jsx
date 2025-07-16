import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";

const classSchedule = {
  "ee56efab-3444-424b-a7ed-65cc19a1e34e": "12:44",
  S2: "17:00",
  S3: "04:00",
};

function getCurrentClass() {
  const now = new Date();
  const currentTime = format(now, "HH:mm");
  const sorted = Object.entries(classSchedule).sort((a, b) =>
    b[1].localeCompare(a[1])
  );
  for (const [grade, time] of sorted) {
    if (currentTime >= time) return grade;
  }
  return null;
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gradeLevelId, setGradeLevelId] = useState(null);
  const [students, setStudents] = useState([]);
  const [presentIds, setPresentIds] = useState([]);

  useEffect(() => {
    if (isToday(selectedDate)) {
      const current = getCurrentClass();
      setGradeLevelId(current);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!gradeLevelId) return;
    axios
      .get(
        `http://${import.meta.env.VITE_API_HOST}:${
          import.meta.env.VITE_API_PORT
        }/api/students?gradeLevelId=${gradeLevelId}&limit=100&isOnline=all&isStillAttending=all`
      )
      .then((res) => setStudents(res.data.data))
      .catch(console.error);
  }, [gradeLevelId]);

  useEffect(() => {
    if (!gradeLevelId || !selectedDate) return;
    const date = format(selectedDate, "yyyy-MM-dd");
    axios
      .get(
        `http://${import.meta.env.VITE_API_HOST}:${
          import.meta.env.VITE_API_PORT
        }/api/attendance/${date}/${gradeLevelId}`
      )
      .then((res) =>
        setPresentIds(res.data?.data.map(({ studentId }) => studentId))
      )
      .catch(console.error);
  }, [gradeLevelId, selectedDate]);

  const handleToggle = async (studentId) => {
    const date = format(selectedDate, "yyyy-MM-dd");
    const isPresent = presentIds.includes(studentId);

    // Optimistic update
    setPresentIds((prev) =>
      isPresent ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );

    try {
      await axios.post(
        `http://${import.meta.env.VITE_API_HOST}:${
          import.meta.env.VITE_API_PORT
        }/api/attendance`,
        { gradeLevelId, date, studentId }
      );
    } catch (err) {
      console.error("Failed to toggle attendance", err);
      setPresentIds((prev) =>
        isPresent ? [...prev, studentId] : prev.filter((id) => id !== studentId)
      );
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
    setGradeLevelId(getCurrentClass());
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">
            Date: {format(selectedDate, "PPP")} | Time:{" "}
            {format(selectedDate, "HH:mm")}
          </h2>
          <p className="text-muted-foreground">
            Class: {gradeLevelId || "— No class currently"}
          </p>
        </div>
        <Button onClick={goToToday} disabled={isToday(selectedDate)}>
          Back to Today
        </Button>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="w-fit mx-auto"
      />

      {gradeLevelId ? (
        <>
          <h3 className="text-lg font-medium">Student Attendance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {students.map((student) => {
              const isPresent = presentIds.includes(student.id);
              return (
                <Card
                  key={student.id}
                  className={`cursor-pointer transition-all border-2 ${
                    isPresent
                      ? "border-green-500 bg-green-50"
                      : "border-muted bg-muted/20"
                  }`}
                  onClick={() => handleToggle(student.id)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="text-sm font-medium">
                      {student.fullName}
                    </div>
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {isPresent ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground mt-6 text-sm italic">
          No class is scheduled at this time.
        </div>
      )}
    </div>
  );
}
