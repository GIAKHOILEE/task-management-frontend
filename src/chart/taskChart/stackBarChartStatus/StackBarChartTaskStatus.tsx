import React, { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import styles from "./StackBarChartTaskStatus.module.css";
import { AssignmentContext } from "@/context/AssignmentContext";
import { AssigneeType } from "@/typeDatabase/TypeDatabase";

type ChartDataItem = {
  email: string;
  fullName: string;
  todo: number;
  doing: number;
  review: number;
  done: number;
};
export default function StackBarChartTaskStatus() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const assignmentData = useContext(AssignmentContext);

  useEffect(() => {
    const statusCountsByUser: Record<string, ChartDataItem> = {};

    assignmentData.forEach((assignment: AssigneeType) => {
      const userEmail = assignment.userProject.user.email;
      const userFullName = `${assignment.userProject.user.firstname} ${assignment.userProject.user.lastname}`; // <-- Full name

      if (!statusCountsByUser[userEmail]) {
        statusCountsByUser[userEmail] = {
          email: userEmail,
          fullName: userFullName,
          todo: 0,
          doing: 0,
          review: 0,
          done: 0,
        };
      }
      (statusCountsByUser[userEmail] as any)[assignment.task.status]++;
    });

    setChartData(Object.values(statusCountsByUser));
  }, [assignmentData]);
  return (
    <div className={styles.chart}>
      <div className={styles.chart_title}>
        Biểu đồ số lượng công việc của mỗi thành viên
      </div>
      <div className={styles.barchart}>
        <BarChart
          layout="vertical"
          width={800}
          height={350}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis dataKey="fullName" type="category" />
          <XAxis type="number" />
          <Tooltip />
          <Bar dataKey="todo" stackId="a" fill="#b3ff99" />
          <Bar dataKey="doing" stackId="a" fill="#ffdd99" />
          <Bar dataKey="review" stackId="a" fill="#ffb3ff" />
          <Bar dataKey="done" stackId="a" fill="#b3ccff" />
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
