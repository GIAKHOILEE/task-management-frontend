import styles from "./HeaderComponent.module.css";
import CircleAvatarComponent from "../circleAvatarComponent/CircleAvatarComponent";
import { useState } from "react";
export default function HeaderComponent() {
  const [openNotifi, setOpenNotifi] = useState(false);

  const handleOpenNotifi = () => {
    setOpenNotifi(!openNotifi);
  };
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
                  Đã gửi một tin nhắn cho bạn{" "}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.header_infomation}>
        <CircleAvatarComponent />
        <span className={styles.header_infomation_name}>LeHaGiaKhoi</span>
        <img
          className={styles.header_infomation_icon}
          src="/iconArrowDown.png"
          alt="iconArrowDown"
        />
      </div>
    </div>
  );
}
