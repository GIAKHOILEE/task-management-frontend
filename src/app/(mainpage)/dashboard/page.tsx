"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./dasboard.module.css";
import {
  TaskType,
  ProjectType,
  AssigneeType,
  UserType,
} from "@/typeDatabase/TypeDatabase";
import PieChartProjectProgress from "@/chart/projectChart/pieChartProgress/PieChartProjectProgress";
import CircleAvatarComponent from "@/component/circleAvatarComponent/CircleAvatarComponent";
import ChartKpiProject from "@/chart/projectChart/chartKpiProject/ChartKpiProject";
import DashboardFoodter from "@/component/dashboardFoodter/DashboardFoodter";
export default function page() {
  const [dataProject, setDataProject] = useState<ProjectType[]>([]);
  const [dataTask, setDataTask] = useState<TaskType[]>([]);

  const [doneTaskCounts, setDoneTaskCounts] = useState<Record<number, number>>(
    {}
  );
  const [totalTaskCounts, setTotalTaskCounts] = useState<
    Record<number, number>
  >({});

  const getAllProject = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/project/getAllProject",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: ProjectType[] = await response.json();
      if (response.ok) {
        setDataProject(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAllTask = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/projects/0/tasks/get-all-task",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: TaskType[] = await response.json();
      if (response.ok) {
        setDataTask(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllProject();
    getAllTask();
  }, []);

  useEffect(() => {
    const countTaskStatsInProjects = (
      projects: ProjectType[],
      tasks: TaskType[]
    ): [Record<number, number>, Record<number, number>] => {
      const projectDoneTaskCounts: Record<number, number> = {};
      const projectTotalTaskCounts: Record<number, number> = {};

      projects.forEach((project) => {
        projectDoneTaskCounts[project.projectId] = 0;
        projectTotalTaskCounts[project.projectId] = 0;
      });

      tasks.forEach((task) => {
        const projectId = task.project.projectId;
        projectTotalTaskCounts[projectId]++;

        if (task.status === "done") {
          projectDoneTaskCounts[projectId]++;
        }
      });

      return [projectDoneTaskCounts, projectTotalTaskCounts];
    };

    if (dataProject.length > 0 && dataTask.length > 0) {
      const [newDoneTaskCounts, newTotalTaskCounts] = countTaskStatsInProjects(
        dataProject,
        dataTask
      );
      setDoneTaskCounts(newDoneTaskCounts);
      setTotalTaskCounts(newTotalTaskCounts);
    }
  }, [dataProject, dataTask]);
  // console.log(dataProject[1]);

  type DataProgress = {
    startDates: string;
    endDates: string;
    totalTaskCount: number;
    doneTaskCount: number;
  };
  const planProgressPercent = (type: DataProgress): number => {
    const startDate = new Date(type.startDates);
    const endDate = new Date(type.endDates);
    const currentDate = new Date();
    const duration =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    let durationNow =
      (currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    if (durationNow > duration) {
      durationNow = duration;
    }
    let averageTimePerTask;
    if (type.totalTaskCount !== 0) {
      averageTimePerTask = duration / type.totalTaskCount;
    } else {
      averageTimePerTask = 0;
    }
    const numberPlanTaskNow = Math.round(durationNow / averageTimePerTask);
    let planProgress;
    if (type.totalTaskCount !== 0) {
      planProgress = (numberPlanTaskNow / type.totalTaskCount) * 100;
    } else {
      planProgress = 0;
    }

    return planProgress;
  };
  const actualProgressPercent = (type: DataProgress): number => {
    let totalTaskCount = type.totalTaskCount;
    if (totalTaskCount == 0) {
      totalTaskCount = 1;
    }
    const actualProgress = (type.doneTaskCount / totalTaskCount) * 100;
    return actualProgress;
  };
  const kpiPerformance = (type: DataProgress): number => {
    const startDate = new Date(type.startDates);
    const endDate = new Date(type.endDates);
    const currentDate = new Date();
    const duration =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    let durationNow =
      (currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    if (durationNow > duration) {
      durationNow = duration;
    }
    let averageTimePerTask;
    if (type.totalTaskCount !== 0) {
      averageTimePerTask = duration / type.totalTaskCount;
    } else {
      averageTimePerTask = 0;
    }
    let numberPlanTaskNow;
    if (averageTimePerTask !== 0) {
      numberPlanTaskNow = Math.round(durationNow / averageTimePerTask);
    } else {
      numberPlanTaskNow = 0;
    }
    let kpiPerformance;
    if (numberPlanTaskNow !== 0) {
      kpiPerformance = type.doneTaskCount / numberPlanTaskNow;
    } else {
      kpiPerformance = 1;
    }
    // console.log(averageTimePerTask, numberPlanTaskNow, kpiPerformance);
    return kpiPerformance;
  };
  const setNameStatus = (status: string) => {
    if (status == "todo") {
      return "Chưa thực hiện";
    }
    if (status == "doing") {
      return "Đang thực hiện";
    }
    if (status == "done") {
      return "Hoàn thành";
    }
  };
  return (
    <div className={styles.dasboard}>
      <div className={styles.dasboard_title}>Bảng Điều Khiển</div>
      {dataProject.map((project) => {
        return (
          <div className={styles.dasboard_label}>
            <div className={styles.dasboard_labelitem}>
              <div className={styles.dasboard_labelitem_left}>
                <div className={styles.dasboard_labelitem_left_name}>
                  {project.projectName}
                </div>
                <div
                  className={
                    styles[`dasboard_labelitem_left_${project.status}`]
                  }
                >
                  {setNameStatus(project.status)}
                </div>
                <div className={styles.dasboard_labelitem_left_owner}>
                  <div>Người tạo: </div>
                  <div className={styles.dasboard_labelitem_left_owner_avatar}>
                    <CircleAvatarComponent email={project.owner.email} />
                  </div>
                  <div>{project.owner.email}</div>
                </div>
                <div className={styles.dasboard_labelitem_left_date}>
                  <div className={styles.labelitem_left_date_datetime}>
                    <div>Ngày bắt đầu</div>
                    <div className={styles.labelitem_left_date_start}>
                      {project.startDate.split("T")[0]}
                    </div>
                  </div>
                  <div className={styles.labelitem_left_date_datetime}>
                    <div>Ngày kết thúc</div>
                    <div className={styles.labelitem_left_date_end}>
                      {project.endDate.split("T")[0]}
                    </div>
                  </div>
                </div>
              </div>
              <PieChartProjectProgress
                // key={project.projectId}
                planProgress={planProgressPercent({
                  startDates: project.startDate,
                  endDates: project.endDate,
                  totalTaskCount: totalTaskCounts[project.projectId],
                  doneTaskCount: doneTaskCounts[project.projectId],
                })}
                actualProgress={actualProgressPercent({
                  startDates: project.startDate,
                  endDates: project.endDate,
                  totalTaskCount: totalTaskCounts[project.projectId],
                  doneTaskCount: doneTaskCounts[project.projectId],
                })}
              />
              <ChartKpiProject
                // key={project.projectId}
                totalTaskCount={totalTaskCounts[project.projectId]}
                doneTaskCount={doneTaskCounts[project.projectId]}
                planProgress={planProgressPercent({
                  startDates: project.startDate,
                  endDates: project.endDate,
                  totalTaskCount: totalTaskCounts[project.projectId],
                  doneTaskCount: doneTaskCounts[project.projectId],
                })}
                actualProgress={actualProgressPercent({
                  startDates: project.startDate,
                  endDates: project.endDate,
                  totalTaskCount: totalTaskCounts[project.projectId],
                  doneTaskCount: doneTaskCounts[project.projectId],
                })}
                kpiPerformance={kpiPerformance({
                  startDates: project.startDate,
                  endDates: project.endDate,
                  totalTaskCount: totalTaskCounts[project.projectId],
                  doneTaskCount: doneTaskCounts[project.projectId],
                })}
              />
            </div>
            <DashboardFoodter
              idProject={project.projectId}
              totalTaskCount={totalTaskCounts[project.projectId]}
              kpiPerformance={kpiPerformance({
                startDates: project.startDate,
                endDates: project.endDate,
                totalTaskCount: totalTaskCounts[project.projectId],
                doneTaskCount: doneTaskCounts[project.projectId],
              })}
            />
          </div>
        );
      })}
    </div>
  );
}
