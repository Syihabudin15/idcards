"use client";

import {
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  HomeOutlined,
  BankOutlined,
  IdcardOutlined,
  QrcodeOutlined,
  KeyOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import QRCode from "qrcode";
import { IUser } from "./IInterfaces";
import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { handlePrintIDCard } from "./UserPrint";

const UserDetail = ({ user }: { user: IUser }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // State untuk menyimpan data URL QR code

  // 2. Buat QR code setiap kali komponen menerima data user
  useEffect(() => {
    if (user) {
      // URL yang akan di-encode. Ini akan menghasilkan URL absolut.
      const profileUrl = `${window.location.origin}/user/${user.nip}`;

      // Generate QR code menjadi data URL
      QRCode.toDataURL(profileUrl, {
        width: 150,
        margin: 1,
        color: {
          dark: "#000000", // Titik-titik QR
          light: "#FFFFFF", // Background QR
        },
      })
        .then((url: string) => {
          setQrCodeUrl(url);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }, [user]);

  if (!user) {
    return <div className="text-center p-4">Memuat data user...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto my-10 bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Header: Avatar dan Nama */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-center space-x-4">
          <img
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            src={user.photo || `/default.png`} // Gunakan avatar dari data atau placeholder
            alt={`${user.fullname}'s avatar`}
          />
          <div>
            <h1 className="text-3xl font-bold text-white">{user.fullname}</h1>
            <p className="text-blue-100">@{user.nip}</p>
            <p className="text-blue-100">{user.jk}</p>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]} style={{ padding: 20 }}>
        {/* Informasi Lain */}
        <Col xs={24} lg={12}>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Informasi User
          </h2>

          <div className="flex items-start space-x-3 my-2">
            <KeyOutlined className="text-gray-400 text-xl w-6 mt-1" />
            <div className="flex gap-2">
              <span className="font-medium text-gray-600 w-30">ID/NIP</span>
              <span className="font-medium text-gray-600 w-4">:</span>
              <span className="flex-1 text-gray-800">
                {user.id} / {user.nip}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 my-2">
            <HomeOutlined className="text-gray-400 text-xl w-6 mt-1" />
            <div className="flex gap-2">
              <span className="font-medium text-gray-600 w-30">Alamat</span>
              <span className="font-medium text-gray-600 w-4">:</span>
              <p className="flex-1 text-gray-800">
                Alamat Jl. xxxx, No x
                <br />
                Kota City, Provinsi Prov 4xxxx
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 my-2">
            <BankOutlined className="text-gray-400 text-xl w-6" />
            <div className="flex gap-2">
              <span className="font-medium text-gray-600 w-30">Perusahaan</span>
              <span className="font-medium text-gray-600 w-4">:</span>
              <span className="flex-1 text-gray-800">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 my-2">
            <IdcardOutlined className="text-gray-400 text-xl w-6" />
            <div className="flex gap-2">
              <span className="font-medium text-gray-600 w-30">Jabatan</span>
              <span className="font-medium text-gray-600 w-4">:</span>
              <span className="flex-1 text-gray-800">{user.position}</span>
            </div>
          </div>
        </Col>

        {/*  Informasi Kontak */}
        <Col xs={24} lg={12}>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Informasi Kontak
          </h2>

          <div className="flex items-center space-x-3 my-2">
            <MailOutlined className="text-gray-400 text-xl w-6" />
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2 text-gray-800">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 my-2">
            <PhoneOutlined className="text-gray-400 text-xl w-6" />
            <div>
              <span className="font-medium text-gray-600">Telepon:</span>
              <span className="ml-2 text-gray-800">{user.phone}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 my-2">
            <GlobalOutlined className="text-gray-400 text-xl w-6" />
            <div>
              <span className="font-medium text-gray-600">Website:</span>
              <a
                href={`/user/${user.nip}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 hover:underline"
              >
                /user/{user.nip}
              </a>
            </div>
          </div>
        </Col>

        {/* QR Code */}
        <Col span={24}>
          <div className="border-t pt-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
              <QrcodeOutlined className="mr-2" />
              Bagikan Profil
            </h2>
            <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg">
              {qrCodeUrl ? (
                <>
                  <img
                    src={qrCodeUrl}
                    alt="QR Code untuk profil user"
                    className="rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Scan untuk membuka profil {user.fullname}
                  </p>
                </>
              ) : (
                <p>Membuat QR Code...</p>
              )}
            </div>
          </div>
        </Col>
      </Row>
      {/* <div className="p-6 space-y-4"></div> */}
      {qrCodeUrl && (
        <div className="border-t pt-4 mt-6">
          <button
            onClick={() => handlePrintIDCard(user, qrCodeUrl)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <PrinterOutlined />
            <span>Cetak ID Card (PDF)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
