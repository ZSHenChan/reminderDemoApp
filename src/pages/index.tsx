import { LoginForm } from "@/components/Forms/LoginForm";
import { RegisterForm } from "@/components/Forms/RegisterForm";
import { Tab, TabProps } from "@/components/ui/Tabs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionItem } from "@/utils/jwtSession";

const tabs: TabProps[] = [
  {
    title: "Login",
    content: <LoginForm />,
  },
  {
    title: "Register",
    content: <RegisterForm />,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = getSessionItem();
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Tab contains={tabs} />
    </div>
  );
}
