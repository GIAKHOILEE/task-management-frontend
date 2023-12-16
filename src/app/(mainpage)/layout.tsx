"use client";
import MenuConponent from "@/component/menuComponent/MenuConponent";
import HeaderComponent from "@/component/headerComponent/HeaderComponent";
import styles from "./mainpage.module.css";
import withAuth from "@/component/auth/HigherOrderComponent";
import Loading from "@/component/loadingComponent/loading";
import { Suspense } from "react";
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.main_layout}>
      <div className={styles.menu_placeholder}></div>
      <MenuConponent />
      <div className={styles.main_layout_content}>
        <HeaderComponent />
        {/* {children} */}
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
export default withAuth(MainLayout);
