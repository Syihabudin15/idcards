"use client";

import { IActionTable, IPageProps, IUser } from "@/components/IInterfaces";
import { FormInput } from "@/components/Utils";
import {
  BankOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  IdcardOutlined,
  KeyOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusCircleFilled,
  QrcodeOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Image,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  Tag,
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import moment from "moment";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { handlePrintIDCard } from "@/components/UserPrint";
import Link from "next/link";

export default function Page() {
  const [upsert, setUpsert] = useState<IActionTable<IUser>>({
    openUpsert: false,
    openDelete: false,
    selected: undefined,
  });
  const [pageProps, setPageProps] = useState<IPageProps<IUser>>({
    page: 1,
    limit: 10,
    total: 0,
    data: [],
    search: "",
    position: "",
    status: "",
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // State untuk menyimpan data URL QR code
  const [loading, setLoading] = useState(false);
  const { modal } = App.useApp();

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("page", pageProps.page.toString());
    params.append("limit", pageProps.limit.toString());
    if (pageProps.search) {
      params.append("search", pageProps.search);
    }
    if (pageProps.position) {
      params.append("position", pageProps.position);
    }
    if (pageProps.status) {
      params.append("status", pageProps.status);
    }
    const res = await fetch(`/api/users?${params.toString()}`);
    const json = await res.json();
    setPageProps((prev) => ({
      ...prev,
      data: json.data,
      total: json.total,
    }));
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [
    pageProps.page,
    pageProps.limit,
    pageProps.search,
    pageProps.position,
    pageProps.status,
  ]);

  const columns: TableProps<IUser>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Nama Lengkap",
      dataIndex: "fullname",
      key: "fullname",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
      render(value, record, index) {
        return (
          <div>
            <p>{record.fullname}</p>
            <p className="text-xs italic opacity-70">{record.nik}</p>
          </div>
        );
      },
    },
    {
      title: "NIP & Gender",
      dataIndex: "tambahan",
      key: "tambahan",
      render(value, record, index) {
        return (
          <div>
            <div className="text-xs italic text-blue-400">
              <p>@{record.nip}</p>
              <p>
                <KeyOutlined /> {record.jk ? record.jk : "Not set"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render(value, record, index) {
        return (
          <div>
            <p>
              <BankOutlined /> {process.env.NEXT_PUBLIC_APP_NAME}
            </p>
            <p>
              <IdcardOutlined /> {record.position}
            </p>
          </div>
        );
      },
    },
    {
      title: "Kontak",
      dataIndex: "contact",
      key: "contact",
      render(value, record, index) {
        return (
          <div>
            <p>
              <PhoneOutlined /> {record.phone}
            </p>
            <p>
              <MailOutlined /> {record.email}
            </p>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "success" : "error"} variant="solid">
          {status ? "Aktif" : "Non Aktif"}
        </Tag>
      ),
      sorter: (a, b) => (a.status === b.status ? 0 : a.status ? 1 : -1),
    },
    {
      title: "Join & Leave",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date, record) => (
        <div>
          <p className="text-green-700">
            <LoginOutlined /> {moment(record.tgl_join).format("DD-MM-YYYY")}
          </p>
          <p className="text-red-700">
            <LogoutOutlined />{" "}
            {record.tgl_leave
              ? moment(record.tgl_join).format("DD-MM-YYYY")
              : "-"}
          </p>
        </div>
      ),
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      className: "text-xs",
      render: (date) => moment(date).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Print QR",
      key: "qr",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<QrcodeOutlined />}
            size="small"
            type="primary"
            onClick={() => {
              setUpsert({ ...upsert, selected: record });
              const profileUrl = `${window.location.origin}/user/${record.nip}`;
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
            }}
          ></Button>
          <Button
            icon={<IdcardOutlined />}
            size="small"
            type="primary"
            onClick={() => {
              const profileUrl = `${window.location.origin}/user/${record.nip}`;
              QRCode.toDataURL(profileUrl, {
                width: 150,
                margin: 1,
                color: {
                  dark: "#000000", // Titik-titik QR
                  light: "#FFFFFF", // Background QR
                },
              })
                .then((url: string) => {
                  handlePrintIDCard(record, url);
                })
                .catch((err: any) => {
                  console.error(err);
                });
            }}
          ></Button>
        </div>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              setUpsert({ ...upsert, openUpsert: true, selected: record })
            }
            size="small"
            type="primary"
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() =>
              setUpsert({ ...upsert, openDelete: true, selected: record })
            }
            size="small"
            type="primary"
            danger
          ></Button>
          <Link href={"/user/" + record.nip} target="_blank">
            <Button icon={<EyeOutlined />} size="small" type="primary"></Button>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <Card
      title={
        <div className="flex gap-2 font-bold text-xl">
          <UserOutlined /> Users Management
        </div>
      }
      styles={{ body: { padding: 5 } }}
    >
      <div className="flex justify-between my-1">
        <div className="flex gap-2 items-center">
          <Button
            size="small"
            type="primary"
            icon={<PlusCircleFilled />}
            onClick={() =>
              setUpsert({ ...upsert, openUpsert: true, selected: undefined })
            }
          >
            Add User
          </Button>
          <Select
            style={{ width: 170 }}
            options={[
              { label: "AKTIF", value: "AKTIF" },
              { label: "TIDAK AKTIF", value: "TIDAK AKTIF" },
            ]}
            onChange={(e) => setPageProps({ ...pageProps, status: e })}
            placeholder="status..."
            size="small"
            allowClear
          />
          <Input.Search
            size="small"
            style={{ width: 170 }}
            placeholder="Cari jabatan..."
            onChange={(e) =>
              setPageProps({ ...pageProps, position: e.target.value })
            }
          />
        </div>
        <Input.Search
          size="small"
          style={{ width: 170 }}
          placeholder="Cari user..."
          onChange={(e) =>
            setPageProps({ ...pageProps, search: e.target.value })
          }
        />
      </div>

      <Table
        columns={columns}
        dataSource={pageProps.data}
        size="small"
        loading={loading}
        rowKey={"id"}
        bordered
        scroll={{ x: "max-content", y: 320 }}
        pagination={{
          current: pageProps.page,
          pageSize: pageProps.limit,
          total: pageProps.total,
          onChange: (page, pageSize) => {
            setPageProps((prev) => ({
              ...prev,
              page,
              limit: pageSize,
            }));
          },
          pageSizeOptions: [50, 100, 500, 1000],
        }}
      />
      <UpsertUser
        open={upsert.openUpsert}
        record={upsert.selected}
        setOpen={(v: boolean) => setUpsert({ ...upsert, openUpsert: v })}
        getData={getData}
        modal={modal}
        key={upsert.selected ? "upserted" + upsert.selected.id : "create"}
      />
      <DeleteUser
        open={upsert.openDelete}
        setOpen={(v: boolean) => setUpsert({ ...upsert, openDelete: v })}
        getData={getData}
        record={upsert.selected}
        key={upsert.selected ? "deleted" + upsert.selected.id : "delete"}
        modal={modal}
      />
      {qrCodeUrl && (
        <Modal
          open={true}
          onCancel={() => {
            setQrCodeUrl(null);
            setUpsert({ ...upsert, selected: undefined });
          }}
          footer={[]}
          title={`${upsert.selected?.fullname || ""} ${
            upsert.selected ? `(${upsert.selected.nip})` : ""
          }`}
        >
          <div className="flex justify-center p-5">
            <Image alt={qrCodeUrl} src={qrCodeUrl} />
          </div>
        </Modal>
      )}
    </Card>
  );
}

