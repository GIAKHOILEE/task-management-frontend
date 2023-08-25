"use client";
import Link from "next/link";
import styles from "./register.module.css";
import Image from "next/image";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function login() {
  const [code, setCode] = useState(Array(6).fill(""));
  const [email, setemail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getEmailFromLocalStorage = () => {
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        const userData = JSON.parse(storedData);
        return userData.email;
      }
      return null;
    };
    const storedEmail = getEmailFromLocalStorage();
    setemail(storedEmail);
  }, []);

  useEffect(() => {
    const sendEmailVerification = async () => {
      try {
        const response = await fetch("http://localhost:8080/sendmail/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API:", error);
      }
    };

    if (email) {
      sendEmailVerification();
    }
  }, [email]);

  const handResetSendcode = async () => {
    try {
      const response = await fetch("http://localhost:8080/sendmail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API:", error);
    }
  };

  const handleVerify = async () => {
    const integerCode = parseInt(code.join(""), 10);
    try {
      const response = await fetch(
        "http://localhost:8080/sendmail/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            verificationCode: integerCode,
          }),
        }
      );
      const responseText = await response.text();

      if (responseText === "Verification successful!") {
        const storedData = localStorage.getItem("userData");
        if (storedData) {
          const userData = JSON.parse(storedData);
          const registerResponse = await fetch(
            "http://localhost:8080/register/done",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
          if (registerResponse.ok) {
            console.log("Đăng ký thành công");
            localStorage.removeItem("userData");
            router.push("/register/registerdone");
          } else {
            console.error(
              "Lỗi từ server khi đăng ký:",
              registerResponse.status
            );
          }
        }
      } else if (responseText === "Incorrect verification code.") {
        setErrorMsg("Mã xác thực không chính xác");
        setCode(Array(6).fill(""));
      } else {
        console.error("Phản hồi không mong đợi từ server:", responseText);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API:", error);
    }
  };
  const inputs = Array.from({ length: 6 }).map(() =>
    useRef<HTMLInputElement>(null)
  );

  const handleInput = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (index < inputs.length - 1 && value !== "") {
      inputs[index + 1].current?.focus();
    }
  };
  // console.log(code)
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
            <Link href="/register/step1">
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
          <div className={styles.loginPage_right_title_Lg}>Check your Mail</div>
          <div className={styles.loginPage_right_title_sm}>
            We,ve sent a 6-digit confirmation code to{" "}
            <span className={styles.loginPage_right_title_sm_mail}>
              {email}
            </span>
            . Make sure you enter correct code.
          </div>
        </div>
        <div className={styles.loginPage_right_content}>
          <div className={styles.loginPage_right_content_codebox}>
            {inputs.map((inputRef, index) => (
              <input
                className={styles.input_code}
                key={index}
                type="number"
                ref={inputRef}
                maxLength={1}
                min={0}
                max={9}
                value={code[index]}
                onChange={(event) => handleInput(event.target.value, index)}
              />
            ))}
          </div>
          {errorMsg && <div className={styles.errorInput}>{errorMsg}</div>}
        </div>
        <div className={styles.loginPage_right_bottom}>
          <button className={styles.btnContiue} onClick={handleVerify}>
            Verify
          </button>
          <span className={styles.txtHaveAcc}>Didn’t Recieve code?</span>
          <span className={styles.linkLogin} onClick={handResetSendcode}>
            Resend Code
          </span>
        </div>
      </div>
    </div>
  );
}
