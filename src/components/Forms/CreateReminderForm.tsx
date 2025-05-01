import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { EnumPicker } from "./EnumPicker";
import { addReminders, AddReminderResponse } from "@/api/ReminderApi";
import {
  PriorityType,
  ReminderType,
  ReminderStatus,
} from "@/enums/ReminderEnums";
import { Reminder } from "@/interfaces/Reminder";
import { useReminderDispatch } from "@/context/ReminderContext";
import { reportErrorMessage } from "@/utils/handleErrorMessage";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  reminderType: z.nativeEnum(ReminderType),
  priority: z.nativeEnum(PriorityType),

  //* Optionals
  duedate: z.string().date().optional(),
  duetime: z.string().time({ precision: 0 }).optional(),
});
interface CreateReminderFormProps {
  setDrawerOpen: (val: boolean) => void;
}

export function CreateReminderForm({ setDrawerOpen }: CreateReminderFormProps) {
  const dispatch = useReminderDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      reminderType: ReminderType.Personal,
      priority: PriorityType.Low,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newReminder: Reminder = {
      title: values.title,
      description: values.description,
      dueDate: values.duedate,
      dueTime: values.duetime,
      status: ReminderStatus.Pending,
      reminderType: values.reminderType,
      priority: values.priority,
    };

    const response = (await addReminders(newReminder)) as AddReminderResponse;
    if (response.error) {
      reportErrorMessage(response.message);
      return;
    }

    if (dispatch != null)
      dispatch({
        type: "add",
        reminders: [newReminder],
      });
    toast.success("Reminder created successfully");

    setDrawerOpen(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-slate-700 space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="reminderType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <EnumPicker
                  enumType={ReminderType}
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <EnumPicker
                  enumType={PriorityType}
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between gap-2">
          <FormField
            control={form.control}
            name="duedate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(dateString) => field.onChange(dateString)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Time</FormLabel>
                <FormControl>
                  <TimePicker
                    date={
                      field.value
                        ? new Date(`1970-01-01T${field.value}`)
                        : undefined
                    }
                    setDate={(newDate) => {
                      const timeString = newDate
                        ? `${newDate
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${newDate
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}:${newDate
                            .getSeconds()
                            .toString()
                            .padStart(2, "0")}`
                        : "";
                      field.onChange(timeString); // Pass string to react-hook-form
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mx-4 mt-8">
          <Button type="submit" className="cursor-pointer w-full">
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
