"use client";
import Link from "next/link";
import styles from "./login.module.css";
import Image from "next/image";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import MailOutlined from "@ant-design/icons/lib/icons/MailOutlined";

export default function login() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPage_left}>
        <Image
          src="/bg_login.png"
          layout="fill" 
          objectFit="cover" 
          alt="Picture of the author"
        />
      </div>
      <div className={styles.loginPage_right}>
        <div className={styles.loginPage_right_title}>
          <div className={styles.loginPage_right_title_Lg}>
            Sign in your account
          </div>
          <div className={styles.loginPage_right_title_sm}>
            Fill the details bellow to submit login account.
          </div>
        </div>
        <div className={styles.loginPage_right_content}>
          <div className={styles.titleInput}>Email</div>
          <div className={styles.relative_position}>
            <MailOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="text"
              placeholder="Your email"
            />
          </div>
          <div className={styles.titleInput}>Password</div>
          <div className={styles.relative_position}>
            <LockOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="password"
              placeholder="Your password"
            />
          </div>
        </div>
        <div className={styles.loginPage_right_bottom}>
          <Link href="/">
          <button className={styles.btnContiue}>Login</button>
          </Link>
          <span className={styles.txtHaveAcc}>Create your account</span>
          <Link className={styles.linkLogin} href="/register/step1">Register</Link>
        </div>
      </div>
    </div>
  );
}
