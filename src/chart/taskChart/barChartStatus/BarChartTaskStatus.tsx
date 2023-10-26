import React, { useContext, useEffect, useState } from "react";
import styles from "./BarChartTaskStatus.module.css";
import { TaskType } from "@/typeDatabase/TypeDatabase";
import { TasksContext } from "@/context/TasksContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

type TaskStatusCounts = {
  todo: number;
  doing: number;
  review: number;
  done: number;
};
type ChartDataItem = {
  name: keyof TaskStatusCounts;
  value: number;
};

const COLORS = ["#b3ff99", "#ffdd99", "#ffb3ff", "#b3ccff"];

export default function BarChartTaskStatus() {
  const taskData = useContext(TasksContext);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    const statusCounts: Record<string, number> = {
      todo: 0,
      doing: 0,
      review: 0,
      done: 0,
    };

    taskData.forEach((task: TaskType) => {
      if (statusCounts[task.status] !== undefined) {
        statusCounts[task.status]++;
      }
    });

    const newData: ChartDataItem[] = Object.entries(statusCounts).map(
      ([status, count]) => ({
        name: status as keyof TaskStatusCounts,
        value: count as number,
      })
    );
    setChartData(newData);
  }, [taskData]);

  return (
    <div className={styles.chart}>
      <div className={styles.chart_title}>
        Biểu đồ số lượng công việc ở mỗi trạng thái
      </div>
      <div className={styles.barchart}>
        <BarChart
          width={450}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </div>
      <div className={styles.define_color}>
        <div className={styles.define_color_todo}>Chưa thực hiện</div>
        <div className={styles.define_color_doing}>Đang thực hiện</div>
        <div className={styles.define_color_review}>Đánh giá</div>
        <div className={styles.define_color_done}>Hoàn thành</div>
      </div>
    </div>
  );
}
