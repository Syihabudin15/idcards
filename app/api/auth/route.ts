import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/components/IPrisma";
import { getSession, signIn, signOut } from "@/components/Auth";

export const POST = async (req: NextRequest) => {
  const { nip, password } = await req.json();
  if (!nip || !password) {
    return NextResponse.json(
      { msg: "Mohon lengkapi nip & password!", status: 404 },
      { status: 404 }
    );
  }
  try {
    const find = await prisma.user.findFirst({ where: { nip: nip } });
    if (!find) {
      return NextResponse.json(
        { msg: "nip atau password salah!", status: 401 },
        { status: 401 }
      );
    }
    const comparePass = await bcrypt.compare(password, find.password);
    if (!comparePass) {
      return NextResponse.json(
        { msg: "nip atau password salah!", status: 401 },
        { status: 401 }
      );
    }
    await signIn(find);
    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { msg: "Unauthorize", status: 401 },
      { status: 401 }
    );
  }
  try {
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
    });
    if (!user) {
      await signOut();
      return NextResponse.json(
        { msg: "Unauthorize", status: 401 },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { data: user, status: 200, msg: "OK" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { msg: "Kamu belum login!", status: 401 },
        { status: 401 }
      );
    }
    await signOut();
    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};
