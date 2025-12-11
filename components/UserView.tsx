"use client";

import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Card, Descriptions, Tag, Avatar } from "antd";
import { IUser } from "./IInterfaces";

// Asumsi tipe data User sama dengan model Prisma Anda
// Catatan: Nilai sensitif seperti 'password' dan 'nik' tidak diakses/ditampilkan
const UserProfilePublic = ({ user }: { user: IUser }) => {
  if (!user) {
    return (
      <div className="p-4 text-center text-red-500">
        Data pengguna tidak ditemukan.
      </div>
    );
  }

  // Fungsi utilitas untuk memformat tanggal
  const formatDate = (dateString: Date) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Logika untuk menampilkan status
  const StatusTag = user.status ? (
    <Tag
      icon={<CheckCircleOutlined />}
      color="success"
      className="font-semibold"
    >
      Aktif
    </Tag>
  ) : (
    <Tag icon={<CloseCircleOutlined />} color="error" className="font-semibold">
      Tidak Aktif
    </Tag>
  );

  return (
    <div className="flex justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
      <Card
        className="w-full max-w-4xl shadow-2xl rounded-xl"
        title={
          <div className="flex items-center space-x-4">
            <UserOutlined className="text-xl text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">
              Detail Profil Pengguna
            </span>
          </div>
        }
      >
        {/* === Bagian Header Profil (Avatar dan Nama) === */}
        <div className="flex flex-col items-center border-b pb-6 mb-6">
          <Avatar
            size={120}
            src={user.photo || undefined} // Menggunakan foto jika ada
            icon={!user.photo && <UserOutlined />}
            className="mb-4 bg-blue-100 text-blue-600 border-4 border-blue-200"
          />
          <h1 className="text-3xl font-extrabold text-gray-900">
            {user.fullname}
          </h1>
          <p className="text-lg text-blue-600 font-medium mt-1">
            {user.position || "Jabatan Belum Ditentukan"}
          </p>
          <div className="mt-2">{StatusTag}</div>
        </div>

        {/* === Bagian Deskripsi Detail === */}
        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }} // Responsif: 1 kolom di mobile, 2 kolom di desktop
          size="middle"
          layout="vertical" // Menggunakan layout vertical agar lebih rapi di desktop
        >
          {/* Kelompok Data Identitas */}
          <Descriptions.Item
            label={
              <div className="flex items-center">
                <IdcardOutlined className="mr-2" /> NIP
              </div>
            }
            span={1}
          >
            <span className="font-mono text-base font-semibold">
              {user.nip}
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <div className="flex items-center">
                <SolutionOutlined className="mr-2" /> Jenis Kelamin
              </div>
            }
            span={1}
          >
            {user.jk || "-"}
          </Descriptions.Item>

          {/* Kelompok Data Kontak */}
          <Descriptions.Item
            label={
              <div className="flex items-center">
                <MailOutlined className="mr-2" /> Email Kantor
              </div>
            }
            span={1}
          >
            <a
              href={`mailto:${user.email}`}
              className="text-blue-500 hover:underline"
            >
              {user.email || "Tidak tersedia"}
            </a>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <div className="flex items-center">
                <PhoneOutlined className="mr-2" /> Telepon
              </div>
            }
            span={1}
          >
            {user.phone || "-"}
          </Descriptions.Item>

          {/* Kelompok Data Riwayat */}
          <Descriptions.Item
            label={
              <div className="flex items-center">
                <CalendarOutlined className="mr-2" /> Tanggal Bergabung
              </div>
            }
            span={1}
          >
            {formatDate(user.tgl_join)}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <div className="flex items-center">
                <CalendarOutlined className="mr-2" /> Tanggal Keluar
              </div>
            }
            span={1}
          >
            {user.tgl_leave ? formatDate(user.tgl_leave) : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserProfilePublic;
