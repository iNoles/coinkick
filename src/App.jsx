import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function App() {
  const [tab, setTab] = useState("crypto"); // "crypto" or "soccer"
  
  // Crypto state
  const [coins, setCoins] = useState([]);
  const [chartData, setChartData] = useState(null);

  // Soccer state
  const [matches, setMatches] = useState([]);

  // Fetch top 10 crypto coins
  useEffect(() => {
    if (tab === "crypto") {
      axios
        .get("https://api.coingecko.com/api/v3/coins/markets", {
          params: { vs_currency: "usd", order: "market_cap_desc", per_page: 10 },
        })
        .then(res => setCoins(res.data));
    }
  }, [tab]);

  // Fetch coin chart data
  const fetchChartData = (id) => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        params: { vs_currency: "usd", days: 7 },
      })
      .then((res) => {
        const prices = res.data.prices;
        setChartData({
          labels: prices.map((p) => new Date(p[0]).toLocaleDateString()),
          datasets: [
            {
              label: `${id.toUpperCase()} Price (USD)`,
              data: prices.map((p) => p[1]),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.2)",
            },
          ],
        });
      });
  };

  // Fetch upcoming soccer matches (English Premier League)
  useEffect(() => {
    if (tab === "soccer") {
      axios
        .get("https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php", {
          params: { id: 4346 }, // MLS League ID
        })
        .then(res => setMatches(res.data.events || []));
    }
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Interactive Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "crypto" ? "bg-blue-600" : "bg-gray-700"}`}
          onClick={() => setTab("crypto")}
        >
          Crypto
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "soccer" ? "bg-blue-600" : "bg-gray-700"}`}
          onClick={() => setTab("soccer")}
        >
          Soccer
        </button>
      </div>

      {/* Crypto Tab */}
      {tab === "crypto" && (
        <>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-2">Coin</th>
                <th className="p-2">Price</th>
                <th className="p-2">Change (24h)</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-700">
                  <td className="p-2 flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                    {coin.name}
                  </td>
                  <td className="p-2">${coin.current_price.toLocaleString()}</td>
                  <td className={`p-2 ${coin.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
                      onClick={() => fetchChartData(coin.id)}
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {chartData && (
            <div className="mt-8 bg-gray-800 p-4 rounded">
              <Line data={chartData} />
            </div>
          )}
        </>
      )}

      {/* Soccer Tab */}
      {tab === "soccer" && (
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
                <td className="p-2">{match.strHomeTeam} vs {match.strAwayTeam}</td>
                <td className="p-2">{match.strTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
