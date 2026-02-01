import { useState } from "react";

export default function UrlForm({ onSubmit }) {
  const [url, setUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsModalOpen(true);
  };

  const handleFinalSubmit = (skipped = false) => {
    onSubmit(url, skipped ? "" : name);
    setIsModalOpen(false);
    setUrl("");
    setName("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="glass p-6 flex gap-3">
        <input
          className="flex-1 bg-transparent border-b outline-none text-white placeholder-white/50 focus:border-purple-400 transition"
          placeholder="Paste long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 rounded font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-500/30"
        >
          Shorten
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade">
          <div className="glass p-8 w-full max-w-md animate-scale">
            <h3 className="text-xl font-bold mb-4">Add a Name? (Optional)</h3>
            <p className="text-sm text-white/60 mb-6">
              Give your URL a recognizable name to find it easily later.
            </p>
            <input
              className="w-full bg-black/20 border border-white/10 rounded p-3 mb-6 outline-none focus:border-purple-400 transition"
              placeholder="e.g. My Portfolio, TPS Report"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleFinalSubmit(true)}
                className="px-4 py-2 text-white/70 hover:text-white transition"
              >
                Skip
              </button>
              <button
                onClick={() => handleFinalSubmit(false)}
                className="px-6 py-2 bg-purple-600 rounded hover:bg-purple-700 transition shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}