function UpsertUser({
  record,
  open,
  setOpen,
  getData,
  modal,
}: {
  record?: IUser;
  open: boolean;
  setOpen: Function;
  getData?: Function;
  modal: HookAPI;
}) {
  const [data, setData] = useState(record ? record : defaultUser);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    if ("Cabang" in data) {
      delete data.Cabang;
    }
    if ("Role" in data) {
      delete data.Role;
    }
    if ("Sumdan" in data) {
      delete data.Sumdan;
    }
    await fetch("/api/users", {
      method: record ? "PUT" : "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 201 || res.status === 200) {
          modal.success({
            title: "BERHASIL",
            content: `Data berhasil ${record ? "di Update" : "ditambahkan"}!`,
          });
          setOpen(false);
          getData && (await getData());
        } else {
          modal.error({
            title: "ERROR",
            content: res.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        modal.error({
          title: "ERROR",
          content: "Internal Server Error",
        });
      });
    setLoading(false);
  };

  return (
    <Modal
      title={record ? "Update User " + record.fullname : "Add New User"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={[]}
      loading={loading}
      style={{ top: 20 }}
    >
      <div className="flex flex-col gap-3">
        <div className="hidden">
          <FormInput
            data={{
              label: "USER ID",
              mode: "horizontal",
              type: "text",
              value: data.id,
              onChange: (e: string) => setData({ ...data, id: e }),
            }}
          />
        </div>
        <FormInput
          data={{
            label: "Nama Lengkap",
            mode: "horizontal",
            required: true,
            type: "text",
            value: data.fullname,
            onChange: (e: string) => setData({ ...data, fullname: e }),
          }}
        />
        <FormInput
          data={{
            label: "NIK",
            mode: "horizontal",
            required: true,
            type: "text",
            value: data.nik,
            onChange: (e: string) => setData({ ...data, nik: e }),
          }}
        />
        <FormInput
          data={{
            label: "Jenis Kelamin",
            mode: "horizontal",
            required: true,
            type: "select",
            options: [
              { label: "Laki - Laki", value: "Laki - Laki" },
              { label: "Perempuan", value: "Perempuan" },
            ],
            value: data.jk,
            onChange: (e: string) => setData({ ...data, jk: e }),
          }}
        />
        <FormInput
          data={{
            label: "NIP",
            mode: "horizontal",
            type: "text",
            value: data.nip,
            onChange: (e: string) => setData({ ...data, nip: e }),
            placeholder: "Kosongkan jika generate by Sistem",
          }}
        />
        <FormInput
          data={{
            label: "Email",
            mode: "horizontal",
            type: "text",
            value: data.email,
            onChange: (e: string) => setData({ ...data, email: e }),
          }}
        />
        <FormInput
          data={{
            label: "Password",
            mode: "horizontal",
            type: "password",
            required: true,
            value: record ? null : data.password,
            onChange: (e: string) => setData({ ...data, password: e }),
          }}
        />
        <FormInput
          data={{
            label: "No Telepon",
            mode: "horizontal",
            type: "text",
            value: data.phone,
            onChange: (e: string) => setData({ ...data, phone: e }),
          }}
        />
        <FormInput
          data={{
            label: "Jabatan",
            mode: "horizontal",
            type: "text",
            value: data.position,
            onChange: (e: string) => setData({ ...data, position: e }),
          }}
        />
        <FormInput
          data={{
            label: "Foto",
            mode: "horizontal",
            type: "upload",
            value: data.photo,
            onChange: (e: string) => setData({ ...data, photo: e }),
          }}
        />
        <div className="flex justify-end gap-4">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={() => handleSave()}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function DeleteUser({
  record,
  open,
  setOpen,
  getData,
  modal,
}: {
  record?: IUser;
  open: boolean;
  setOpen: Function;
  getData?: Function;
  modal: HookAPI;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/users?id=${record?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          modal.success({
            title: "SUCCESS",
            content: data.msg,
          });
          setOpen(false);
          getData && (await getData());
        } else {
          modal.error({
            title: "ERROR",
            content: data.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        modal.error({
          title: "ERROR",
          content: "Internal Server Error",
        });
      });
    setLoading(false);
  };
  return (
    <Modal
      loading={loading}
      footer={[]}
      open={open}
      onCancel={() => setOpen(false)}
      width={400}
      style={{ top: 20 }}
      title={"Delete User " + record?.fullname}
    >
      <p>Are you sure you want to delete this user?</p>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button danger onClick={handleDelete} loading={loading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

const defaultUser: IUser = {
  id: "",
  fullname: "",
  nik: "",
  nip: "",
  email: null,
  phone: null,
  password: "",
  position: "",
  jk: "",
  tgl_join: new Date(),
  tgl_leave: null,
  photo: null,

  status: true,
  created_at: new Date(),
  updated_at: new Date(),
};
