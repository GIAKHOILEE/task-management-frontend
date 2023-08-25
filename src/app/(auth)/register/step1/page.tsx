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
      setEmailError("Please enter a valid email!");
      isValid = false;
    }
    if (password.length < 6) {
      setPasswordError("Passwords must be at least 6 characters!");
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(
        "Password and confirmation password do not match!"
      );
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
          setEmailError("This email already exists.");
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
      router.push("/register/step2");
    }
  };
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
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className={styles.loginPage_right_content_fullname}>
              <div className={styles.titleInput}>Last name</div>
              <input
                className={styles.inputName}
                type="text"
                placeholder="Your lastname"
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
              placeholder="Your email"
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
            {passwordError && (
              <div className={styles.errorInput}>{passwordError}</div>
            )}
          </div>
          <div className={styles.titleInput}>Confirm Password</div>
          <div className={styles.relative_position}>
            <LockOutlined className={styles.icon} />
            <input
              className={styles.inputfill}
              type="password"
              placeholder="Confirm your password"
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
            Continue
          </button>
          <span className={styles.txtHaveAcc}>Already have account?</span>
          <Link className={styles.linkLogin} href="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
