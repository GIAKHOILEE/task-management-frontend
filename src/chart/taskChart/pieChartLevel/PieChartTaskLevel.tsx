"use client";
import React, { useState, useEffect, useContext } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";
import styles from "./PieChartTaskLevel.module.css";
import { TasksContext } from "@/context/TasksContext";
import { TaskType } from "@/typeDatabase/TypeDatabase";

type TaskLevelCounts = {
  easy: number;
  normal: number;
  hard: number;
};
type ChartDataItem = {
  name: keyof TaskLevelCounts;
  value: number;
};

const COLORS = ["#b3ff99", "#ffffb3 ", "#ffb3b3"];

export default function PieChartTaskLevel() {
  const taskData = useContext(TasksContext);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    const LevelCounts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
    };

    taskData.forEach((task: TaskType) => {
      if (LevelCounts[task.level] !== undefined) {
        LevelCounts[task.level]++;
      }
    });

    const newData: ChartDataItem[] = Object.entries(LevelCounts).map(
      ([status, count]) => ({
        name: status as keyof TaskLevelCounts,
        value: count as number,
      })
    );
    setChartData(newData);
  }, [taskData]);
  // console.log(taskData);

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
        Biểu đồ số lượng công việc theo mức độ
      </div>
      <div className={styles.piechart}>
        <PieChart width={440} height={400}>
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
          <div className={styles.cicrl_todo}>Dễ</div>
          <div className={styles.cicrl_doing}>Trung bình</div>
          <div className={styles.cicrl_review}>Khó</div>
        </div>
      </div>
    </div>
  );
}
