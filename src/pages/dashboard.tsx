import { getSessionItem } from "@/utils/jwtSession";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReminders, QueryObject } from "@/api/ReminderApi";
import { Reminder } from "@/interfaces/Reminder";
import { ReminderDrawer } from "@/components/ReminderDrawer";
import { CreateReminderDrawer } from "@/components/CreateReminderDrawer";
import { useReminderDispatch } from "@/context/ReminderContext";
import { reportErrorMessage } from "@/utils/handleErrorMessage";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();

  const dispatch = useReminderDispatch();

  useEffect(() => {
    const fetchReminders = async () => {
      const response = await getReminders({} as QueryObject);
      if (response.error) {
        reportErrorMessage("Could not fetch reminders", response.message);
        return;
      }

      if (dispatch != null)
        dispatch({
          type: "fetch",
          reminders: response.reminders as Reminder[],
        });
    };

    const tokenSessionItem = getSessionItem();
    if (!tokenSessionItem) {
      toast("Session expired. Please login again.");
      navigate("/");
      return;
    }

    toast.promise(fetchReminders, {
      loading: "Loading reminders...",
      success: "Reminders loaded successfully",
      error: "Could not load reminders",
    });
  }, [dispatch, navigate]);

  return (
    <>
      <div className="min-h-screen w-screen text-center bg-neutral-800 py-5 px-[5%]">
        <h1 className="text-3xl mb-4">Reminders</h1>
        <ReminderDrawer />
      </div>
      <div className="fixed bottom-5 right-5">
        <CreateReminderDrawer />
      </div>
    </>
  );
}

export default Dashboard;
