import styles from "./registerdone.module.css";
import Image from "next/image";
import Link from "next/link";

export default function registerdone() {
  return (
    <div className={styles.registerdoneContainer}>
      <div className={styles.registerdoneContainer_form}>
        <div className={styles.form_title}>Đăng Ký Thành Công</div>
        <div className={styles.form_icon}>
          <Image src="/Ok.png" width={50} height={50} alt="Picture" />
        </div>
        <Link href="/login">
          <button className={styles.form_button}>Đăng Nhập</button>
        </Link>
      </div>
    </div>
  );
}
