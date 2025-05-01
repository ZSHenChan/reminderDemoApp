import { Toaster } from "react-hot-toast";

export function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px",
        },
      }}
    />
  );
}
