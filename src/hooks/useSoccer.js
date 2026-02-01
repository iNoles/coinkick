import { useState } from "react";
import axios from "axios";

export default function useSoccer() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php",
        { params: { id: 4346 } }
      );
      setMatches(res.data.events || []);
      setError(null);
    } catch {
      setError("Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  return { matches, fetchMatches, loading, error };
}
