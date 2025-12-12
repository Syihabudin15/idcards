"use client";

import { Form, Input, Button, Layout, Row, Col, Card } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useState } from "react";
import Image from "next/image";
const { Content } = Layout;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>();

  const onFinish = async (e: any) => {
    if (!e || !e.password || !e.nip) {
      return setErr("Mohon lengkapi username & password");
    }
    setLoading(true);
    await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify(e),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          window && window.location.replace("/users");
        } else {
          setErr(res.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        setErr("Internal Server Error");
      });
    setLoading(false);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "blue" }}>
      <Content style={{ padding: "0 50px" }}>
        {/* Row dan Col untuk menempatkan formulir di tengah halaman */}
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
          <Col xs={24} lg={8}>
            <Card
              title={
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src="/globe.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    style={{ marginBottom: "8px" }}
                  />
                  <h2 className="font-bold text-xl mb-4">
                    {process.env.NEXT_PUBLIC_APP_NAME || "CARDS ID"}
                  </h2>
                </div>
              }
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: 20,
              }}
            >
              <Form name="normal_login" onFinish={onFinish}>
                {/* Input Username */}
                <Form.Item
                  name="nip"
                  rules={[
                    {
                      required: true,
                      message: "Tolong masukkan NIP Anda!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Nomor Induk Pegawai"
                    size="large"
                  />
                </Form.Item>

                {/* Input Password */}
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Tolong masukkan Password Anda!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    size="large"
                  />
                </Form.Item>
                {err && (
                  <div className="italic text-red-500">
                    <p>{err}</p>
                  </div>
                )}
                {/* Tombol Submit */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%", marginTop: 10 }}
                    size="large"
                    icon={<LoginOutlined />}
                    loading={loading}
                  >
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
