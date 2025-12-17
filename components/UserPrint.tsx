import moment from "moment";
import { IUser } from "./IInterfaces";

export const handlePrintIDCard = async (user: IUser, qrCodeUrl: string) => {
  if (!user || !qrCodeUrl) {
    alert("Data atau QR Code belum siap.");
    return;
  }

  // --- Fungsi bantuan untuk mengubah gambar menjadi Data URL ---

  const htmlContent = generateContent(user, qrCodeUrl);

  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) {
    alert("Popup diblokir. Mohon izinkan popup dari situs ini.");
    return;
  }

  w.document.open();
  w.document.write(htmlContent);
  w.document.close();
  w.onload = function () {
    setTimeout(() => {
      w.print();
    }, 200);
  };
};

const generateContent = (user: IUser, qrUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    @page {
      size: 54mm 86mm;
      margin: 0;
    }

    body {
      margin: 0;
      font-family: Cambria,"Segoe UI", Arial, sans-serif;
      background: #f8fafc;
      font-size: 8px !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .small-text {
      font-size: 7px !important;
    }

    .card {
      width: 54mm;
      height: 86mm;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      overflow: hidden;
      border: 1px solid #d5d5d5;
      position: relative;
      padding: 2mm 4mm;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .flex { display: flex; }
    .gap-2 { gap: 2mm; }
    .gap-4 { gap: 4mm; }
    .p-2 { padding: 2mm; }
    .flex-1 { flex: 1; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }

    .photo {
      width: 22mm;
      height: 22mm;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #1e3a8a;
    }

    .photo img {
      width: 100%;
      height: 100%;
      transform: scale(1.2); 
      object-fit: cover;
    }

    .qr-frame {
      width: 12mm;
      height: 12mm;
      padding: 1mm;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .qr-frame img {
      width: 100%;
      height: 100%;
    }
    .header-bg {
      background: linear-gradient(to right, #004aad, #0102cf, #ff3333);
      color: white;
    }
  </style>
</head>

<body>
  <div class="card small-text">

    <div class="flex flex-col gap-2 p-2 items-center rounded border-b">
      <div class="photo">
        <img src="${user.photo || "/default.png"}" />
      </div>
      <div class="flex-1 text-center">
        <p style="font-weight:bold; font-size:9px;">${user.fullname.toUpperCase()}</p>
        <div style="line-height:1.1;">
          <p class="small-text opacity-70">@${user.nip}</p>
          <p class="small-text opacity-70">${user.jk}</p>
        </div>
      </div>
    </div>


    <div class="my-1 flex flex-col gap-0.5">
      <div class="flex justify-between items-center">
        <p class="font-bold">No ID</p>
        <p>${user.id}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="font-bold">Perusahaan</p>
        <p>${process.env.NEXT_PUBLIC_APP_FULLNAME || "BANK RIFI"}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="font-bold">Jabatan</p>
        <p>${user.position}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="font-bold">Email</p>
        <p>${user.email ? user.email : "-"}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="font-bold">Handphone</p>
        <p>${user.phone ? user.phone : "-"}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="font-bold">Website</p>
        <p>www.bankrifi.co.id</p>
      </div>
    </div>


    <div class="flex justify-between items-center rounded border-t pt-2">
      <img src="${
        process.env.NEXT_PUBLIC_APP_LOGO || "/rifi-logo.png"
      }" style="width: 12mm; height: 12mm;"/>
      <div class="qr-frame">
        <img src="${qrUrl}" />
      </div>
    </div>

  </div>
</body>
</html>
`;

{
  /* <div class="flex justify-between items-center p-2 header-bg rounded text-white">
      <div>
        <p style="font-weight:bold;">
          ${(process.env.NEXT_PUBLIC_APP_NAME || "CARDS ID").toUpperCase()}
        </p>
        <p class="small-text opacity-70">${user.id}</p>
        ${
          user.email ? `<p class="small-text opacity-70">${user.email}</p>` : ""
        }
        ${
          user.phone ? `<p class="small-text opacity-70">${user.phone}</p>` : ""
        }
      </div>

      <div class="qr-frame">
        <img src="${qrUrl}" />
      </div>
    </div> */
}
