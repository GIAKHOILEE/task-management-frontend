"use client";
import styles from "./taskboard.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useContext, useEffect, useState } from "react";
import ItemTaskComponent from "@/component/projectComponent/ItemTaskComponent";
import { ProjectIDContext } from "@/context/ProjectIDContext";
import { headers } from "next/dist/client/components/headers";

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

type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};

type InitialDataType = {
  tasks: { [key: string]: TaskType };
  columns: { [key: string]: ColumnType };
  columnOrder: string[];
};

const initialData: InitialDataType = {
  tasks: {},
  columns: {
    "column-1": {
      id: "column-1",
      title: "todo",
      taskIds: [],
    },
    "column-2": {
      id: "column-2",
      title: "doing",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "review",
      taskIds: [],
    },
    "column-4": {
      id: "column-4",
      title: "done",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4"],
};

export default function taskboard() {
  const projectID = useContext(ProjectIDContext);
  const [data, setData] = useState<InitialDataType>(initialData);
  // const [data, setData] = useState<InitialDataType | null>(null);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [taskName, setTasktName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [level, setLevel] = useState<number>();
  const [checkDay, setCheckDay] = useState("");
  const [refreshCount, setRefreshCount] = useState(1);
  // kiểm tra end-day
  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedEndDate = new Date(e.target.value);
    const currentStartDate = new Date(startDate);

    if (selectedEndDate < currentStartDate) {
      setCheckDay("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
      return;
    }

    setEndDate(e.target.value);
  }
  // css cho title
  const getTitleColor = (title: any) => {
    switch (title) {
      case "Chưa thực hiện":
        return styles.todoTitle;
      case "Đang thực hiện":
        return styles.doingTitle;
      case "Đánh giá":
        return styles.reviewTitle;
      case "Hoàn thành":
        return styles.doneTitle;
      default:
        return "";
    }
  };

  // đổi dữ liệu api phù hợp với  InitialData
  function transformAPIDataToInitialState(apiData: any[]): InitialDataType {
    const tasks: { [key: string]: TaskType } = {};
    apiData.forEach((task) => {
      tasks[`task-${task.taskId}`] = {
        id: `task-${task.taskId}`,
        idTask: task.taskId,
        projectId: task.project.projectId.toString(),
        assignee: task.assignee,
        taskName: task.taskName,
        taskDescription: task.taskDescription,
        level: task.level,
        status: task.status,
        startDate: task.startDate.split("T")[0],
        endDate: task.endDate.split("T")[0],
      };
    });

    return {
      tasks,
      columns: {
        "column-1": {
          id: "column-1",
          title: "Chưa thực hiện",
          taskIds: apiData
            .filter((task) => task.status === "todo")
            .map((task) => `task-${task.taskId}`),
        },
        "column-2": {
          id: "column-2",
          title: "Đang thực hiện",
          taskIds: apiData
            .filter((task) => task.status === "doing")
            .map((task) => `task-${task.taskId}`),
        },
        "column-3": {
          id: "column-3",
          title: "Đánh giá",
          taskIds: apiData
            .filter((task) => task.status === "review")
            .map((task) => `task-${task.taskId}`),
        },
        "column-4": {
          id: "column-4",
          title: "Hoàn thành",
          taskIds: apiData
            .filter((task) => task.status === "done")
            .map((task) => `task-${task.taskId}`),
        },
      },
      columnOrder: ["column-1", "column-2", "column-3", "column-4"],
    };
  }

  //API lấy all task theo id project
  const getAllTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/projects/${projectID}/tasks/get-by-idproject`
      );
      const data = await response.json();
      const transformedData = transformAPIDataToInitialState(data);
      setData(transformedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };
  useEffect(() => {
    getAllTask();
  }, [refreshCount]);

  //API tạo task
  const createTask = async (taskData: any) => {
    try {
      const response = await fetch(
        `http://localhost:8080/projects/${projectID}/tasks/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': 'Bearer ' + token (nếu bạn cần xác thực)
          },
          body: JSON.stringify(taskData), //
        }
      );
      if (response.ok) {
        alert("tạo task thành công");
        setOpenCreateForm(false);
        getAllTask();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const newTask = {
    project: {
      projectId: projectID,
    },
    taskName: taskName,
    taskDescription: taskDescription,
    level: level,
    status: "todo",
    startDate: startDate,
    endDate: endDate,
  };

  //api cập nhật
  const updateTask = async (updatedData: any) => {
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

      const result = await response.json();
      console.log(result);
      setRefreshCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error updating the task:", error);
    }
  };
  const convertTitleToStatus = (title: string) => {
    switch (title) {
      case "Chưa thực hiện":
        return "todo";
      case "Đang thực hiện":
        return "doing";
      case "Đánh giá":
        return "review";
      case "Hoàn thành":
        return "done";
      default:
        throw new Error(`Unknown title: ${title}`);
    }
  };

  //xử lý kéo thả
  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    //không có destination
    if (!destination) {
      return;
    }

    //vị trí ban đầu và cuối cùng giống nhau
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // kéo thả cùng cột
    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);

      return;
    }

    // Xử lý việc kéo thả giữa các cột khác nhau
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(endColumn.taskIds);
    endTaskIds.splice(destination.index, 0, draggableId);
    const newEndColumn = {
      ...endColumn,
      taskIds: endTaskIds,
    };

    // update khi kéo vào db
    const taskDragged = data.tasks[draggableId];
    const updatedData = {
      taskId: taskDragged.idTask,
      status: convertTitleToStatus(newEndColumn.title),
    };
    updateTask(updatedData);

    // Gọi hàm cập nhật
    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStartColumn.id]: newStartColumn,
        [newEndColumn.id]: newEndColumn,
      },
    };
    setData(newData);
  };
  return (
    <>
      <button
        className={styles.btn_create_task}
        onClick={() => setOpenCreateForm(true)}
      >
        <img
          src="/iconPlus.png"
          alt=""
          className={styles.btn_create_task_icon}
        />
        Tạo Công Việc
      </button>
      <div className={styles.table_container}>
        <DragDropContext onDragEnd={onDragEnd}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            // console.log(column, tasks);
            return (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.table_column}
                  >
                    <h3
                      className={`${styles.table_title} ${getTitleColor(
                        column.title
                      )}`}
                    >
                      {column.title}
                    </h3>
                    {tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <ItemTaskComponent
                            provided={provided}
                            task={task}
                            // statusProp={status}
                            fetchData={getAllTask}

                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>

      {openCreateForm && (
        <div className={styles.projectmanager_crateProject_form}>
          <div className={styles.crateProject_form}>
            <div className={styles.crateProject_form_title}>Tạo Công Việc</div>
            <div className={styles.crateProject_form_label}>Tên công việc</div>
            <input
              value={taskName}
              className={styles.crateProject_form_input}
              type="text"
              placeholder="Tên công việc của bạn"
              onChange={(e) => setTasktName(e.target.value)}
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
            <div className={styles.crateProject_form_label}>
              Mô tả công việc
            </div>
            <textarea
              rows={3}
              className={styles.crateProject_form_input}
              style={{ height: "80px" }}
              placeholder="Mô tả dự án của bạn"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
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
                onClick={() => createTask(newTask)}
              >
                Tạo Dự Án
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
