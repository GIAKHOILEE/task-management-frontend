"use client";
import { useState } from "react";
import styles from "./menuComponent.module.css";
import Image from "next/image";
import Link from "next/link";

export default function MenuConponent() {
  const [isMenuMessVisible, setMenuMessVisibility] = useState(false);
  const [icon, setIcon] = useState("/iconArrowback.png");

  const handleMenuMess = () => {
    setMenuMessVisibility(!isMenuMessVisible);
    iconClick();
  };
  const iconClick = () => {
    if (icon === "/iconArrowback.png") {
      setIcon("/iconArrowDown.png");
    } else {
      setIcon("/iconArrowback.png");
    }
  };

  return (
    <div className={styles.menu}>
      <div className={styles.menu_head}>CollaboraNet</div>
      <div className={styles.menu_content}>
        <Link href="/dashboard">
          <div className={styles.menu_content_item}>
            <img
              className={styles.menu_content_icon}
              src="/iconDashboard.png"
              alt="iconDashboard"
            />
            Bảng Điều Khiển
          </div>
        </Link>
        <Link href="/projectmanager">
          <div className={styles.menu_content_item}>
            <img
              className={styles.menu_content_icon}
              src="/iconProject.png"
              alt="iconProject"
            />
            Quản Lý Dự Án
          </div>
        </Link>
        <div className={styles.menu_content_item} onClick={handleMenuMess}>
          <img
            className={styles.menu_content_icon}
            src="/iconMessage.png"
            alt="iconProject"
          />
          Tin Nhắn
          <img
            className={styles.menu_content_icon_arrow}
            src={icon}
            alt="iconSetting"
          />
        </div>
        {isMenuMessVisible && (
          <div className={styles.menu_messChil}>
            <Link href="/teammessage">
              <div className={styles.menu_messChil_item}>
                <img
                  className={styles.menu_messChil_icon}
                  src="/iconTeamMess.png"
                  alt="iconTeamMess"
                />
                Tin Nhắn Nhóm
              </div>
            </Link>
            <Link href="personalmessage">
              <div className={styles.menu_messChil_item}>
                <img
                  className={styles.menu_messChil_icon}
                  src="/iconPersonalMess.png"
                  alt="iconPersonalMess"
                />
                Tin Nhắn
              </div>
            </Link>
          </div>
        )}
        <Link href="calendar">
          <div className={styles.menu_content_item}>
            <img
              className={styles.menu_content_icon}
              src="/iconCalendar.png"
              alt="iconCalendar"
            />
            Lịch Họp
          </div>
        </Link>
        <div className={styles.menu_content_item}>
          <img
            className={styles.menu_content_icon}
            src="/iconSetting.png"
            alt="iconSetting"
          />
          Cài Đặt
          <img
            className={styles.menu_content_icon_arrow}
            src="/iconArrowback.png"
            alt="iconSetting"
          />
        </div>
      </div>
    </div>
  );
}
