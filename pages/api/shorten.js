import { adminDb, FieldValue } from "@/lib/firebaseAdmin";
import { nanoid } from "nanoid";
import { validateApiKey } from "@/lib/auth";

const blockedHosts = ["localhost", "127.0.0.1"];

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

async function isUrlReachable(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });

    return res.status >= 200 && res.status < 400;
  } catch (err) {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { longUrl, uid, name } = req.body;

  if (!longUrl || !uid) {
    return res.status(400).json({ error: "Missing data" });
  }

  if (!isValidUrl(longUrl)) {
    return res.status(400).json({ error: "Invalid URL (https:// or http:// is supported only)" });
  }

  if (blockedHosts.includes(new URL(longUrl).hostname)) {
    return res.status(400).json({ error: "Blocked URL" });
  }

  const existingSnapshot = await adminDb
    .collection("urls")
    .where("uid", "==", uid)
    .where("longUrl", "==", longUrl)
    .limit(1)
    .get();

  if (!existingSnapshot.empty) {
    const existingDoc = existingSnapshot.docs[0];
    return res.status(200).json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${existingDoc.id}`,
      existing: true,
    });
  }

  const reachable = await isUrlReachable(longUrl);
  if (!reachable) {
    return res.status(400).json({
      error: "URL is not reachable or does not respond",
    });
  }

  let code;
  let isUnique = false;

  // Collision detection loop
  while (!isUnique) {
    code = nanoid(6);
    const doc = await adminDb.collection("urls").doc(code).get();
    if (!doc.exists) {
      isUnique = true;
    }
  }

  await adminDb.collection("urls").doc(code).set({
    longUrl,
    uid,
    name: name || "",
    clicks: 0,
    createdAt: FieldValue.serverTimestamp(),
  });

  res.status(200).json({
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${code}`,
  });
}