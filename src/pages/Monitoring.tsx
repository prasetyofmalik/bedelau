import { TeamsList } from "@/components/monitoring/TeamsList";

export default function Monitoring() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Monitoring Tim Kerja</h1>
      <TeamsList />
    </main>
  );
}