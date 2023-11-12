"use client";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import styles from "./register_step1.module.css";
import Image from "next/image";
import Link from "next/link";
import MailOutlined from "@ant-design/icons/lib/icons/MailOutlined";
import PhoneOutlined from "@ant-design/icons/lib/icons/PhoneOutlined";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function login() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const isValidEmail = (email: any) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const handleContinue = async () => {
    // Xóa lỗi cũ
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    let isValid = true;

    if (!isValidEmail(email)) {
      setEmailError("Vui lòng nhập email hợp lệ!");
      isValid = false;
    }
    if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự!");
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu và mật khẩu xác nhận không khớp!");
      isValid = false;
    }

    // Kiểm tra email trong DB
    if (isValid) {
      try {
        const response = await fetch(
          "http://localhost:8080/register/check-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        if (!response.ok) {
          throw new Error("Network Error");
        }

        const resultText = await response.text();

        if (resultText === "Email already exists in the database.") {
          setEmailError("Email này đã tồn tại.");
          isValid = false;
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra email: ", error);
        setEmailError(
          "Có lỗi xảy ra khi kiểm tra email. Vui lòng thử lại sau."
        );
        isValid = false;
      }
    }

    if (isValid) {
      const userData = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      router.push("/admin/register/step2");
    }
  };

  return (
    <div className={styles.register}>
      <div className={styles.loginPage_right}>
        <div className={styles.loginPage_right_top}>
          <div className={styles.loginPage_right_top_step}>
            <div className={styles.textGray}>Bước 1 / 2</div>
            <div>Đăng ký</div>
          </div>
        </div>
        <div className={styles.loginPage_right_title}>
          <div className={styles.loginPage_right_title_Lg}>
            Đăng Ký Tài Khoản
          </div>
          <div className={styles.loginPage_right_title_sm}>
            Điền thông tin bên dưới để đăng ký tài khoản
          </div>
        </div>
        <div className={styles.loginPage_right_content}>
          <div className={styles.loginPage_right_content_name}>
            <div className={styles.loginPage_right_content_fullname}>
              <div className={styles.titleInput}>Họ</div>
              <input
                className={styles.inputName}
                type="text"
                placeholder="Họ của nhân viên"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className={styles.loginPage_right_content_fullname}>
              <div className={styles.titleInput}>Tên</div>
              <input
                className={styles.inputName}
                type="text"
                placeholder="Tên của nhân viên"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.titleInput}>Email</div>
          <div className={styles.relative_position}>
            <MailOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="text"
              placeholder="email của nhân viên"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <div className={styles.errorInput}>{emailError}</div>
            )}
          </div>
          {/* <div className={styles.titleInput}>Phone Number</div>
          <div className={styles.relative_position}>
            <PhoneOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="number"
              placeholder="Your phone number"
            />
          </div> */}
          <div className={styles.titleInput}>Mật khẩu</div>
          <div className={styles.relative_position}>
            <LockOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="password"
              placeholder="Mật khẩu của nhân viên"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <div className={styles.errorInput}>{passwordError}</div>
            )}
          </div>
          <div className={styles.titleInput}>Xác nhận mật khẩu</div>
          <div className={styles.relative_position}>
            <LockOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && (
              <div className={styles.errorInput}>{confirmPasswordError}</div>
            )}
          </div>
        </div>
        <div className={styles.loginPage_right_bottom}>
          <button className={styles.btnContiue} onClick={handleContinue}>
            Tiếp Tục
          </button>
          {/* <span className={styles.txtHaveAcc}>Đã có tài khoản</span>
          <Link className={styles.linkLogin} href="/login">
            Đăng Nhập
          </Link> */}
        </div>
      </div>
    </div>
  );
}
