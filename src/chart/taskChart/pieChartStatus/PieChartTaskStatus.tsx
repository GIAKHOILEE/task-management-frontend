"use client";
import React, { useState, useEffect, useContext } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";
import styles from "./PieChartTaskStatus.module.css";
import { TasksContext } from "@/context/TasksContext";
import { TaskType } from "@/typeDatabase/TypeDatabase";
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

export default function PieChartTaskStatus() {
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

  const renderLabelContent = (props: any) => {
    const { x, y, value } = props;
    const percentage = ((value / taskData.length) * 100).toFixed(2) + "%";

    return (
      <text x={x} y={y} fill="#000" fontSize={12} textAnchor="middle">
        {percentage}
      </text>
    );
  };
  return (
    <div className={styles.chart}>
      <div className={styles.chart_title}>
        Biểu đồ phân bố trạng thái của các công việc
      </div>
      <div className={styles.piechart}>
        <PieChart width={450} height={400}>
          <Pie
            data={chartData}
            cx={200}
            cy={200}
            innerRadius={80}
            outerRadius={140}
            dataKey="value"
            label={renderLabelContent}
            labelLine={true}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        <div className={styles.cicrl}>
          <div className={styles.cicrl_todo}>Chưa thực hiện</div>
          <div className={styles.cicrl_doing}>Đang thực hiện</div>
          <div className={styles.cicrl_review}>Đánh giá</div>
          <div className={styles.cicrl_done}>Hoàn thành</div>
        </div>
      </div>
    </div>
  );
}
