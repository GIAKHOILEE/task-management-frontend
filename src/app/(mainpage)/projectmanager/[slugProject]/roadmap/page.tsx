"use client";
import styles from "./roadmap.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Rectangle,
} from "recharts";
import moment from "moment";
import React, { useState, useEffect, useContext } from "react";
import { ProjectIDContext } from "@/context/ProjectIDContext";

type TaskType = {
  idTask: number;
  taskName: string;
  level: number;
  status: string;
  startDate: Date;
  endDate: Date;
};

export default function roadmap() {
  const projectID = useContext(ProjectIDContext);
  const todayDayOfYear = moment().dayOfYear();
  const [dataTask, setDataTask] = useState<TaskType[]>([]);

  const getStatusColor = (status: TaskType["status"]) => {
    switch (status) {
      case "todo":
        return { fillColor: "#c1e7b0", borderColor: "#70c43e" };
      case "doing":
        return { fillColor: "#f6f7c8", borderColor: "#e7e345" };
      case "review":
        return { fillColor: "#fbcfe4", borderColor: "#eb5399" };
      case "done":
        return { fillColor: "#b2f7ef", borderColor: "#45e8d2" };
      default:
        return { fillColor: "#DDDDDD", borderColor: "#BBBBBB" };
    }
  };

  const ticksForMonths = Array.from({ length: 12 }, (_, i) =>
    moment().month(i).startOf("month").dayOfYear()
  );

  // api get all task theo id project
  const getAllTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/projects/${projectID}/tasks/get-by-idproject`
      );
      const data = await response.json();
      const processedData = data.map((task: any) => ({
        taskId: task.taskId,
        taskName: task.taskName,
        level: task.level,
        status: task.status,
        startDayOfYear: moment(task.startDate).dayOfYear(),
        endDayOfYear: moment(task.endDate).dayOfYear(),
        duration: moment(task.endDate).diff(moment(task.startDate), "days"),
      }));
      setDataTask(processedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };
  useEffect(() => {
    getAllTask();
  }, []);

  return (
    <>
      <div className={styles.define_color}>
        <div className={styles.define_color_todo}>Chưa thực hiện</div>
        <div className={styles.define_color_doing}>Đang thực hiện</div>
        <div className={styles.define_color_review}>Đánh giá</div>
        <div className={styles.define_color_done}>Hoàn thành</div>
      </div>
      <div className={styles.bar_chart}>
        <BarChart width={1500} height={450} data={dataTask} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 365]}
            ticks={ticksForMonths}
            // tickFormatter={(tickValue) =>
            //   moment().dayOfYear(tickValue).format("MMM")
            // }
            tickFormatter={(tickValue) =>
              "Tháng " + moment().dayOfYear(tickValue).format("M")
            }
            orientation="top"
          />
          <YAxis
            className={styles.bar_y}
            width={150}
            dataKey="taskName"
            type="category"
          />
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "endDayOfYear") {
                return [props.payload.duration, "thời gian"];
              }
              return value;
            }}
          />
          <Bar
            dataKey="endDayOfYear"
            shape={({ x, y, width, height, payload }) => {
              const oneMonth = width / 12 - 6;
              const dayWidth = width / 365;
              const barStartX =
                x + oneMonth + payload.startDayOfYear * dayWidth;
              const barWidth =
                (payload.endDayOfYear - payload.startDayOfYear + 1) * dayWidth;
              const { fillColor, borderColor } = getStatusColor(payload.status);
              console.log(width);
              return (
                <g>
                  <Rectangle
                    x={barStartX - 2}
                    y={y - 2}
                    width={barWidth + 4}
                    height={height + 4}
                    fill={borderColor}
                  />
                  <Rectangle
                    x={barStartX}
                    y={y}
                    width={barWidth}
                    height={height}
                    fill={fillColor}
                  />
                </g>
              );
            }}
          />
          <ReferenceLine
            x={moment().dayOfYear()}
            stroke="red"
            label="Hôm nay"
          />
        </BarChart>
      </div>
    </>
  );
}
