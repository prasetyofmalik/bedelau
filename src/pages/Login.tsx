import { Header } from "@/components/Header";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginHeader } from "@/components/auth/LoginHeader";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
          <LoginHeader />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}