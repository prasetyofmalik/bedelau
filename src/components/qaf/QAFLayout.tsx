import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

export function QAFLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex w-full">
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-auto">{children || <Outlet />}</main>
        </div>
      </div>
    </div>
  );
}
