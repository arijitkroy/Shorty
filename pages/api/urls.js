import { adminDb } from "@/lib/firebaseAdmin";
import { validateApiKey } from "@/lib/auth";

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;

  if (req.method !== "GET") return res.status(405).end();

  const { uid, limit = "10", startAfter } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }

  const limitNum = parseInt(limit);
  let query = adminDb
    .collection("urls")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(limitNum);

  if (startAfter) {
    const startAfterDoc = await adminDb.collection("urls").doc(startAfter).get();
    if (startAfterDoc.exists) {
      query = query.startAfter(startAfterDoc);
    }
  }

  const snapshot = await query.get();

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

  const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null;

  res.status(200).json({ urls, lastVisible });
}