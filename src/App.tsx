import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/index";
import Dashboard from "./pages/dashboard";
import { RegisterForm } from "./components/Forms/RegisterForm.tsx";
import { ReminderProvider } from "./context/ReminderProvider.tsx";
import GlobalLayout from "./components/Layout/Global.tsx";

function App() {
  return (
    <ReminderProvider>
      <Router>
        <GlobalLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </GlobalLayout>
      </Router>
    </ReminderProvider>
  );
}

export default App;
