import { useEffect } from "react";
import useSoccer from "../hooks/useSoccer";

export default function SoccerTab() {
  const { matches, fetchMatches, loading, error } = useSoccer();

  useEffect(() => {
    if (matches.length === 0) fetchMatches();
  }, []);

  return (
    <>
      {loading && <p>Loading soccer matches...</p>}
      {error && <p className="text-red-400">{error}</p>}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2">Date</th>
            <th className="p-2">Match</th>
            <th className="p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.idEvent} className="border-b border-gray-700">
              <td className="p-2">{match.dateEvent}</td>
              <td className="p-2">
                {match.strHomeTeam} vs {match.strAwayTeam}
              </td>
              <td className="p-2">{match.strTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
