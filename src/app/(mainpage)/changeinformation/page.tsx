"use client";
import { useEffect, useState } from "react";
import styles from "./changeInformation.module.css";
import MailOutlined from "@ant-design/icons/lib/icons/MailOutlined";
import CircleAvatarComponent from "@/component/circleAvatarComponent/CircleAvatarComponent";
import PhoneOutlined from "@ant-design/icons/lib/icons/PhoneOutlined";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import { imageDb } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { json } from "stream/consumers";

interface User {
  email?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  phone?: number;
}
export default function changeInformation() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [avatarUuid, setAvatarUuid] = useState<string | null>(null);

  const [user, setUser] = useState<User>({});
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [updateDone, setUpdateDone] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `${token}` } : {}),
    };

    fetch("http://localhost:8080/user/profile", {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kết nối thất bại");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setEmail(data.email);
        setPhone(data.phone);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const objectURL = URL.createObjectURL(e.target.files[0]);
      setSelectedImageUrl(objectURL);
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUploadToFirebase = async (): Promise<string | null> => {
    if (selectedImage) {
      const uniqueFileName = uuidv4();
      const storageRef = ref(imageDb, `avatar/${uniqueFileName}.png`);

      try {
        await uploadBytes(storageRef, selectedImage);
        return `avatar/${uniqueFileName}.png`;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    return null;
  };

  const handleUpdateProfile = async () => {
    const avatarPath = await handleUploadToFirebase();

    const payload = {
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      email: email,
      avatar: avatarPath || avatarUuid,
    };
    try {
      const response = await fetch("http://localhost:8080/user/update", {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          email: email,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        // alert("Update thành công:");
        localStorage.setItem("user", JSON.stringify(payload));
        setUpdateDone(true);
      } else {
        console.error("Lỗi khi cập nhật:", response.statusText);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };
  return (
    <div className={styles.changeInformation}>
      <div className={styles.changeInformation_title}>
        Thay Đổi Thông Tin Tài Khoản
      </div>
      {selectedImageUrl ? (
        <div>
          <img
            className={styles.avatar}
            src={selectedImageUrl}
            alt="Selected Avatar"
          />
        </div>
      ) : (
        user &&
        user.email && (
          <CircleAvatarComponent className={styles.avatar} email={user.email} />
        )
      )}
      <input
        type="file"
        id="fileInput"
        onChange={handleImageChange}
        accept=".png, .jpg, .jpeg"
        style={{ display: "none" }}
      />
      <label htmlFor="fileInput" className={styles.chooseImg}>
        Chọn ảnh
      </label>
      <div className={styles.changeInformation_content}>
        <div className={styles.changeInformation_content_name}>
          <div className={styles.changeInformation_content_fullname}>
            <div className={styles.titleInput}>Họ</div>
            <input
              className={styles.inputName}
              type="text"
              placeholder="Họ của bạn"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          <div className={styles.changeInformation_content_fullname}>
            <div className={styles.titleInput}>Tên</div>
            <input
              className={styles.inputName}
              type="text"
              placeholder="Tên của bạn"
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
            placeholder="email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly
          />
        </div>
        <div className={styles.titleInput}>Số điện thoại</div>
        <div className={styles.relative_position}>
          <PhoneOutlined className={styles.icon} />
          <input
            className={styles.inputfill}
            type="number"
            placeholder="số điện thoại của bạn"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <button onClick={handleUpdateProfile} className={styles.btnChange}>
        Thay đổi
      </button>

      {updateDone && (
        <div
          className={styles.updatedone}
          onClick={(e) => setUpdateDone(false)}
        >
          <div className={styles.updatedone_form}>
            <div className={styles.updatedone_title}>Cập nhật thành công</div>
            <img className={styles.updatedone_icon} src="/Ok.png" alt="" />
          </div>
        </div>
      )}
    </div>
  );
}
