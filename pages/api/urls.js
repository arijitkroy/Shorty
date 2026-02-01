import { adminDb } from "@/lib/firebaseAdmin";
import { validateApiKey } from "@/lib/auth";

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;

  if (req.method !== "GET") return res.status(405).end();

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }

  const snapshot = await adminDb
    .collection("urls")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .get();

  const urls = snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      code: doc.id,
      ...data,
      createdAt: data.createdAt
        ? data.createdAt.toMillis()
        : null,
    };
  });

  res.status(200).json(urls);
}