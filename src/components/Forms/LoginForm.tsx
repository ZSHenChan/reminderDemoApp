import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { login } from "@/api/ReminderApi";
import { setSessionItem } from "@/utils/jwtSession";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string(),
});

export function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>("");
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const loginToastId = toast.loading("Loading...");
    const response = await login(values);

    // console.log(response.body);
    if (response.error) {
      toast.error("Login Failed.", { id: loginToastId });
      setErrorMsg(response.message);
      return;
    }
    setSessionItem(response.token);
    toast.success("Login successful! Redirecting...", { id: loginToastId });
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 py-8 px-4 text-center"
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
              <FormMessage />
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
              <FormDescription className="text-red-500">
                {errorMsg}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="px-8 bg-neutral-200 text-neutral-800 cursor-pointer hover:text-slate-200 "
        >
          Log in
        </Button>
      </form>
    </Form>
  );
}
