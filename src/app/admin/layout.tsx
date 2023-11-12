"use client";
import HeaderComponent from "@/component/headerComponent/HeaderComponent";
import styles from "./adminLayout.module.css";
import withAuthAdmin from "@/component/auth/AdminAuth";
import Loading from "@/component/loadingComponent/loading";
import { Suspense, useState } from "react";
import CircleAvatarComponent from "@/component/circleAvatarComponent/CircleAvatarComponent";
import Link from "next/link";
function MainLayout({ children }: { children: React.ReactNode }) {
  const [changeProfile, setChangeProfile] = useState(false);
  const handleInfomation = () => {
    setChangeProfile(!changeProfile);
  };
  return (
    <div className={styles.main_layout}>
      <div className={styles.header}>
        <div className={styles.header_infomation} onClick={handleInfomation}>
          <CircleAvatarComponent email="admin" />
          <span className={styles.header_infomation_name}>Tài khoản admin</span>
          <img
            className={styles.header_infomation_icon}
            src="/iconArrowDown.png"
            alt="iconArrowDown"
          />
          {changeProfile && (
            <div className={styles.header_infomation_menu}>
              <Link href="/">
                <div
                  className={styles.header_infomation_menu_item}
                  onClick={() => localStorage.clear()}
                >
                  Đăng xuất
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className={styles.menu}>
        <div className={styles.menu_head}>CollaboraNet</div>
        <div className={styles.menu_content}>
          <Link href="/admin">
            <div className={styles.menu_content_item}>
              <img
                className={styles.menu_content_icon}
                src="/iconList.png"
                alt="iconList"
              />
              Danh sách nhân viên
            </div>
          </Link>
          <Link href="/admin/register/step1">
            <div className={styles.menu_content_item}>
              <img
                className={styles.menu_content_icon}
                src="/iconRegister.png"
                alt="iconRegister"
              />
              Tạo tài khoản
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.main_layout_content}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
export default withAuthAdmin(MainLayout);
