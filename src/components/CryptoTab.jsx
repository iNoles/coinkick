import { useEffect } from "react";
import useCrypto from "../hooks/useCrypto";
import { Line } from "react-chartjs-2";

export default function CryptoTab() {
  const { coins, currentChart, fetchCoins, fetchChartData, loading, error } = useCrypto();

  useEffect(() => {
    if (coins.length === 0) fetchCoins();
  }, []);

  return (
    <>
      {loading && <p>Loading crypto data...</p>}
      {error && <p className="text-red-400">{error}</p>}

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
              <td
                className={`p-2 ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
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

      {currentChart && (
        <div className="mt-8 bg-gray-800 p-4 rounded">
          <Line data={currentChart} />
        </div>
      )}
    </>
  );
}
