import { useState } from "react";
import Tabs from "./components/Tabs";
import CryptoTab from "./components/CryptoTab";
import SoccerTab from "./components/SoccerTab";

export default function App() {
  const [tab, setTab] = useState("crypto");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Interactive Dashboard</h1>
      <Tabs tab={tab} setTab={setTab} />

      {tab === "crypto" && <CryptoTab />}
      {tab === "soccer" && <SoccerTab />}
    </div>
  );
}
