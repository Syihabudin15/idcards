"use client";
import { Button, Layout, Menu, Modal, theme, Typography } from "antd";
import { LogoutOutlined, TeamOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MenuItemType } from "antd/es/menu/interface";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export const menuItems = [
  // { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/users", icon: <TeamOutlined />, label: "Management User" },
];

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth", { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        window && window.location.replace("/");
      });
    setLoading(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible breakpoint="lg" collapsedWidth="0" width={250}>
        <div
          className="demo-logo-vertical"
          style={{
            height: 32,
            margin: 10,
            color: "white",
            textAlign: "center",
          }}
        >
          <Title level={4} style={{ color: "white", margin: 0 }}>
            {process.env.NEXT_PUBLIC_APP_NAME || "CARDS ID"}
          </Title>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={menuItems as MenuItemType[]}
          onClick={(e) => router.push(e.key)}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            height: 60,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: "0 20px", lineHeight: "60px" }}>
            {process.env.NEXT_PUBLIC_APP_NAME || "CARDS ID"}
          </Title>
          <Button
            danger
            icon={<LogoutOutlined />}
            size="small"
            onClick={() => setOpen(true)}
            style={{ marginRight: 10 }}
          >
            Logout
          </Button>
        </Header>

        {/* Konten Utama */}
        <Content style={{ margin: "10px 14px" }}>
          <div
            style={{
              // padding: 10,
              minHeight: 360,
              // background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={"Konfirmasi Logout?"}
        onOk={() => handleLogout()}
        loading={loading}
      >
        <p>Lanjutkan untuk keluar?</p>
      </Modal>
    </Layout>
  );
};

export default DashboardLayout;
