import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { toast } from "sonner";
import { z } from "zod";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const studentSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "الاسم يجب أن يحتوي على 3 أحرف على الأقل" })
    .max(50, { message: "الاسم طويل جدًا (الحد الأقصى 50 حرفًا)" }),
  dateOfBirth: z.date({ required_error: "تاريخ الميلاد مطلوب" }),
  email: z
    .string()
    .email({ message: "صيغة البريد الإلكتروني غير صحيحة" })
    .optional(),
  phone: z
    .string()
    .min(10, { message: "رقم الهاتف غير مكتمل" })
    .max(15, { message: "رقم الهاتف طويل جدًا" })
    .optional(),
  gradeLevelId: z
    .string({ required_error: "الصف الدراسي مطلوب" })
    .uuid({ message: "الصف الدراسي غير صالح" }),
  parentId: z
    .string({ required_error: "يجب اختيار ولي أمر" })
    .uuid({ message: "ولي الأمر غير صالح" }),
  isOnline: z.boolean().optional(),
  isStillAttending: z.boolean().optional(),
  notes: z.array(z.string()).optional().default([]),
  sensitiveNotes: z.string().nullable().optional(),
  paymentPlanId: z
    .string({ required_error: "خطة الدفع مطلوبة" })
    .uuid({ message: "خطة الدفع غير صالحة" }),
});

export default function CreateStudent() {
  const [date, setDate] = useState(new Date("1990-01-01"));
  const [gradeLevels, setGradeLevels] = useState([]);
  const [parents, setParents] = useState([]);
  const [paymentPlans, setPaymentPlans] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: date,
      email: "",
      phone: "",
      gradeLevelId: "",
      isOnline: false,
      isStillAttending: true,
      parentId: "",
      paymentPlanId: "",
      notes: [],
      sensitiveNotes: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "notes",
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      const host = import.meta.env.VITE_API_HOST;
      const port = import.meta.env.VITE_API_PORT;

      try {
        const [grades, parentsRes, plans] = await Promise.all([
          axios.get(`http://${host}:${port}/api/gradelevel`),
          axios.get(`http://${host}:${port}/api/parent`),
          axios.get(`http://${host}:${port}/api/payment-plans`),
        ]);

        setGradeLevels(grades.data.data);
        setParents(parentsRes.data.data);
        setPaymentPlans(plans.data.data);
      } catch (error) {
        toast.error("فشل تحميل البيانات، حاول لاحقًا.");
      }
    };

    fetchDropdowns();
  }, []);

  const onSubmit = async (data) => {
    toast.promise(
      axios.post(
        `http://${import.meta.env.VITE_API_HOST}:${
          import.meta.env.VITE_API_PORT
        }/api/students`,
        { ...data, dateOfBirth: data.dateOfBirth.toISOString() }
      ),
      {
        loading: "جاري إنشاء الطالب...",
        success: () => {
          reset();
          setDate(new Date("1990-01-01"));
          return "تم إنشاء الطالب بنجاح!";
        },
        error: "حدث خطأ أثناء إنشاء الطالب.",
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-background rounded-xl shadow-md max-w-3xl mx-auto border"
    >
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        معلومات الطالب
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="fullName">الاسم الكامل *</Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="مثال: محمد أحمد"
          />
          {errors.fullName && (
            <p className="text-destructive text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="dateOfBirth">تاريخ الميلاد *</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (d) {
                setDate(d);
                setValue("dateOfBirth", d, { shouldValidate: true });
              }
            }}
            locale={arEG}
            max={new Date()}
            className="w-full border rounded-md"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {format(date, "yyyy - MMMM, dd", { locale: arEG })}
          </p>
          {errors.dateOfBirth && (
            <p className="text-destructive text-sm mt-1">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="example@mail.com"
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="مثال: 01012345678"
          />
          {errors.phone && (
            <p className="text-destructive text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            id: "gradeLevelId",
            label: "الصف الدراسي *",
            data: gradeLevels,
            error: errors.gradeLevelId,
            placeholder: "اختر الصف",
          },
          {
            id: "parentId",
            label: "ولي الأمر *",
            data: parents,
            error: errors.parentId,
            placeholder: "اختر ولي الأمر",
          },
          {
            id: "paymentPlanId",
            label: "خطة الدفع *",
            data: paymentPlans,
            error: errors.paymentPlanId,
            placeholder: "اختر خطة الدفع",
          },
        ].map(({ id, label, data, error, placeholder }) => (
          <div key={id}>
            <Label htmlFor={id}>{label}</Label>
            <Select
              onValueChange={(val) =>
                setValue(id, val, { shouldValidate: true })
              }
              value={watch(id)}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {data.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-destructive text-sm mt-1">{error.message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-6 items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isOnline"
            checked={watch("isOnline")}
            onCheckedChange={(val) => setValue("isOnline", !!val)}
          />
          <Label htmlFor="isOnline">طالب أونلاين</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isStillAttending"
            checked={watch("isStillAttending")}
            onCheckedChange={(val) => setValue("isStillAttending", !!val)}
          />
          <Label htmlFor="isStillAttending">لا يزال يحضر</Label>
        </div>
      </div>

      <div>
        <Label>ملاحظات</Label>
        {fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 mt-2">
            <Input
              {...register(`notes.${idx}`)}
              placeholder={`ملاحظة ${idx + 1}`}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(idx)}
            >
              حذف
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => append("")}
          variant="secondary"
          className="mt-2"
        >
          + إضافة ملاحظة
        </Button>
      </div>

      <div>
        <Label htmlFor="sensitiveNotes">ملاحظات حساسة</Label>
        <Textarea
          id="sensitiveNotes"
          {...register("sensitiveNotes")}
          placeholder="أدخل أي ملاحظات خاصة لا تظهر للجميع..."
          rows={4}
        />
        {errors.sensitiveNotes && (
          <p className="text-destructive text-sm mt-1">
            {errors.sensitiveNotes.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full py-3 mt-6 text-lg">
        إنشاء الطالب
      </Button>
    </form>
  );
}
