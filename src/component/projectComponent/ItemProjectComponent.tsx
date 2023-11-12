"use client";
import styles from "./ItemProjectComponent.module.css";
import CircleAvatarComponent from "../circleAvatarComponent/CircleAvatarComponent";
import { useState } from "react";
import Alert from "../alertComponent/AlertComponent";
interface ProjectItemProps {
  projectId: string;
  owner_project: string;
  project_name: string;
  project_description: string;
  level: number;
  status: string;
  start_date: string;
  end_date: string;
  fetchData: () => Promise<void>;
}

export default function ItemProjectComponent({
  projectId,
  owner_project,
  project_name,
  project_description,
  level,
  status,
  start_date,
  end_date,
  fetchData,
}: ProjectItemProps) {
  const levelClassMap: {
    [index: number]: string;
  } = {
    1: "item_project_level_easy",
    2: "item_project_level_normal",
    3: "item_project_level_hard",
    4: "item_project_level_complete",
  };
  const levelTextMap: {
    [index: number]: string;
  } = {
    1: "Dễ",
    2: "Thường",
    3: "Khó",
    4: "Hoàn thành",
  };

  const [openMenu, setOpenMenu] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [projectName, setProjectName] = useState(project_name);
  const [projectDescription, setProjectDescription] =
    useState(project_description);
  const [Level, setLevel] = useState<number>(level);
  const [Status, setStatus] = useState(status);
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);
  const [checkDay, setCheckDay] = useState("");

  const [error, setError] = useState("");
  //alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "warning" | "error" | ""
  >("");

  const user = localStorage.getItem("user");
  const emailUser = user ? JSON.parse(user).email : null;
  // alert(emailUser);

  //delete project
  async function deleteProject() {
    try {
      const response = await fetch(
        "http://localhost:8080/project/deleteProject",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            projectId: projectId.toString(),
          },
        }
      );
      if (response.ok) {
        // setAlertType("success");
        setAlertMessage("Xóa thành công");
        // setShowAlert(true);

        setOpenMenu(false);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  }
  //update peoejct
  async function updateProject() {
    if (
      projectName == "" ||
      projectDescription == "" ||
      endDate == "" ||
      startDate == ""
    ) {
      setError("Không được để trống các trường");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8080/project/updateProject",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            projectId: projectId.toString(),
          },
          body: JSON.stringify({
            projectName: projectName,
            projectDescription: projectDescription,
            level: Level,
            status: status,
            startDate: startDate,
            endDate: endDate,
          }),
        }
      );
      if (response.ok) {
        // setAlertType("success");
        // setAlertMessage("Cập nhật thành công");
        // setShowAlert(true);
        alert("cập nhật thành công");
        setOpenUpdate(false);
        setOpenMenu(false);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  }
  // kiểm tra ngày
  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedEndDate = new Date(e.target.value);
    const currentStartDate = new Date(startDate);

    if (selectedEndDate < currentStartDate) {
      setCheckDay("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }

    setEndDate(e.target.value);
  }
  return (
    <>
      <div className={styles.item_project}>
        {/* {showAlert && alertType && (
          <Alert type={alertType} message={alertMessage} />
        )} */}
        <img
          className={styles.icon}
          src="/iconMenuVerticalicon.png"
          alt=""
          onClick={(event) => {
            event.preventDefault();
            setOpenMenu(!openMenu);
            event.stopPropagation();
          }}
        />

        {openMenu && (
          <div
            className={styles.item_project_menu}
            onClick={(event) => {
              event.preventDefault();
            }}
          >
            <div
              className={styles.item_project_menu_update}
              // onClick={() => setOpenUpdate(true)}
              onClick={(e) => {
                if (emailUser === owner_project) {
                  setOpenUpdate(true);
                } else {
                  alert("bạn không phải người quản lý dự án này");
                  setOpenMenu(false);
                }
              }}
            >
              Chỉnh sửa dự án
            </div>
            <div
              className={styles.item_project_menu_delete}
              onClick={(e) => {
                if (emailUser === owner_project) {
                  deleteProject();
                } else {
                  alert("bạn không phải là người quản lý dự án này");
                  setOpenMenu(false);
                }
              }}
            >
              Xóa Dự án
            </div>
          </div>
        )}

        <div>{projectId}</div>
        <span className={styles[levelClassMap[level]]}>
          {levelTextMap[level] || "Dễ"}
        </span>
        {status == "done" && (
          <span className={styles.item_project_level_complete}>Hoàn thành</span>
        )}
        <div className={styles.item_project_name}>{project_name}</div>
        <div className={styles.item_project_description}>
          {project_description}
        </div>
        <div className={styles.item_project_date}>
          Ngày bắt đầu:
          <span style={{ fontWeight: 400 }}> {start_date}</span>
        </div>
        <div className={styles.item_project_date}>
          Ngày kết thúc:
          <span style={{ fontWeight: 400 }}> {end_date}</span>
        </div>
        <div className={styles.item_project_owner}>
          <span style={{ marginRight: 10 }}>Quản lý</span>

          <CircleAvatarComponent email={owner_project} />
        </div>
      </div>
      {openUpdate && (
        <div
          className={styles.projectmanager_crateProject_form}
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          <div className={styles.crateProject_form}>
            <div className={styles.crateProject_form_title}>
              Chỉnh sửa dự án
            </div>
            <div className={styles.crateProject_form_label}>Tên Dự Án</div>
            <input
              value={projectName}
              className={styles.crateProject_form_input}
              type="text"
              placeholder="Tên dự án của bạn"
              onChange={(e) => setProjectName(e.target.value)}
            />
            <div className={styles.crateProject_form_label}>Độ khó</div>
            <div className={styles.crateProject_form_selectDif}>
              <input
                id="easy"
                type="radio"
                name="difficulty"
                value={1}
                checked={Level === 1}
                onChange={(e) => setLevel(Number(e.target.value))}
              />
              <label
                htmlFor="easy"
                className={styles.update_project_level_easy}
              >
                Dễ
              </label>
              <input
                id="normal"
                type="radio"
                name="difficulty"
                value={2}
                checked={Level === 2}
                onChange={(e) => setLevel(Number(e.target.value))}
              />
              <label
                htmlFor="normal"
                className={styles.update_project_level_normal}
              >
                Thường
              </label>
              <input
                id="hard"
                type="radio"
                name="difficulty"
                value={3}
                checked={Level === 3}
                onChange={(e) => setLevel(Number(e.target.value))}
              />
              <label
                htmlFor="hard"
                className={styles.update_project_level_hard}
              >
                Khó
              </label>
            </div>
            <div className={styles.crateProject_form_label}>Ngày bắt đầu</div>
            <input
              className={styles.crateProject_form_input}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <div className={styles.crateProject_form_label}>Ngày kết thúc</div>
            <input
              className={styles.crateProject_form_input}
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />
            {checkDay && <div className={styles.error}>{checkDay}</div>}
            <div className={styles.crateProject_form_label}>Mô tả Dự Án</div>
            <textarea
              rows={3}
              className={styles.crateProject_form_input}
              style={{ height: "80px" }}
              placeholder="Mô tả dự án của bạn"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
            {error && <div className={styles.error}>{error}</div>}

            <hr />
            <div className={styles.crateProject_form_btn}>
              <button
                className={styles.crateProject_form_btnClose}
                onClick={() => {
                  setOpenUpdate(false);
                  setOpenMenu(false);
                }}
              >
                Đóng
              </button>
              <button
                className={styles.crateProject_form_btnCreate}
                onClick={updateProject}
              >
                Cập nhật dự án
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
