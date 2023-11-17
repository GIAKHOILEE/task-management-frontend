"use client";
import Image from "next/image";
import styles from "./page.module.css";
import withAuth from "@/component/auth/HigherOrderComponent";
import Link from "next/link";
function Home() {
  return (
    <div className={styles.home_container}>
      {/* <div>
        <img className={styles.img_home} src="/imgHome.png" alt="" />
      </div> */}
      <div className={styles.header_login}>
        <div className={styles.header_title}>CollaboraNet</div>
        <Link href="/login">
          <button className={styles.btn_login}>Đăng Nhập</button>
        </Link>
      </div>
      <Link href="/login">
        <button className={styles.btn_login_out}>Đăng Nhập</button>
      </Link>
    </div>
  );
}

export default Home;
