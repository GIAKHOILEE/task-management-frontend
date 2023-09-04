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
        router.push("/");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Wrong email or password.");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.titleInput}>Password</div>
          <div className={styles.relative_position}>
            <LockOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {errorMessage && <p className={styles.errorInput}>{errorMessage}</p>}
        <div className={styles.loginPage_right_bottom}>
          <button onClick={handleLogin} className={styles.btnContiue}>
            Login
          </button>
          <span className={styles.txtHaveAcc}>Create your account</span>
          <Link className={styles.linkLogin} href="/register/step1">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
