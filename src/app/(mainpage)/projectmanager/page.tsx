"use client";
import styles from "./projectmanager.module.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";
import React from "react";
import ItemProjectComponent from "@/component/projectComponent/ItemProjectComponent";
import Link from "next/link";
import { useEffect, useState } from "react";
import AlertComponent from "@/component/alertComponent/AlertComponent";
type Item = {
  itemId: string;
  projectId: string;
  owner: string;
  projectName: string;
  projectDescription: string;
  level: number;
  status: string;
  startDate: string;
  endDate: string;
};

type InitialData = {
  items: { [key: string]: Item };
  columns: {
    [key: string]: {
      id: string;
      title: string;
      itemIds: string[];
    };
  };
  columnOrder: string[];
};

export default function projectmanager() {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [level, setLevel] = useState<number>();
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [error, setError] = useState("");
  const [isUserProject, setIsUserProject] = useState(false);
  const [checkDay, setCheckDay] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [alertSuccessCrProject, setAlertShowSuccessCrProject] = useState(false);
  const [alertInfoNotUserProject, setAlertInfoNotUserProject] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAlertShowSuccessCrProject(false);
      setAlertInfoNotUserProject(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [alertSuccessCrProject, alertInfoNotUserProject]);

  // const [projects, setProjects] = useState<Item[]>([]);
  const [initialData, setInitialData] = useState<InitialData>({
    items: {},
    columns: {
      todo: { id: "todo", title: "To Do", itemIds: [] },
      doing: { id: "doing", title: "Doing", itemIds: [] },
      done: { id: "done", title: "Done", itemIds: [] },
    },
    columnOrder: ["todo", "doing", "done"],
  });

  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedEndDate = new Date(e.target.value);
    const currentStartDate = new Date(startDate);

    if (selectedEndDate < currentStartDate) {
      setCheckDay("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }

    setEndDate(e.target.value);
  }
  //Api lấy tất cả project
  async function fetchProjects() {
    try {
      const response = await fetch(
        "http://localhost:8080/project/getAllProject"
      );
      const data = await response.json();
      // console.log(data);
      const newItems: { [id: string]: Item } = {};
      const newItemIds: string[] = [];
      data.forEach((project: any, index: number) => {
        const itemId = `item-${index + 1}`;
        newItemIds.push(itemId);
        newItems[itemId] = {
          itemId: itemId,
          projectId: project.projectId,
          owner: project.owner.email,
          projectName: project.projectName,
          projectDescription: project.projectDescription,
          level: project.level,
          status: project.status,
          startDate: project.startDate.split("T")[0],
          endDate: project.endDate.split("T")[0],
        };
      });

      setInitialData((prevState) => ({
        ...prevState,
        items: newItems,
        columns: {
          ...prevState.columns,
          todo: {
            ...prevState.columns["todo"],
            itemIds: newItemIds,
          },
          doing: {
            ...prevState.columns["doing"],
            itemIds: newItemIds,
          },
          done: {
            ...prevState.columns["done"],
            itemIds: newItemIds,
          },
        },
      }));

      // setProjects(data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchProjects();
  }, []);

  //Api tạo project
  const handleSave = async () => {
    const userString = localStorage.getItem("user");
    const userObject = JSON.parse(userString || "{}");
    const userId = userObject.userId;

    if (
      projectName == "" ||
      projectDescription == "" ||
      endDate == "" ||
      startDate == ""
    ) {
      setError("Không được để trống các trường");
      return;
    }
    const projectData = {
      projectName: projectName,
      projectDescription: projectDescription,
      owner: userId,
      level: level,
      startDate: startDate,
      endDate: endDate,
    };
    try {
      const response = await fetch("http://localhost:8080/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const data = await response.json();
        setAlertShowSuccessCrProject(true);
        // alert("tạo project thành công");
        setOpenCreateForm(false);

        const memberData = {
          projectId: data.projectId,
          userId: data.owner.userId,
          role: "owner",
        };
        addMemberToProject(memberData);
        fetchProjects();
      }
      // const data = await response.json();
      // console.log("Dữ liệu nhận được:", data);
    } catch (error) {
      console.error(error);
    }
  };

  // kéo các item giữa các cột
  async function handleOnDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    const projectId = draggableId;

    if (!destination) {
      return;
    }
    await updateProject(projectId, destination.droppableId);

    fetchProjects();
  }

  //chỉnh sửa project
  async function updateProject(projectId: string, newStatus: string) {
    setIsLoading(true);

    console.log(projectId, newStatus);
    try {
      const response = await fetch(
        "http://localhost:8080/project/updateProject",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            projectId: projectId.toString(),
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
    } catch (error) {
      console.error("Error while updating project:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // thêm userowner vào UserProject
  const addMemberToProject = async (memberData: any) => {
    try {
      const response = await fetch("http://localhost:8080/project/add-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // lấy toàn bộ userProject của 1 project
  async function getProjectUsers(projectID: any) {
    const userObject = JSON.parse(localStorage.getItem("user") as string);
    const userId = userObject.userId;
    const userEmail = userObject.email;

    try {
      const response = await fetch(
        `http://localhost:8080/project/${projectID}/user-in-project`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      const isUserInProject = data.some((user: any) => user.email == userEmail);
      // alert(userId);
      if (isUserInProject) {
        setIsUserProject(true);
      } else if (!isUserInProject) {
        setIsUserProject(false);
        setAlertInfoNotUserProject(true);
        // alert("bạn không phải thành viên của dự án");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className={styles.projectmanager}>
      <div className={styles.alert_log}>
        {alertSuccessCrProject && (
          <AlertComponent severity="success" message="Tạo dự án thành công" />
        )}
        {alertInfoNotUserProject && (
          <AlertComponent
            severity="info"
            message="Bạn không phải là thành viên dự án"
          />
        )}
      </div>
      <div>
        <span className={styles.projectmanager_navigation}>
          Quản lý dự án {">"}{" "}
        </span>
        <span>Dự án</span>
      </div>
      <div className={styles.projectmanager_header}>
        <div className={styles.projectmanager_title}>Dự Án</div>
        <button
          className={styles.projectmanager_Btncreate}
          onClick={() => setOpenCreateForm(true)}
        >
          <img className={styles.icon} src="/iconPlus.png" alt="" />
          Tạo Dự Án
        </button>
      </div>
      {isLoading ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div className={styles.table}>
          <DragDropContext onDragEnd={(result) => handleOnDragEnd(result)}>
            {/* To Do Column */}
            <Droppable droppableId="todo">
              {(provided) => (
                <div
                  className={styles.table_column}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className={styles.table_column_title}>Dự Án</h2>
                  {initialData.columns["todo"].itemIds
                    .map((itemId) => initialData.items[itemId])
                    .filter((item) => item && item.status === "todo")
                    .map((item, index) => (
                      <Draggable
                        key={item.itemId}
                        draggableId={item.projectId.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={async (e) => {
                              await getProjectUsers(item.projectId);
                            }}
                          >
                            <Link href={`/projectmanager/${item.projectId}`}>
                              <div
                                onClick={(e) => {
                                  if (!isUserProject) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <ItemProjectComponent
                                  projectId={item.projectId}
                                  owner_project={item.owner}
                                  project_name={item.projectName}
                                  project_description={item.projectDescription}
                                  level={item.level}
                                  status={item.status}
                                  start_date={item.startDate}
                                  end_date={item.endDate}
                                  fetchData={fetchProjects}
                                />
                              </div>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Doing Column */}
            <Droppable droppableId="doing">
              {(provided) => (
                <div
                  className={styles.table_column}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className={styles.table_column_title_1}>
                    Đang Thực Hiện
                  </h2>
                  {initialData.columns["doing"].itemIds
                    .map((itemId) => initialData.items[itemId])
                    .filter((item) => item && item.status === "doing")
                    .map((item, index) => (
                      <Draggable
                        key={item.itemId}
                        draggableId={item.projectId.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={async (e) => {
                              await getProjectUsers(item.projectId);
                            }}
                          >
                            <Link href={`/projectmanager/${item.projectId}`}>
                              <div
                                onClick={(e) => {
                                  if (!isUserProject) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <ItemProjectComponent
                                  projectId={item.projectId}
                                  owner_project={item.owner}
                                  project_name={item.projectName}
                                  project_description={item.projectDescription}
                                  level={item.level}
                                  status={item.status}
                                  start_date={item.startDate}
                                  end_date={item.endDate}
                                  fetchData={fetchProjects}
                                />
                              </div>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Done Column */}
            <Droppable droppableId="done">
              {(provided) => (
                <div
                  className={styles.table_column}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className={styles.table_column_title_2}>Hoàn Thành</h2>
                  {initialData.columns["done"].itemIds
                    .map((itemId) => initialData.items[itemId])
                    .filter((item) => item && item.status === "done")
                    .map((item, index) => (
                      <Draggable
                        key={item.itemId}
                        draggableId={item.projectId.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={async (e) => {
                              await getProjectUsers(item.projectId);
                            }}
                          >
                            <Link href={`/projectmanager/${item.projectId}`}>
                              <div
                                onClick={(e) => {
                                  if (!isUserProject) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <ItemProjectComponent
                                  projectId={item.projectId}
                                  owner_project={item.owner}
                                  project_name={item.projectName}
                                  project_description={item.projectDescription}
                                  level={item.level}
                                  status={item.status}
                                  start_date={item.startDate}
                                  end_date={item.endDate}
                                  fetchData={fetchProjects}
                                />
                              </div>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {openCreateForm && (
        <div className={styles.projectmanager_crateProject_form}>
          <div className={styles.crateProject_form}>
            <div className={styles.crateProject_form_title}>Tạo Dự Án</div>
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
                onChange={(e) => setLevel(Number(e.target.value))}
              />
              <label htmlFor="easy" className={styles.item_project_level_easy}>
                Dễ
              </label>
              <input
                id="normal"
                type="radio"
                name="difficulty"
                value={2}
                onChange={(e) => setLevel(Number(e.target.value))}
              />
              <label
                htmlFor="normal"
                className={styles.item_project_level_normal}
              >
                Thường
              </label>
              <input
                id="hard"
                type="radio"
                name="difficulty"
                value={3}
                onChange={(e) => setLevel(Number(e.target.value))}
              />
              <label htmlFor="hard" className={styles.item_project_level_hard}>
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
                onClick={() => setOpenCreateForm(false)}
              >
                Đóng
              </button>
              <button
                className={styles.crateProject_form_btnCreate}
                onClick={handleSave}
              >
                Tạo Dự Án
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
