import { useState, useContext, useEffect } from "react";
import styles from "./ItemTaskComponent.module.css";
import CircleAvatarComponent from "../circleAvatarComponent/CircleAvatarComponent";
import { ProjectIDContext } from "@/context/ProjectIDContext";
import { UserProjectInProjectContext } from "@/context/UserProjectInProjectContext";
import { IdProjectOwner } from "@/context/IdProjectOwner";
import { AssigneeType } from "@/typeDatabase/TypeDatabase";
import AlertComponent from "../alertComponent/AlertComponent";
import moment from "moment";

type TaskType = {
  id: string;
  idTask: number;
  projectId: number;
  assignee: string[];
  taskName: string;
  taskDescription: string;
  level: number;
  status: string;
  startDate: string;
  endDate: string;
};

type ItemTaskComponentProps = {
  provided: any;
  task: TaskType;
  fetchData: () => Promise<void>;
};

function ItemTaskComponent({
  provided,
  task,
  fetchData,
}: ItemTaskComponentProps) {
  const userProjectInProject = useContext(UserProjectInProjectContext);
  const IdProjectowner = useContext(IdProjectOwner);
  const projectID = useContext(ProjectIDContext);
  const userId = JSON.parse(localStorage.getItem("user") as string).userId;

  const [assign, setAssign] = useState<AssigneeType[]>([]);
  const [Level, setLevel] = useState<number>(task.level);
  const [taskName, setTaskName] = useState(task.taskName);
  const [taskDescription, setTaskDescription] = useState(task.taskDescription);
  const [startDate, setStartDate] = useState(task.startDate);
  const [endDate, setEndDate] = useState(task.endDate);
  const [taskStatus, setTaskStatus] = useState(task.status);

  const [error, setError] = useState("");
  const [checkDay, setCheckDay] = useState("");
  const [openMenuItem, setOpenMenuItem] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [refreshCount, setRefreshCount] = useState(1);
  const [openBoxmAddPeople, setOpenBoxAddPeople] = useState(false);
  const [openSelectViewPeople, setOpenSelectViewPeople] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [AlertSuccessDeleteTask, setAlertSuccessDeleteTask] = useState(false);
  const [AlertSuccessUpdateTask, setAlertSuccessUpdateTask] = useState(false);
  const [AlertSuccessDeleteUserTask, setAlertSuccessDeleteUserTask] =
    useState(false);
  const [AlertSuccessAddUserTask, setAlertSuccessAddUserTask] = useState(false);
  const [AlertInfoNotOwnerProject, setAlertInfoNotOwnerProject] =
    useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAlertSuccessDeleteTask(false);
      setAlertSuccessUpdateTask(false);
      setAlertSuccessDeleteUserTask(false);
      setAlertInfoNotOwnerProject(false);
      setAlertSuccessAddUserTask(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [
    AlertSuccessDeleteTask,
    AlertSuccessUpdateTask,
    AlertSuccessDeleteUserTask,
    AlertInfoNotOwnerProject,
    AlertSuccessAddUserTask,
  ]);

  const startProjectString = localStorage.getItem("startProject") as string;
  const endProjectString = localStorage.getItem("endProject") as string;
  // đổi chuỗi thành Date
  const startProjectFormat = moment(
    startProjectString,
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  ).format("MM-DD-YYYY");
  const endProjectFormat = moment(
    endProjectString,
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  ).format("MM-DD-YYYY");
  const startProject: Date = new Date(startProjectFormat);
  const endProject: Date = new Date(endProjectFormat);
  // kiểm tra end-day
  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedEndDate = new Date(e.target.value);
    const currentStartDate = new Date(startDate);

    if (selectedEndDate < currentStartDate) {
      setCheckDay("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }
    if (endProject && startProject) {
      if (selectedEndDate > endProject || selectedEndDate < startProject) {
        setCheckDay("Không được vượt ngoài thời gian dự án");
        return;
      }
    }
    setCheckDay("");
    setEndDate(e.target.value);
  }
  // Kiểm tra start day
  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectStartDate = new Date(e.target.value);
    console.log(e.target.value);
    if (selectStartDate > endProject || selectStartDate < startProject) {
      setCheckDay("Không được vượt ngoài thời gian dự án");
      return;
    }
    setCheckDay("");
    setStartDate(e.target.value);
  }
  //api cập nhật
  const updateTask = async () => {
    if (
      taskName === "" ||
      startDate === "" ||
      endDate === "" ||
      taskDescription === ""
    ) {
      setError("Không được để trống các trường");
      return;
    }
    const updatedData = {
      taskId: task.idTask,
      level: Level,
      taskName: taskName,
      taskDescription: taskDescription,
      startDate: startDate,
      endDate: endDate,
      status: taskStatus,
    };
    try {
      const response = await fetch(
        `http://localhost:8080/projects/${projectID}/tasks/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (response.ok) {
        setAlertSuccessUpdateTask(true);
        // alert("cập nhật thành công");
        setOpenUpdate(false);
      }
      const result = await response.json();
      console.log(result);
      setRefreshCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error updating the task:", error);
    }
  };
  //api delete task
  const deleteTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/projects/${projectID}/tasks/delete/${task.idTask}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (response.ok) {
        setAlertSuccessDeleteTask(true);
        // alert("xóa task thành công");
        setOpenUpdate(false);
      }
      setRefreshCount((prevCount) => prevCount + 1);

      // const result = await response.json();
      // console.log(result);
    } catch (error) {
      console.error("Error updating the task:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [refreshCount]);

  //get all assign by task id
  const getAllAssignByTaskId = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/projects/${projectID}/tasks/find-all-assign-by-taskid/${task.idTask}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response) {
        setAssign(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllAssignByTaskId();
  }, []);
  // add assign to task
  const addAssignToTask = async (TaskId: number, UserProject: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/projects/${projectID}/tasks/assign-task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskId: TaskId,
            userProjectId: UserProject,
          }),
        }
      );
      if (response) {
        getAllAssignByTaskId();
        setAlertSuccessAddUserTask(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // delete assign from ták
  const deleteAssignTask = async (assignId: number) => {
    const response = await fetch(
      `http://localhost:8080/projects/${projectID}/tasks/assign/delete/${assignId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      setAlertSuccessDeleteUserTask(true);
      // alert("Xóa người dùng thành công");
      getAllAssignByTaskId();
    }
  };
  const levelClassMap: {
    [index: number]: string;
  } = {
    1: "item_task_level_easy",
    2: "item_task_level_normal",
    3: "item_task_level_hard",
    4: "item_task_level_complete",
  };
  const levelTextMap: {
    [index: number]: string;
  } = {
    1: "Dễ",
    2: "Thường",
    3: "Khó",
    4: "Hoàn thành",
  };

  return (
    <>
      <div className={styles.alert_log}>
        {AlertSuccessAddUserTask && (
          <AlertComponent
            severity="success"
            message="Thêm người dùng vào công việc thành công"
          />
        )}
        {AlertSuccessDeleteTask && (
          <AlertComponent
            severity="success"
            message="Xóa công việc thành công"
          />
        )}
        {AlertSuccessUpdateTask && (
          <AlertComponent
            severity="success"
            message="Cập nhật công việc thành công"
          />
        )}
        {AlertInfoNotOwnerProject && (
          <AlertComponent
            severity="info"
            message="Bạn không phải là người quản lý"
          />
        )}
        {AlertSuccessDeleteUserTask && (
          <AlertComponent
            severity="success"
            message="Xóa người dùng khỏi công việc thành công"
          />
        )}
      </div>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={styles.item_task}
        onClick={(e) => {
          setOpenMenuItem(false);
        }}
      >
        {/* <div>{task.idTask}</div> */}
        <div>
          <img
            onClick={(e) => {
              setOpenMenuItem(!openMenuItem);
              e.stopPropagation();
            }}
            className={styles.icon_item}
            src="/iconMenuVerticalicon.png"
            alt=""
          />
          {openMenuItem && (
            <div className={styles.item_menu}>
              <div
                className={styles.item_menu_update}
                onClick={() => {
                  if (IdProjectowner == userId) {
                    setOpenUpdate(true);
                  } else {
                    setAlertInfoNotOwnerProject(true);
                    // alert("Bạn không phải là quản lý của dự án");
                  }
                }}
              >
                Chỉnh sửa công việc
              </div>
              <div
                className={styles.item_menu_delete}
                onClick={() => {
                  if (IdProjectowner == userId) {
                    deleteTask();
                  } else {
                    setAlertInfoNotOwnerProject(true);

                    // alert("Bạn không phải là quản lý của dự án");
                  }
                }}
              >
                Xóa công việc
              </div>
            </div>
          )}
        </div>
        <div className={styles.item_task_name}>{task.taskName}</div>
        <div className={styles.item_task_description}>
          {task.taskDescription}
        </div>
        <span className={styles[levelClassMap[task.level] || levelClassMap[1]]}>
          {levelTextMap[task.level] || "Dễ"}
        </span>
        {task.status == "done" && (
          <span className={styles.item_task_level_complete}>Hoàn thành</span>
        )}
        <div className={styles.item_task_date}>
          Ngày bắt đầu:
          <span style={{ fontWeight: 400 }}> {task.startDate}</span>
        </div>
        <div className={styles.item_task_date}>
          Ngày kết thúc:
          <span style={{ fontWeight: 400 }}> {task.endDate}</span>
        </div>
        <div className={styles.item_task_owner}>
          <span style={{ marginRight: 10 }}>Thực hiện</span>
          {assign.map((user) => (
            <CircleAvatarComponent email={user.userProject.user.email} />
          ))}
          <div
            onClick={() => {
              setOpenBoxAddPeople(true);
            }}
          >
            <img
              className={styles.add_assignee}
              src="/iconAddPeople.png"
              alt="add_assignee"
            />
          </div>
        </div>
      </div>
      {openUpdate && (
        <div
          className={styles.projectmanager_crateProject_form}
          onClick={(event) => {
            // event.preventDefault();
          }}
        >
          <div className={styles.crateProject_form}>
            <div className={styles.crateProject_form_title}>
              Chỉnh sửa công việc
            </div>
            <div className={styles.crateProject_form_label}>Tên Dự Án</div>
            <input
              value={taskName}
              className={styles.crateProject_form_input}
              type="text"
              placeholder="Tên dự án của bạn"
              onChange={(e) => setTaskName(e.target.value)}
            />
            <div className={styles.crateProject_form_label}>Độ khó</div>
            <div className={styles.crateProject_form_selectDif}>
              <input
                id="easy"
                type="radio"
                name="difficulty"
                // value={1}
                checked={Level === 1}
                onChange={() => setLevel(1)}
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
                // value={2}
                checked={Level === 2}
                onChange={() => setLevel(2)}
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
                // value={3}
                checked={Level === 3}
                onChange={() => setLevel(3)}
              />
              <label
                htmlFor="hard"
                className={styles.update_project_level_hard}
              >
                Khó
              </label>
            </div>
            <span className={styles.crateProject_form_label}>Trạng thái</span>
            <select
              className={styles.crateProject_form_select}
              id="status"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="todo">🟢 Chưa thực hiện</option>
              <option value="doing">🟡 Đang thực hiện</option>
              <option value="review">🟣 Đánh giá</option>
              <option value="done">🔵 Hoàn thành</option>
            </select>
            <div className={styles.crateProject_form_label}>Ngày bắt đầu</div>
            <input
              className={styles.crateProject_form_input}
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
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
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            {error && <div className={styles.error}>{error}</div>}

            <hr />
            <div className={styles.crateProject_form_btn}>
              <button
                className={styles.crateProject_form_btnClose}
                onClick={() => {
                  setOpenUpdate(false);
                  setOpenMenuItem(false);
                }}
              >
                Đóng
              </button>
              <button
                className={styles.crateProject_form_btnCreate}
                onClick={updateTask}
              >
                Cập nhật công việc
              </button>
            </div>
          </div>
        </div>
      )}
      {/* BOX add people  */}
      {openBoxmAddPeople && (
        <div
          className={styles.box_container}
          onClick={() => setOpenBoxAddPeople(false)}
        >
          <div
            className={styles.box_addread_people}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <img src="/iconGlass.png" alt="" className={styles.icon_glass} />
              <input
                className={styles.box_addread_people_search}
                type="search"
                placeholder="tìm thành viên theo email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.box_addread_people_select}>
              <span
                className={styles.box_addread_people_select_choose}
                onClick={() => setOpenSelectViewPeople(true)}
              >
                Thêm thành viên
              </span>
              <span
                className={styles.box_addread_people_select_choose}
                onClick={() => setOpenSelectViewPeople(false)}
              >
                Xem thành viên
              </span>
            </div>
            {openSelectViewPeople && (
              <div className={styles.box_addread_people_content}>
                {userProjectInProject &&
                  userProjectInProject
                    // Lọc ra những người không có trong assign
                    .filter(
                      (user) =>
                        !assign.some(
                          (a) =>
                            a.userProject.userProjectId === user.userProjectId
                        )
                    )
                    .filter((user) =>
                      user.user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <div className={styles.box_addread_people_content_item}>
                        <CircleAvatarComponent email={user.user.email} />
                        <div>
                          <div className={styles.box_content_item_name}>
                            {user.user.firstname} {user.user.lastname}
                          </div>
                          <span className={styles.box_content_item_email}>
                            {user.user.email}
                          </span>
                        </div>

                        <button
                          className={styles.box_content_item_btn}
                          onClick={() => {
                            if (userId == IdProjectowner) {
                              addAssignToTask(task.idTask, user.userProjectId);
                            } else {
                              setAlertInfoNotOwnerProject(true);

                              // alert("bạn không phải người quản lý dự án");
                            }
                            // setUserID(user.userId);
                          }}
                        >
                          Thêm
                        </button>
                      </div>
                    ))}
              </div>
            )}
            {!openSelectViewPeople && (
              <div className={styles.box_addread_people_content}>
                {assign &&
                  assign
                    .filter((user) =>
                      user.userProject.user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <div className={styles.box_addread_people_content_item}>
                        <CircleAvatarComponent
                          email={user.userProject.user.email}
                        />
                        <div>
                          <div className={styles.box_content_item_name}>
                            {user.userProject.user.firstname}{" "}
                            {user.userProject.user.lastname}
                          </div>
                          <span className={styles.box_content_item_email}>
                            {user.userProject.user.email}
                          </span>
                        </div>
                        {user.userProject.role == "member" && (
                          <button
                            className={styles.box_content_item_btn_delete}
                            onClick={() => {
                              if (userId == IdProjectowner) {
                                deleteAssignTask(user.assignmentId);
                              } else {
                                setAlertInfoNotOwnerProject(true);

                                // alert("bạn không phải người quản lý dự án");
                              }
                            }}
                          >
                            Xóa
                          </button>
                        )}
                        {user.userProject.role == "owner" && (
                          <span className={styles.box_content_item_btn_owner}>
                            Người quản lý
                          </span>
                        )}
                      </div>
                    ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ItemTaskComponent;
