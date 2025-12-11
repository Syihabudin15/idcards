import { UserView, UserViewV2 } from "@/components/Utils";

type params = {
  nip: string;
};

export default async function Page({ params }: { params: Promise<params> }) {
  // const { nip } = await params;
  const user = dummyUser;

  return (
    <div className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 py-4">
      <UserViewV2 user={user} />
    </div>
  );
}

const dummyUser = {
  id: "RMUID-123",
  nip: "RMID122025001",
  fullname: "Budi Santoso",
  nik: "3201xxxxxxxxxxxx", // Disembunyikan
  jk: "Laki-laki",
  position: "Manager Keuangan",
  email: "budi.santoso@contoh.com",
  password: "hashedpassword", // Disembunyikan
  phone: "081234567890",
  photo: "/default.png",
  tgl_join: new Date("2015-03-01"),
  tgl_leave: null,
  status: true,
  created_at: new Date(),
  updated_at: new Date(),
};
