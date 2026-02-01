export default function UrlTable({ urls, onDelete, onCopy }) {
  function formatDate(createdAt) {
    if (!createdAt) return "—";
    return new Date(createdAt).toLocaleString();
  }

  return (
    <div className="glass p-4 mt-6">
      <div className="flex text-sm font-semibold border-b border-white/20 pb-2">
        <div className="w-2/12">Short</div>
        <div className="w-4/12">Original</div>
        <div className="w-2/12 text-center">Clicks</div>
        <div className="w-2/12">Created</div>
        <div className="w-2/12 text-right">Action</div>
      </div>

      {urls.map(url => (
        <div
          key={url.code}
          className="flex items-center text-sm py-3 border-b border-white/10"
        >
          <div
            className="w-2/12 text-purple-400 cursor-pointer hover:underline"
            onClick={() =>
                navigator.clipboard.writeText(
                `${window.location.origin}/${url.code}`
                ).then(() => onCopy())
            }
            >
            /{url.code}
          </div>

          <div className="w-4/12 truncate">
            {url.longUrl}
          </div>

          <div className="w-2/12 text-center">
            {url.clicks}
          </div>

          <div className="w-2/12">
            {formatDate(url.createdAt)}
          </div>

          <div className="w-2/12 text-right">
            <button
              onClick={() => onDelete(url.code)}
              className="text-red-400 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}