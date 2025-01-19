import { TeamCard } from "./TeamCard";
import { teams } from "./teamsData";

export function TeamsList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} {...team} />
      ))}
    </div>
  );
}