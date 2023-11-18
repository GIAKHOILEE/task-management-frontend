"use client";
import React, { useEffect, useState } from "react";
import styles from "./admin.module.css";
import MailOutlined from "@ant-design/icons/lib/icons/MailOutlined";
import CircleAvatarComponent from "@/component/circleAvatarComponent/CircleAvatarComponent";
import PhoneOutlined from "@ant-design/icons/lib/icons/PhoneOutlined";
import { UserType } from "@/typeDatabase/TypeDatabase";
import { v4 as uuidv4 } from "uuid";
import { imageDb } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import AlertComponent from "@/component/alertComponent/AlertComponent";

export default function page() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [user, setUser] = useState<UserType[]>([]);
  const [formChangeInfo, setFormChangeInfo] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType>();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUuid, setAvatarUuid] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessDeleteAlert, setShowSuccessDeleteAlert] = useState(false);
  const [showWanningDeleteAlert, setShowWanningDeleteAlert] = useState(false);
  async function getAllUser() {
    try {
      const response = await fetch("http://localhost:8080/user/findAllUser");
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getAllUser();
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
  const setInput = (user: UserType) => {
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setEmail(user.email);
    if (user && user.phone !== null && user.phone !== undefined) {
      setPhone(user.phone.toString());
    }
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          email: email,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setShowSuccessAlert(true);
        setFormChangeInfo(false);
      } else {
        console.error("Lỗi khi cập nhật:", response.statusText);
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  // delete
  const handleDeleteUser = async (user: UserType) => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/delete/${user.userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setShowSuccessDeleteAlert(true);
        // alert("Xóa thành công");
        setConfirmDelete(false);
      } else {
        setShowWanningDeleteAlert(true);
        // alert("Không thể xóa! Dự án đang được quản lý bởi nhân viên này.");
      }
    } catch (error) {
      console.error(error);
      setShowWanningDeleteAlert(true);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccessAlert(false);
      setShowErrorAlert(false);
      setShowSuccessDeleteAlert(false);
      setShowWanningDeleteAlert(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [
    showSuccessAlert,
    showErrorAlert,
    showSuccessDeleteAlert,
    showWanningDeleteAlert,
  ]);
  return (
    <div
      className={styles.adminpage}
      onClick={() => {
        setFormChangeInfo(false);
      }}
    >
      <div className={styles.alert_log}>
        {showSuccessAlert && (
          <AlertComponent
            severity="success"
            message="Cập nhật thông tin nhân viên thành công"
          />
        )}
        {showErrorAlert && (
          <AlertComponent
            severity="error"
            message="Có lỗi khi cập nhật thông tin"
          />
        )}
        {showSuccessDeleteAlert && (
          <AlertComponent
            severity="success"
            message="Xóa nhân viên thành công"
          />
        )}
        {showWanningDeleteAlert && (
          <AlertComponent
            severity="warning"
            message="Không thể xóa! Dự án đang được quản lý bởi nhân viên này"
          />
        )}
      </div>

      <div className={styles.adminpage_title}>Danh Sách Nhân Viên</div>
      <table className={styles.employee_table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã Số Nhân Viên</th>
            <th>Avatar</th>
            <th>Tên Nhân Viên</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Sửa</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {user.map((user, index) => (
            <tr key={index}>
              <td className={styles.column_sm}>{index}</td>
              <td className={styles.column_md}>0000{user.userId}</td>
              <td>
                <CircleAvatarComponent email={user.email} />
              </td>
              <td>
                {user.firstname} {user.lastname}
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>

              <td className={styles.column_sm}>
                <img
                  className={styles.icon}
                  src="/iconUpdateUser.png"
                  alt=""
                  onClick={(e) => {
                    e.stopPropagation();
                    setInput(user);
                    setSelectedUser(user);
                    setFormChangeInfo(true);
                  }}
                />
              </td>
              <td className={styles.column_sm}>
                <img
                  className={styles.icon}
                  src="/iconRemoveUser.png"
                  alt=""
                  onClick={(e) => {
                    e.stopPropagation;
                    setSelectedUser(user);
                    setConfirmDelete(true);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {formChangeInfo && (
        <div
          className={styles.changeInformation}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
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
            selectedUser &&
            selectedUser.email && (
              <CircleAvatarComponent
                className={styles.avatar}
                email={selectedUser.email}
              />
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
              <MailOutlined className={styles.icon_info} />
              <input
                className={styles.inputfill}
                type="text"
                placeholder="email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.titleInput}>Số điện thoại</div>
            <div className={styles.relative_position}>
              <PhoneOutlined className={styles.icon_info} />
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
        </div>
      )}
      {confirmDelete && (
        <div className={styles.confirmDelete}>
          <div className={styles.confirmDelete_form}>
            <div className={styles.confirmDelete_title}>Xác nhận xóa</div>
            <div className={styles.confirmDelete_context}>
              Xác nhận xóa tài khoản nhân viên này
            </div>
            <div className={styles.confirmDelete_btn}>
              <button
                className={styles.confirmDelete_btn_cancel}
                onClick={() => {
                  setConfirmDelete(false);
                }}
              >
                Đóng
              </button>
              <button
                className={styles.confirmDelete_btn_delete}
                onClick={() => {
                  if (selectedUser) {
                    handleDeleteUser(selectedUser);
                  }
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
