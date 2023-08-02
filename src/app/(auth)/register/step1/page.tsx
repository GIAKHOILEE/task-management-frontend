"use client";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import styles from "./register_step1.module.css";
import Image from "next/image";
import Link from "next/link";
import MailOutlined from "@ant-design/icons/lib/icons/MailOutlined";
import PhoneOutlined from "@ant-design/icons/lib/icons/PhoneOutlined";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";

export default function login() {
  return (
    <div className={styles.register}>
      <div className={styles.loginPage_left}>
        <Image
          src="/bg_login.png"
          layout="fill"
          objectFit="cover"
          alt="Picture of the author"
        />
      </div>
      <div className={styles.loginPage_right}>
        <div className={styles.loginPage_right_top}>
          <div className={styles.loginPage_right_top_back}>
            <Link href="/login">
              <LeftOutlined />
              <span className={styles.textGray}>Back</span>
            </Link>
          </div>
          <div className={styles.loginPage_right_top_step}>
            <div className={styles.textGray}>Step 1 of 2</div>
            <div>Signup</div>
          </div>
        </div>
        <div className={styles.loginPage_right_title}>
          <div className={styles.loginPage_right_title_Lg}>
            Register your account
          </div>
          <div className={styles.loginPage_right_title_sm}>
            Fill the details bellow to submit register account.
          </div>
        </div>
        <div className={styles.loginPage_right_content}>
          <div className={styles.loginPage_right_content_name}>
            <div className={styles.loginPage_right_content_fullname}>
              <div className={styles.titleInput}>First name</div>
              <input
                className={styles.inputName}
                type="text"
                placeholder="Your firstname"
              />
            </div>
            <div className={styles.loginPage_right_content_fullname}>
              <div className={styles.titleInput}>Last name</div>
              <input
                className={styles.inputName}
                type="text"
                placeholder="Your lastname"
              />
            </div>
          </div>
          <div className={styles.titleInput}>Email</div>
          <div className={styles.relative_position}>
            <MailOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="text"
              placeholder="Your email"
            />
          </div>
          <div className={styles.titleInput}>Phone Number</div>
          <div className={styles.relative_position}>
            <PhoneOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="number"
              placeholder="Your phone number"
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
          <button className={styles.btnContiue}>Continue</button>
          <span className={styles.txtHaveAcc}>Already have account?</span>
          <Link className={styles.linkLogin} href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
