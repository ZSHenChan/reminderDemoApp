import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { register } from "@/api/ReminderApi";
import { setSessionItem } from "@/utils/jwtSession";
import { reportErrorMessage } from "@/utils/handleErrorMessage";
import toast from "react-hot-toast";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string(),
  confirmPassword: z.string(),
});

export function RegisterForm() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const registerToastId = toast.loading("Registering...", {
      removeDelay: 5000,
    });
    const response = await register(values);
    if (response.error) {
      toast.error("Register Failed.", { id: registerToastId });
      setErrorMsg(response.message);
      reportErrorMessage(response.message, response.message);
      return;
    }
    setSessionItem(response.token);
    toast.success("Register successful! Redirecting...", {
      id: registerToastId,
    });
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 text-center px-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="reminder@reminder.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="reminder master" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} type="password" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} type="password" />
              </FormControl>
              <FormDescription className="text-red-500">
                {errorMsg}
              </FormDescription>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="px-8 bg-neutral-200 text-neutral-800 cursor-pointer hover:text-slate-200 "
        >
          Register
        </Button>
      </form>
    </Form>
  );
}
