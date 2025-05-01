import { ReactNode } from "react";
import { CustomToaster } from "@/components/ui/Toaster";

export default function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CustomToaster />
      {children}
    </>
  );
}
