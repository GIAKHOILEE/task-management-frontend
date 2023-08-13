"use client";
import Link from "next/link";
import styles from "./register.module.css";
import Image from "next/image";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import React, { useState, useRef } from "react";

export default function login() {
  const [code, setCode] = useState(Array(6).fill(""));
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
              username@gmail.com
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
        </div>
        <div className={styles.loginPage_right_bottom}>
          <Link href="/register/step2">
          <button className={styles.btnContiue}>Verify</button>
          </Link>
          <span className={styles.txtHaveAcc}>Didn’t Recieve code?</span>
          <Link className={styles.linkLogin} href="/">Resend Code</Link>
        </div>
      </div>
    </div>
  );
}
