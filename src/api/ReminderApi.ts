import { getSessionItem } from "@/utils/jwtSession";
import { Reminder } from "@/interfaces/Reminder";
import {
  ReminderStatus,
  ReminderType,
  PriorityType,
} from "@/enums/ReminderEnums";
import {
  getErrorMessage,
  reportErrorMessage,
} from "@/utils/handleErrorMessage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const REMINDER_URL = `${BACKEND_URL}/reminder`;
const ACCOUNT_URL = `${BACKEND_URL}/account`;

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface GetRemindersResponse {
  error: boolean;
  message: string;
  reminders: Reminder[];
}

export interface AddReminderResponse {
  error: boolean;
  message: string;
}

export interface QueryObject {
  Title?: string;
  Description?: string;
  Status?: ReminderStatus;
  Type?: ReminderType;
}

async function login(loginRequest: LoginRequest) {
  try {
    const response = await fetch(`${ACCOUNT_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });
    if (!response.ok) {
      return { error: true, message: "Incorrect email or password" };
    }
    return response.json();
  } catch (error) {
    const message = getErrorMessage(error);
    reportErrorMessage(message);
    return {
      error: true,
      message: "Something went wrong",
    };
  }
}

async function register(registerRequest: RegisterRequest) {
  try {
    const response = await fetch(`${ACCOUNT_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    });
    const responseJson = await response.json();
    if (!response.ok) {
      console.error(responseJson);
      const errorMessage = Object.values(responseJson.errors).join("\n");
      return { error: true, message: errorMessage };
    }
    return responseJson;
  } catch (error) {
    const message = getErrorMessage(error);
    reportErrorMessage(message);
    return {
      error: true,
      message: "Something went wrong",
    };
  }
}

async function deleteReminder(id: number) {
  const token = getSessionItem()?.token;
  try {
    const response = await fetch(`${REMINDER_URL}/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(response.json());
      return {
        error: true,
        message: "Unable to delete reminder",
      };
    }

    return {
      error: false,
      message: "Reminder deleted successfully",
    };
  } catch (err) {
    const message = getErrorMessage(err);
    reportErrorMessage(message);
    return {
      error: true,
      message: "Unable to delete reminder",
    };
  }
}

async function addReminders(reminder: Reminder): Promise<AddReminderResponse> {
  const token = getSessionItem()?.token;

  try {
    const response = await fetch(`${REMINDER_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify([reminder]),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      const errorMessage = Object.values(responseJson.errors).join(",\n");
      return {
        error: true,
        message: errorMessage,
      };
    }

    return {
      error: false,
      message: "Reminder added successfully",
    };
  } catch (err) {
    const message = getErrorMessage(err);
    reportErrorMessage(message);
    return {
      error: true,
      message: "Something went wrong",
    };
  }
}

async function getReminders(
  queryObject: QueryObject
): Promise<GetRemindersResponse> {
  const token = getSessionItem()?.token;

  const queryString = Object.entries(queryObject)
    .map(([key, val]) => `${key}=${String(val)}`)
    .join("&");

  try {
    const response = await fetch(`${REMINDER_URL}/all?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        error: true,
        message: "Could not fetch reminders",
        reminders: [],
      };
    }
    const data = await response.json();
    const result: Reminder[] = data.map((reminder: Reminder) => ({
      ...reminder,
      reminderType:
        ReminderType[reminder.reminderType as keyof typeof ReminderType],
      status: ReminderStatus[reminder.status as keyof typeof ReminderStatus],
      priority: PriorityType[reminder.priority as keyof typeof PriorityType],
    }));

    return {
      error: false,
      message: "Fetched reminders successfully",
      reminders: result,
    };
  } catch (err) {
    const message = getErrorMessage(err);
    reportErrorMessage(message);
    return {
      error: true,
      message: "Something went wrong",
      reminders: [],
    };
  }
}

export { login, register, getReminders, deleteReminder, addReminders };
