"use client";
import React, { useState, useEffect, useContext } from "react";
import styles from "./overview.module.css";
import { ProjectIDContext } from "@/context/ProjectIDContext";
import { TasksContext } from "@/context/TasksContext";
import { AssignmentContext } from "@/context/AssignmentContext";
import PieChartTaskStatus from "@/chart/taskChart/pieChartStatus/PieChartTaskStatus";
import PieChartTaskLevel from "@/chart/taskChart/pieChartLevel/PieChartTaskLevel";
import BarChartTaskStatus from "@/chart/taskChart/barChartStatus/BarChartTaskStatus";
import StackBarChartTaskStatus from "@/chart/taskChart/stackBarChartStatus/StackBarChartTaskStatus";
import LineChartTask from "@/chart/taskChart/lineChartTask/LineChartTask";
import { TaskType, AssigneeType } from "@/typeDatabase/TypeDatabase";

const Overview: React.FC = () => {
  const projectID = useContext(ProjectIDContext);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [assignment, setAssignment] = useState<AssigneeType[]>([]);

  //lấy all task theo project id
  const getAllTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/projects/${projectID}/tasks/get-by-idproject`
      );
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // lấy all assign theo project id
  const getAllAssignment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/projects/${projectID}/tasks/find-all-assign-by-projectid`
      );
      const data = await response.json();
      setAssignment(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllTask();
    getAllAssignment();
  }, [projectID]);

  console.log(assignment);

  return (
    <>
      <div className={styles.line_1_chart}>
        <TasksContext.Provider value={tasks}>
          <PieChartTaskStatus />
        </TasksContext.Provider>
        <TasksContext.Provider value={tasks}>
          <PieChartTaskLevel />
        </TasksContext.Provider>
      </div>
      <div className={styles.line_2_chart}>
        <TasksContext.Provider value={tasks}>
          <BarChartTaskStatus />
        </TasksContext.Provider>
        <AssignmentContext.Provider value={assignment}>
          <StackBarChartTaskStatus />
        </AssignmentContext.Provider>
      </div>
      <div>
        <TasksContext.Provider value={tasks}>
          <LineChartTask />
        </TasksContext.Provider>
      </div>
    </>
  );
};

export default Overview;
