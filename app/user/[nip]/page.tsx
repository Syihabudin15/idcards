import { UserViewV2 } from "@/components/Utils";
import { headers } from "next/headers";

type params = {
  nip: string;
};

export default async function Page({ params }: { params: Promise<params> }) {
  const { nip } = await params;
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";

  const origin = `${protocol}://${host}`;
  const res = await fetch(`${origin}/api/users?nip=` + nip, {
    method: "PATCH",
  });
  const { data: user } = await res.json();

  if (!user) {
    return (
      <div className="p-4 text-center text-red-500">
        Data pengguna tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 py-4">
      <UserViewV2 user={user} />
    </div>
  );
}
