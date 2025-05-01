import {
  ReminderType,
  ReminderStatus,
  PriorityType,
} from "@/enums/ReminderEnums";

export interface Reminder {
  id?: number;
  title: string;
  description?: string | undefined;
  dueDate?: string | undefined;
  dueTime?: string | undefined;
  status: ReminderStatus;
  reminderType: ReminderType;
  priority: PriorityType;
}
