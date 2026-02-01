import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import UrlForm from "@/components/UrlForm";
import UrlTable from "@/components/UrlTable";
import { useRouter } from "next/router";

const PAGE_SIZE = 10;

export default function Home() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState("");
  const [urls, setUrls] = useState([]);
  const [lastCursor, setLastCursor] = useState(null);
  const [cursorStack, setCursorStack] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/login");
    }
  }, [mounted, loading, user, router]);

  useEffect(() => {
    if (user) fetchUrls(null, true);
  }, [user]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Redirecting to login...
      </div>
    );
  }

  async function fetchUrls(startAfter = null, reset = false) {
    try {
      let url = `/api/urls?uid=${user.uid}&limit=${PAGE_SIZE}`;
      if (startAfter) url += `&startAfter=${startAfter}`;

      const res = await fetch(url, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to load URLs");
        return;
      }

      setUrls(data.urls || []);
      setLastCursor(data.lastVisible || null);

      if (reset) {
        setCursorStack([]);
      }
    } catch {
      showToast("Network error");
    }
  }

  const handleNext = () => {
    if (!lastCursor) return;

    setCursorStack((prev) => [...prev, lastCursor]);
    fetchUrls(lastCursor);
  };

  const handlePrev = () => {
    if (cursorStack.length === 0) return;

    const newStack = [...cursorStack];
    newStack.pop();

    const prevCursor = newStack[newStack.length - 1] || null;
    setCursorStack(newStack);
    fetchUrls(prevCursor);
  };

  async function shorten(longUrl, name) {
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ longUrl, uid: user.uid, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Something went wrong");
        return;
      }

      showToast(data.existing ? "URL already exists" : "Short URL created");

      fetchUrls(null, true); // reset to first page
    } catch {
      showToast("Network error");
    }
  }

  async function deleteUrl(code) {
    await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify({ code, uid: user.uid }),
    });

    setUrls((prev) => prev.filter((u) => u.code !== code));
  }

  return (
    <>
      <Navbar user={user} />

      <div className="max-w-5xl mx-auto pt-10">
        <UrlForm onSubmit={shorten} />

        <UrlTable
          urls={urls}
          onDelete={deleteUrl}
          onCopy={() => showToast("Short URL copied to clipboard")}
          hasMore={urls.length === PAGE_SIZE}
          onLoadMore={handleNext}
          canGoBack={cursorStack.length > 0}
          onPrevious={handlePrev}
        />
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 glass px-5 py-3 text-sm text-white shadow-lg animate-fade">
          {toast}
        </div>
      )}
    </>
  );
}