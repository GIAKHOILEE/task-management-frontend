import React, { useContext, useEffect, useState } from "react";
import styles from "./LineChartTask.module.css";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TaskType } from "@/typeDatabase/TypeDatabase";
import { TasksContext } from "@/context/TasksContext";
type TaskCountByMonth = {
  month: string; // key là "yyyy-mm"
  count: number;
};

function generateMonthList(start: Date, end: Date): string[] {
  let currentDate = start;
  const dates = [];
  while (currentDate <= end) {
    dates.push(
      `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`
    );
    if (currentDate.getMonth() === 11) {
      currentDate = new Date(currentDate.getFullYear() + 1, 0);
    } else {
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
    }
  }
  return dates;
}
function isTaskInMonth(task: TaskType, year: number, month: number): boolean {
  const taskStart = new Date(task.startDate);
  const taskEnd = new Date(task.endDate);
  const startOfTheMonth = new Date(year, month, 1);
  const endOfTheMonth = new Date(year, month + 1, 0);
  return taskStart <= endOfTheMonth && taskEnd >= startOfTheMonth;
}

export default function LineChartTask() {
  const taskData = useContext(TasksContext);
  const [chartData, setChartData] = useState<TaskCountByMonth[]>([]);

  useEffect(() => {
    const startDateStrings = taskData.map((task) => task.startDate);
    const endDateStrings = taskData.map((task) => task.endDate);
    const allDates = startDateStrings.concat(endDateStrings).sort();

    const firstDate = new Date(allDates[0]);
    const lastDate = new Date(allDates[allDates.length - 1]);

    const allMonths = generateMonthList(firstDate, lastDate);

    const counts: Record<string, number> = {};
    allMonths.forEach((month) => {
      const [year, monthNumber] = month.split("-").map(Number);
      counts[month] = taskData.filter((task) =>
        isTaskInMonth(task, year, monthNumber - 1)
      ).length;
    });

    const dataArr: TaskCountByMonth[] = allMonths.map((month) => {
      const [year, monthNumber] = month.split("-").map(Number);
      return {
        month: `${String(monthNumber).padStart(2, "0")}/${year}`,
        count: counts[month] || 0,
      };
    });

    setChartData(dataArr);
  }, [taskData]);
  console.log(taskData);
  return (
    <div className={styles.chart}>
      <div className={styles.chart_title}>
        Biểu đồ thống kê số lượng công việc theo tháng
      </div>
      <div className={styles.barchart}>
        <AreaChart
          width={1300}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5d8bf4" stopOpacity={1} />
              <stop offset="95%" stopColor="#5d8bf4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#5d8bf4"
            fill="url(#colorCount)"
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </div>
    </div>
  );
}
