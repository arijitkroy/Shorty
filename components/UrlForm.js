import { useState } from "react";

export default function UrlForm({ onSubmit }) {
  const [url, setUrl] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(url);
        setUrl("");
      }}
      className="glass p-6 flex gap-3"
    >
      <input
        className="flex-1 bg-transparent border-b outline-none"
        placeholder="Paste long URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className="px-4 py-2 bg-purple-600 rounded">
        Shorten
      </button>
    </form>
  );
}