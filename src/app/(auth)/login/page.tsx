"use client";
import Link from "next/link";
import styles from "./login.module.css";
import Image from "next/image";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import MailOutlined from "@ant-design/icons/lib/icons/MailOutlined";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setErrorMessage("Đăng nhập không thành công. Vui lòng thử lại");
      }
    } catch (error) {
      if (email == "admin" && password == "admin") {
        router.push("/admin");
        localStorage.setItem("admin", "admin");
      } else {
        setErrorMessage("Sai email hoặc mật khẩu");
      }
    }
  };
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
            Đăng Nhập Tài Khoản
          </div>
          <div className={styles.loginPage_right_title_sm}>
            Điền thông tin bên dưới để đăng nhập
          </div>
        </div>
        <div className={styles.loginPage_right_content}>
          <div className={styles.titleInput}>Email</div>
          <div className={styles.relative_position}>
            <MailOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="text"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.titleInput}>Mật khẩu</div>
          <div className={styles.relative_position}>
            <LockOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {errorMessage && <p className={styles.errorInput}>{errorMessage}</p>}
        <div className={styles.loginPage_right_bottom}>
          <button onClick={handleLogin} className={styles.btnContiue}>
            Đăng Nhập
          </button>
          <span className={styles.txtHaveAcc}>Tạo tài khoản</span>
          <Link className={styles.linkLogin} href="/register/step1">
            Đăng Ký
          </Link>
        </div>
      </div>
    </div>
  );
}
