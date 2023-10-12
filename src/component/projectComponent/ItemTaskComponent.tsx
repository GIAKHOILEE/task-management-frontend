import { useState } from "react";
import styles from "./ItemTaskComponent.module.css";
import CircleAvatarComponent from "../circleAvatarComponent/CircleAvatarComponent";
type TaskType = {
  id: string;
  idTask: number;
  projectId: number;
  assignee: string[];
  taskName: string;
  taskDescription: string;
  level: number;
  status: string;
  startDate: Date;
  endDate: Date;
};
type ItemTaskComponentProps = {
  provided: any;
  task: TaskType;
  // statusProp: string;
};

function ItemTaskComponent({
  provided,
  task,
}: // statusProp,
ItemTaskComponentProps) {
  const [Level, setLevel] = useState<number>(task.level);

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
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={styles.item_task}
    >
      <div>{task.idTask}</div>
      <div className={styles.item_task_name}>{task.taskName}</div>
      <div className={styles.item_task_description}>{task.taskDescription}</div>
      <span className={styles[levelClassMap[task.level] || levelClassMap[1]]}>
        {levelTextMap[task.level] || "Dễ"}
      </span>
      {task.status == "done" && (
        <span className={styles.item_task_level_complete}>Hoàn thành</span>
      )}
      <div className={styles.item_task_date}>
        Ngày bắt đầu:
        <span style={{ fontWeight: 400 }}>
          {task.startDate.toDateString()}
          {/* 11 - 10 -2001 */}
        </span>
      </div>
      <div className={styles.item_task_date}>
        Ngày kết thúc:
        <span style={{ fontWeight: 400 }}>
          {task.endDate.toDateString()}
          {/* 20 - 10 - 2001 */}
        </span>
      </div>
      <div className={styles.item_task_owner}>
        <span style={{ marginRight: 10 }}>Thực hiện</span>
        <CircleAvatarComponent email={task.assignee} />
      </div>
      {/* {task.content} */}
    </div>
  );
}

export default ItemTaskComponent;
