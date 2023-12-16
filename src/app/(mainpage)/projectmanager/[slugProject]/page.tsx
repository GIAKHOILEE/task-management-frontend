"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Overview: React.FC = () => {
  const projectID = useContext(ProjectIDContext);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [assignment, setAssignment] = useState<AssigneeType[]>([]);

  const componentRef = useRef<HTMLDivElement | null>(null);

  const downloadPDF = () => {
    if (!componentRef.current) return;

    const capture = componentRef.current;

    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Thống kê công việc.pdf");
    });
  };

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

  // console.log(assignment);

  return (
    <>
      <button className={styles.btn_downpdf} onClick={downloadPDF}>
        Tạo file PDF
      </button>
      <div ref={componentRef}>
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
      </div>
    </>
  );
};

export default Overview;
