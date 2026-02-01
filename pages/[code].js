import { adminDb, FieldValue } from "@/lib/firebaseAdmin";

export async function getServerSideProps({ params }) {
  const ref = adminDb.collection("urls").doc(params.code);
  const snap = await ref.get();

  if (!snap.exists) {
    return { notFound: true };
  }

  await ref.update({
    clicks: FieldValue.increment(1),
  });

  return {
    redirect: {
      destination: snap.data().longUrl,
      permanent: true,
    },
  };
}

export default function Redirect() {
  return null;
}