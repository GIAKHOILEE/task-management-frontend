"use client";
import React, { useState, useEffect } from "react";
import styles from "./MessageGpt.module.css";
import CircleAvatarComponent from "@/component/circleAvatarComponent/CircleAvatarComponent";
import { format } from "date-fns";

interface Message {
  messageId: number;
  userId: number;
  contentUser: string;
  contentGpt: string;
  createdAt: string;
}

export default function page() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [myChat, setMyChat] = useState("");
  const [messPending, setMessPending] = useState(false);
  const [errorMess, setErroMess] = useState("");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user ? user.userId : null;
  const userEmail = user ? user.userEmail : null;

  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd-MM-yyyy HH:mm:ss");
  const handleSendMessage = async (prompt: string) => {
    try {
      const response = await fetch("http://localhost:8080/bot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
        },
        body: JSON.stringify({ prompt, userId }),
      });
      const data = await response.text();
      console.log(data);

      if (!response.ok) {
        // throw new Error(`HTTP error! Status: ${response.status}`);
        setMessPending(false);
        setErroMess("Lỗi không phản hồi tin nhắn");
      }
      if (response.ok) {
        // setChatReponse(data);
        setMessPending(false);
        getAllMessage();
        // console.log("số 1" + data);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessPending(false);
      setErroMess("Lỗi không phản hồi tin nhắn");
    }
  };

  const getAllMessage = async () => {
    try {
      const response = await fetch("http://localhost:8080/bot/user/1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Message[] = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (response.ok) {
        setChatHistory(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getAllMessage();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.frame_chat}>
        <div className={styles.frame_chat_title}>
          <img src="/iconBot.png" alt="" className={styles.icon_title} /> Chat
          Bot AI
        </div>
        <div className={styles.frame_chat_form}>
          <div className={styles.form_mess}>
            {chatHistory.map((message) => (
              <div key={message.messageId} className={styles.form_mess_scroll}>
                <div className={styles.form_mess_user}>
                  <div className={styles.form_mess_user_content}>
                    <div className={styles.form_mess_user_content_time}>
                      {format(
                        new Date(message.createdAt),
                        "dd-MM-yyyy HH:mm:ss"
                      )}
                    </div>
                    <div className={styles.form_mess_user_content_text}>
                      {message.contentUser}
                    </div>
                  </div>
                  <div>
                    <CircleAvatarComponent email={userEmail} />
                  </div>
                </div>
                <div className={styles.form_mess_bot}>
                  <img
                    src="/iconBot.png"
                    className={styles.form_mess_bot_icon}
                  />
                  <div className={styles.form_mess_bot_content}>
                    <div className={styles.form_mess_bot_content_time}>
                      {format(
                        new Date(message.createdAt),
                        "dd-MM-yyyy HH:mm:ss"
                      )}
                    </div>
                    <div className={styles.form_mess_bot_content_text}>
                      {message.contentGpt}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {messPending && (
            <div>
              <div className={styles.form_mess_user}>
                <div className={styles.form_mess_user_content}>
                  <div className={styles.form_mess_user_content_time}>
                    {formattedDate}
                  </div>
                  <div className={styles.form_mess_user_content_text}>
                    {myChat}
                  </div>
                </div>
                <div>
                  <CircleAvatarComponent email={userEmail} />
                </div>
              </div>
              <div className={styles.form_mess_bot}>
                <img src="/iconBot.png" className={styles.form_mess_bot_icon} />
                <div className={styles.form_mess_bot_content}>
                  <div className={styles.form_mess_bot_content_text}>
                    <div className={styles.pendingMessageContainer}>
                      <div className={styles.pendingDot}></div>
                      <div className={styles.pendingDot}></div>
                      <div className={styles.pendingDot}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={styles.error_mess}>{errorMess}</div>
          <div className={styles.frame_chat_sendmess}>
            <input
              type="text"
              value={userInput}
              className={styles.frame_chat_sendmess_inp}
              onChange={(e) => {
                setUserInput(e.target.value);
              }}
            />
            <button
              className={styles.frame_chat_sendmess_btnsend}
              onClick={() => {
                handleSendMessage(userInput);
                setMyChat(userInput);
                setMessPending(true);
                setUserInput("");
                setErroMess("");
              }}
            >
              Gửi
              <img
                src="/iconSendMess.png"
                className={styles.frame_chat_sendmess_icon}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
