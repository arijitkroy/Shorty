export default function UrlTable({ urls, onDelete, onCopy, hasMore, onLoadMore, onPrevious, canGoBack }) {
  function formatDate(createdAt) {
    if (!createdAt) return "—";
    return new Date(createdAt).toLocaleDateString();
  }

  return (
    <div className="glass p-4 mt-6 overflow-hidden">
      <div className="flex text-sm font-semibold border-b border-white/20 pb-2 px-2">
        <div className="w-4/12 md:w-2/12">Name</div>
        <div className="w-4/12 md:w-2/12">Short</div>
        <div className="hidden md:block w-3/12">Original</div>
        <div className="w-2/12 md:w-1/12 text-center">Clicks</div>
        <div className="hidden md:block w-2/12">Created</div>
        <div className="w-2/12 md:w-2/12 text-right">Action</div>
      </div>

      {urls.length === 0 ? (
        <div className="text-center py-10 text-white/40 italic">
          No URLs found. Create one above!
        </div>
      ) : (
        urls.map((url) => (
          <div
            key={url.code}
            className="flex items-center text-sm py-4 border-b border-white/5 hover:bg-white/5 transition px-2"
          >
             {/* Name (fallback to 'Untitiled' if empty) */}
             <div className="w-4/12 md:w-2/12 font-medium truncate pr-2">
               {url.name || <span className="text-white/30 italic">Untitled</span>}
             </div>

            {/* Short Code */}
            <div
              className="w-4/12 md:w-2/12 text-purple-400 cursor-pointer hover:underline truncate"
              onClick={() =>
                navigator.clipboard
                  .writeText(`${window.location.origin}/${url.code}`)
                  .then(() => onCopy())
              }
            >
              /{url.code}
            </div>

            {/* Long URL (Hidden on mobile) */}
            <div className="hidden md:block w-3/12 truncate text-white/60 pr-4">
              {url.longUrl}
            </div>

             {/* Clicks */}
            <div className="w-2/12 md:w-1/12 text-center text-white/80">
              {url.clicks}
            </div>

             {/* Date (Hidden on mobile) */}
            <div className="hidden md:block w-2/12 text-white/50 text-xs">
              {formatDate(url.createdAt)}
            </div>

             {/* Actions */}
            <div className="w-2/12 md:w-2/12 text-right">
              <button
                onClick={() => onDelete(url.code)}
                className="text-red-400 hover:text-red-500 transition opacity-80 hover:opacity-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6 pt-4 border-t border-white/10 px-2">
        <button
          onClick={onPrevious}
          disabled={!canGoBack}
          className={`text-sm px-4 py-1 rounded transition ${
            canGoBack
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "opacity-30 cursor-not-allowed"
          }`}
        >
          &larr; Previous
        </button>
        <button
          onClick={onLoadMore}
          disabled={!hasMore}
          className={`text-sm px-4 py-1 rounded transition ${
            hasMore
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "opacity-30 cursor-not-allowed"
          }`}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}