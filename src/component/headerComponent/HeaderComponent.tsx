"use client";
import styles from "./HeaderComponent.module.css";
import CircleAvatarComponent from "@/component/circleAvatarComponent/CircleAvatarComponent";
import { useEffect, useState } from "react";
import Link from "next/link";

import { deCodeJwt } from "@/jwt/decodeJwt";

interface User {
  email?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
}

export default function HeaderComponent() {
  const [openNotifi, setOpenNotifi] = useState(false);
  const [changeProfile, setChangeProfile] = useState(false);

  const [user, setUser] = useState<User>({});

  const handleInfomation = () => {
    setChangeProfile(!changeProfile);
  };
  const handleOpenNotifi = () => {
    setOpenNotifi(!openNotifi);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `${token}` } : {}),
    };

    fetch("http://localhost:8080/user/profile", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kết nối thất bại");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.header_notification}>
        <img
          className={styles.header_notification_icon}
          src="/iconbell.png"
          alt="bell"
          onClick={handleOpenNotifi}
        />
        {openNotifi && (
          <div className={styles.header_notification_container}>
            <div className={styles.header_notification_container_item}>
              <CircleAvatarComponent />
              <div>
                <div className={styles.header_notification_container_item_name}>
                  Le Ha Gia Khoi
                </div>
                <div className={styles.header_notification_container_item_noti}>
                  Đã gửi một tin nhắn cho bạn
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.header_infomation} onClick={handleInfomation}>
        {user && user.email && <CircleAvatarComponent email={user.email} />}
        <span className={styles.header_infomation_name}>
          {user.firstname + " "}
          {user.lastname}
        </span>
        <img
          className={styles.header_infomation_icon}
          src="/iconArrowDown.png"
          alt="iconArrowDown"
        />
        {changeProfile && (
          <div className={styles.header_infomation_menu}>
            <Link href="/changeinformation">
              <div className={styles.header_infomation_menu_item}>
                Thông tin cá nhân
              </div>
            </Link>
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
  );
}
