import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma, { generateUserId, generateUserNIP } from "@/components/IPrisma";

export const GET = async (request: NextRequest) => {
  const page = request.nextUrl.searchParams.get("page") || "1";
  const limit = request.nextUrl.searchParams.get("limit") || "50";
  const search = request.nextUrl.searchParams.get("search");
  const position = request.nextUrl.searchParams.get("position");
  const status = request.nextUrl.searchParams.get("status");
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const find = await prisma.user.findMany({
    where: {
      ...(search && {
        OR: [
          { fullname: { contains: search } },
          { nip: { contains: search } },
          { nik: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
      ...(position && { position: { contains: position } }),
      ...(status && { status: status === "AKTIF" ? true : false }),
    },
    skip: skip,
    take: parseInt(limit),
    orderBy: {
      updated_at: "desc",
    },
  });

  const total = await prisma.user.count({
    where: {
      ...(search && {
        OR: [
          { fullname: { contains: search } },
          { nip: { contains: search } },
          { nik: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
      ...(position && { position: { contains: position } }),
      ...(status && { status: status === "AKTIF" ? true : false }),
    },
  });

  return NextResponse.json({
    status: 200,
    data: find,
    total: total,
  });
};

export const POST = async (request: NextRequest) => {
  const body: User = await request.json();
  const { id, nip, password, ...saved } = body;
  try {
    const generateId = await generateUserId();
    const generateNIP = await generateUserNIP(body);
    const pass = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        id: generateId,
        nip: nip || generateNIP,
        password: pass,
        ...saved,
      },
    });
    return NextResponse.json({
      status: 201,
      msg: "Berhasil menyimpan data user.",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      msg: "Gagal menyimpan data user. internal server error.",
    });
  }
};

export const PUT = async (request: NextRequest) => {
  const body: User = await request.json();
  const { id, ...updated } = body;
  try {
    const find = await prisma.user.findFirst({ where: { id } });

    if (find) {
      if (body.password && body.password.length < 20) {
        updated.password = await bcrypt.hash(body.password, 10);
      } else {
        updated.password = find.password;
      }
    }

    await prisma.user.update({
      where: { id: id },
      data: { ...updated, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Berhasil memperbarui data user.",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      msg: "Gagal memperbarui data user. internal server error.",
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    await prisma.user.update({
      where: { id: id },
      data: { status: false, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Berhasil menghapus data user.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal menghapus data user. internal server error.",
    });
  }
};

export const PATCH = async (req: NextRequest) => {
  const nip = req.nextUrl.searchParams.get("nip");
  if (!nip)
    return NextResponse.json(
      { msg: "Data tidak ditemukan", status: 400 },
      { status: 400 }
    );

  const find = await prisma.user.findFirst({ where: { nip } });
  if (!find)
    return NextResponse.json(
      { msg: "Data tidak ditemukan", status: 400 },
      { status: 400 }
    );

  return NextResponse.json({ status: 200, data: find }, { status: 200 });
};
