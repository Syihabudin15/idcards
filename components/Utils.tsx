"use client";

import { CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Input, Select, Upload, UploadProps } from "antd";

export interface IFormInput {
  label: string;
  value?: any;
  onChange?: Function;
  prefix?: any;
  suffix?: any;
  mode?: "vertical" | "horizontal";
  type?:
    | "text"
    | "number"
    | "select"
    | "date"
    | "textarea"
    | "password"
    | "upload";
  options?: Array<{ label: string; value: any }>;
  disabled?: boolean;
  required?: boolean;
  labelIcon?: any;
  class?: any;
  accept?: string;
  placeholder?: string;
}

import dynamic from "next/dynamic";
import { useState } from "react";

export const ILayout = dynamic(() => import("@/components/ILayout"), {
  ssr: false,
  loading: () => <>Loading ...</>,
});

export const UserView = dynamic(() => import("@/components/UserView"), {
  ssr: false,
  loading: () => <>Loading ...</>,
});

export const UserViewV2 = dynamic(() => import("@/components/UserViewV2"), {
  ssr: false,
  loading: () => <>Loading ...</>,
});

export const FormInput = ({ data }: { data: IFormInput }) => {
  return (
    <div
      className={`flex ${
        data.mode === "vertical" ? "flex-col" : "items-center"
      } gap-2 mb-1 ${data.class}`}
    >
      <p className="w-52">
        {data.labelIcon && <span className="mr-1">{data.labelIcon}</span>}
        {data.label}
        {data.required && <span style={{ color: "red" }}>*</span>}
      </p>
      {data.type === "text" && (
        <Input
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          required={data.required}
          placeholder={data.placeholder}
        />
      )}
      {data.type === "date" && (
        <Input
          type={"date"}
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          required={data.required}
          placeholder={data.placeholder}
        />
      )}
      {data.type === "number" && (
        <Input
          type={"number"}
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          required={data.required}
          placeholder={data.placeholder}
        />
      )}
      {data.type === "textarea" && (
        <Input.TextArea
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          disabled={data.disabled}
          required={data.required}
          placeholder={data.placeholder}
        />
      )}
      {data.type === "select" && (
        <Select
          options={data.options}
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          allowClear
          style={{ width: "100%" }}
          placeholder={data.placeholder}
        />
      )}
      {data.type === "password" && (
        <Input.Password
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          required={data.required}
          placeholder={data.placeholder}
        />
      )}
      {data.type === "upload" && (
        <UploadComponents
          accept={data.accept || ""}
          file={data.value}
          setFile={(e: string) => data.onChange && data.onChange(e)}
        />
      )}
    </div>
  );
};

const UploadComponents = ({
  file,
  setFile,
  accept,
}: {
  file: string | undefined;
  setFile: Function;
  accept: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();
      if (resData.secure_url) {
        setFile(resData.secure_url);
      } else {
        setError(resData.error.message);
      }
    } catch (err) {
      console.log(err);
      setError("Internal Server Error");
    }
  };

  const handleDeleteFiles = async () => {
    setLoading(true);
    await fetch("/api/upload", {
      method: "DELETE",
      body: JSON.stringify({ publicId: file }),
    })
      .then(() => {
        setFile(undefined);
      })
      .catch((err) => {
        console.log(err);
        setError("Gagal hapus file!.");
      });
    setLoading(false);
  };

  const props: UploadProps = {
    beforeUpload: async (file) => {
      setLoading(true);
      await handleUpload(file);
      setLoading(false);
      return false; // prevent automatic upload
    },
    showUploadList: false, // sembunyikan default list
    accept: accept,
  };

  return (
    <div>
      {file ? (
        <div className="flex gap-2 items-center">
          <p>{file.substring(0, 30) + "..."}</p>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteFiles()}
            loading={loading}
          ></Button>
        </div>
      ) : (
        <div>
          <Upload {...props}>
            <Button
              size="small"
              icon={<CloudUploadOutlined />}
              loading={loading}
            >
              Upload Berkas
            </Button>
          </Upload>
          {error && <p className="italic text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};
