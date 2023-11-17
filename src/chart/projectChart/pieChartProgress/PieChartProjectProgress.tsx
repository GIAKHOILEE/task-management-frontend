import React from "react";
import styles from "./PieChartProjectProgress.module.css";
import { TaskType, ProjectType } from "@/typeDatabase/TypeDatabase";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface DataProgress {
  planProgress: number;
  actualProgress: number;
}
export default function PieChartProjectProgress({
  planProgress,
  actualProgress,
}: DataProgress) {
  console.log(planProgress, actualProgress);
  if (isNaN(planProgress) || isNaN(actualProgress)) {
    planProgress = 0;
    actualProgress = 0;
  }
  const dataPlanProgress = [
    {
      name: "planProgress",
      value: planProgress,
      fill: "#99ff99",
    },
    {
      name: "fill",
      value: 100 - planProgress,
      fill: "#dcdcdc",
    },
  ];

  const dataActualProgress = [
    {
      name: "actualProgress",
      value: actualProgress,
      fill: "#ffbe85",
    },
    {
      name: "fill",
      value: 100 - actualProgress,
      fill: "#dcdcdc",
    },
  ];
  return (
    <div className={styles.chartContainer}>
      <PieChart width={250} height={250}>
        <Pie
          data={dataActualProgress}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={60}
          startAngle={90}
          endAngle={-270}
        />
        <Pie
          data={dataPlanProgress}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
        />
      </PieChart>
      <div className={styles.define_color}>
        <div className={styles.define_color_text}>Tiến độ kế hoach</div>
        <div className={styles.define_color_percent_plan}>{planProgress}%</div>
        <div className={styles.define_color_text}>Tiến độ thực tế</div>
        <div className={styles.define_color_percent_actual}>
          {actualProgress}%
        </div>
      </div>
    </div>
  );
}
