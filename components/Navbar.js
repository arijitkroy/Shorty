import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar({ user }) {
  return (
    <nav className="glass flex items-center justify-between px-6 py-4">
      <h1 className="text-xl font-bold text-purple-400">
        Shorty - URL Shortener
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">{user.displayName}</span>
        <button
          onClick={() => signOut(auth)}
          className="text-sm text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}