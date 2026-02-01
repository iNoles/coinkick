export default function Tabs({ tab, setTab }) {
  return (
    <div className="flex gap-4 mb-6">
      {["crypto", "soccer"].map((t) => (
        <button
          key={t}
          className={`px-4 py-2 rounded ${
            tab === t ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setTab(t)}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
