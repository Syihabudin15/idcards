"use client";

import { ILayout } from "@/components/Utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ILayout>{children}</ILayout>;
}
