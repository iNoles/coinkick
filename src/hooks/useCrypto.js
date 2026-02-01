import { useState } from "react";
import axios from "axios";

export default function useCrypto() {
  const [coins, setCoins] = useState([]);
  const [chartCache, setChartCache] = useState({}); // Cache charts by coin id
  const [currentChart, setCurrentChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch top 10 coins
  const fetchCoins = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: { vs_currency: "usd", order: "market_cap_desc", per_page: 10 },
      });
      setCoins(res.data);
      setError(null);
    } catch {
      setError("Failed to fetch coins");
    } finally {
      setLoading(false);
    }
  };

  // Fetch chart data for a coin (uses cache)
  const fetchChartData = async (id) => {
    if (chartCache[id]) {
      // If cached, just set it
      setCurrentChart(chartCache[id]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
        { params: { vs_currency: "usd", days: 7 } }
      );
      const prices = res.data.prices;
      const chartData = {
        labels: prices.map((p) => new Date(p[0]).toLocaleDateString()),
        datasets: [
          {
            label: `${id.toUpperCase()} Price (USD)`,
            data: prices.map((p) => p[1]),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.2)",
          },
        ],
      };

      // Cache it
      setChartCache((prev) => ({ ...prev, [id]: chartData }));
      setCurrentChart(chartData);
      setError(null);
    } catch {
      setError("Failed to fetch chart data");
    } finally {
      setLoading(false);
    }
  };

  return { coins, currentChart, fetchCoins, fetchChartData, loading, error };
}
