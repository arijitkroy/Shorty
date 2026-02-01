import { adminDb } from "@/lib/firebaseAdmin";
import { validateApiKey } from "@/lib/auth";

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;

  if (req.method !== "DELETE") return res.status(405).end();

  const { code, uid } = req.body;

  const ref = adminDb.collection("urls").doc(code);
  const snap = await ref.get();

  if (!snap.exists) {
    return res.status(404).json({ error: "Not found" });
  }

  if (snap.data().uid !== uid) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  await ref.delete();
  res.status(200).json({ success: true });
}