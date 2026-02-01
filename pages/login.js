import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass p-10 text-center space-y-6">
        <h1 className="text-3xl font-bold neon">Shorty</h1>
        <button
          onClick={login}
          className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}