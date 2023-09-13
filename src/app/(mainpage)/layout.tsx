"use client";
import MenuConponent from "@/component/menuComponent/MenuConponent";
import HeaderComponent from "@/component/headerComponent/HeaderComponent";
import styles from "./mainpage.module.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.main_layout}>
      <MenuConponent />
      <div className={styles.main_layout_content}>
        <HeaderComponent />
        {children}
      </div>
    </div>
  );
}
