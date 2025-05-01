import { useState } from "react";
import { Button } from "./ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CreateReminderForm } from "@/components/Forms/CreateReminderForm";

export function CreateReminderDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="px-8 py-6 text-lg text-slate-800 hover:text-slate-100 rounded-md cursor-pointer bg-stone-100">
          New
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm text-center pb-10">
          <DrawerHeader>
            <DrawerTitle>Create A New Reminder</DrawerTitle>
          </DrawerHeader>

          <CreateReminderForm setDrawerOpen={setOpen} />

          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                className="text-slate-700 cursor-pointer "
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
