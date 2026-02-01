export default function UrlTable({ urls, onDelete, onCopy, hasMore, onLoadMore, onPrevious, canGoBack }) {
  function formatDate(createdAt) {
    if (!createdAt) return "—";
    return new Date(createdAt).toLocaleDateString();
  }

  return (
    <div className="glass p-4 mt-6 overflow-hidden">
      {/* Header - Hidden on Mobile */ }
      <div className="hidden md:flex text-sm font-semibold border-b border-white/20 pb-2 px-2">
        <div className="w-2/12">Name</div>
        <div className="w-2/12">Short</div>
        <div className="w-3/12">Original</div>
        <div className="w-1/12 text-center">Clicks</div>
        <div className="w-2/12">Created</div>
        <div className="w-2/12 text-right">Action</div>
      </div>

      {urls.length === 0 ? (
        <div className="text-center py-10 text-white/40 italic">
          No URLs found. Create one above!
        </div>
      ) : (
        urls.map((url) => (
          <div
            key={url.code}
            className="flex flex-col md:flex-row md:items-center text-sm py-4 border-b border-white/5 hover:bg-white/5 transition px-2 gap-2 md:gap-0"
          >
             {/* Name & Date (Mobile only header-ish) */}
             <div className="md:w-2/12 font-medium truncate flex justify-between items-center w-full">
               <span className="truncate pr-2">{url.name || <span className="text-white/30 italic">Untitled</span>}</span>
               <span className="md:hidden text-xs text-white/40">{formatDate(url.createdAt)}</span>
             </div>

            {/* Short Code */}
            <div
              className="md:w-2/12 text-purple-400 cursor-pointer hover:underline truncate w-full flex items-center gap-2"
              onClick={() =>
                navigator.clipboard
                  .writeText(`${window.location.origin}/${url.code}`)
                  .then(() => onCopy())
              }
            >
              <span className="md:hidden text-white/40 text-xs uppercase tracking-wide">Short:</span>
              /{url.code}
            </div>

            {/* Long URL */}
            <div className="md:w-3/12 truncate text-white/60 pr-4 w-full flex items-center gap-2">
              <span className="md:hidden text-white/40 text-xs uppercase tracking-wide min-w-[40px]">Dest:</span>
              <span className="truncate">{url.longUrl}</span>
            </div>

             {/* Clicks */}
            <div className="md:w-1/12 md:text-center text-white/80 w-full flex items-center gap-2 md:justify-center">
               <span className="md:hidden text-white/40 text-xs uppercase tracking-wide">Clicks:</span>
              {url.clicks}
            </div>

             {/* Date (Desktop) */}
            <div className="hidden md:block md:w-2/12 text-white/50 text-xs">
              {formatDate(url.createdAt)}
            </div>

             {/* Actions */}
            <div className="md:w-2/12 text-right w-full mt-2 md:mt-0 flex gap-2 md:block">
               {/* Mobile Copy Button */}
               <button
                onClick={() =>
                    navigator.clipboard
                      .writeText(`${window.location.origin}/${url.code}`)
                      .then(() => onCopy())
                  }
                className="md:hidden flex-1 text-purple-300 hover:text-purple-400 border border-purple-500/20 rounded py-1"
               >
                 Copy
               </button>

              <button
                onClick={() => onDelete(url.code)}
                className="text-red-400 hover:text-red-500 transition opacity-80 hover:opacity-100 w-full md:w-auto border border-red-500/20 md:border-none rounded py-1 md:py-0 flex-1 md:flex-none"
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