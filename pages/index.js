import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import UrlForm from "@/components/UrlForm";
import UrlTable from "@/components/UrlTable";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const [user, loading] = useAuthState(auth);
  const [urls, setUrls] = useState([]);
  const [toast, setToast] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/login");
    }
  }, [mounted, loading, user, router]);

  useEffect(() => {
    if (user) {
      fetchUrls();
    }
  }, [user]);

  if (!mounted || loading || !user) {
    return null;
  }

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  async function fetchUrls() {
    try {
      const res = await fetch(`/api/urls?uid=${user.uid}`, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUrls(data);
      } else {
        console.error("Failed to fetch URLs:", data);
        setUrls([]);
      }
    } catch (err) {
      console.error(err);
      setUrls([]);
    }
  }

  async function shorten(longUrl) {
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ longUrl, uid: user.uid }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Something went wrong");
        return;
      }
      showToast("Short URL created");
      fetchUrls();
    } catch (error) {
      showToast("Network error. Try again.");
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