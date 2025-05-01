import { useState } from "react";
import { Button } from "./ui/button";
import { useReminders, useReminderDispatch } from "@/context/ReminderContext";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Reminder } from "@/interfaces/Reminder";
import { ReminderType } from "@/enums/ReminderEnums";
import { deleteReminder } from "@/api/ReminderApi";
import { reportErrorMessage } from "@/utils/handleErrorMessage";
import toast from "react-hot-toast";

export function ReminderDrawer() {
  const reminders = useReminders();
  const dispatch = useReminderDispatch();

  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null
  );

  const handleReminderClick = (reminder: Reminder) => {
    setSelectedReminder(reminder);
  };

  const handleDeleteReminder = async (reminderId?: number) => {
    if (!reminderId || !dispatch) return;
    dispatch({
      type: "delete",
      reminders: reminders.filter((reminder) => reminder.id === reminderId),
    });
    const response = await deleteReminder(reminderId);
    if (response.error) {
      reportErrorMessage("Failed to delete reminder", response.message);
      return;
    }
    toast.success("Reminder deleted successfully");
    setSelectedReminder(null);
  };

  return (
    <Drawer>
      {reminders.length === 0 && <h2>No reminders. Stay clean!</h2>}
      <div className="flex flex-col items-center">
        {reminders.map((reminder, index) => (
          <ReminderCard
            key={index}
            reminder={reminder}
            onClick={() => handleReminderClick(reminder)}
          />
        ))}
      </div>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm text-center pb-10">
          <DrawerHeader>
            <DrawerTitle>{selectedReminder?.title}</DrawerTitle>
            <DrawerDescription>
              {selectedReminder?.description}
            </DrawerDescription>
          </DrawerHeader>

          <div className="w-[80%] mx-auto mb-4">
            {selectedReminder?.dueDate && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-slate-500">Due Date:</span>
                <span className="text-sm text-slate-700">
                  {selectedReminder?.dueDate}
                </span>
              </div>
            )}
            {selectedReminder?.dueTime && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-slate-500">Due Time:</span>
                <span className="text-sm text-slate-700">
                  {selectedReminder?.dueTime}
                </span>
              </div>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                onClick={() => handleDeleteReminder(selectedReminder?.id)}
                className="cursor-pointer"
              >
                Complete
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button
                className="text-slate-700 cursor-pointer"
                variant="outline"
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ReminderCard({
  reminder,
  onClick,
}: {
  reminder: Reminder;
  onClick: () => void;
}) {
  return (
    <DrawerTrigger asChild key={reminder.id} onClick={onClick}>
      <Button
        className={`${
          reminder.reminderType == ReminderType.Personal
            ? "bg-violet-500/70"
            : "bg-blue-500/70"
        } max-w-[1024px] w-full p-6 text-slate-100 flex justify-between items-center border-1 border-slate-300 rounded-4xl shadow-sm text-lg cursor-pointer mb-3 backdrop-blur-md`}
      >
        <h2>{reminder.title}</h2>
        <div>X</div>
      </Button>
    </DrawerTrigger>
  );
}
