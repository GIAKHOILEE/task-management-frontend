"use client";
import MenuConponent from "@/component/menuComponent/MenuConponent";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MenuConponent />
      {children}
    </div>
  );
}
