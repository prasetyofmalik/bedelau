import { Header } from "@/components/Header";
import { TeamsList } from "@/components/monitoring/TeamsList";

export default function Monitoring() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Monitoring Tim Kerja</h1>
        <TeamsList />
      </main>
    </div>
  );
}