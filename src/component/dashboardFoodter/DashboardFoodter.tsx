"use client";
import React, { useEffect, useState } from "react";
import styles from "./DashboardFoodter.module.css";
import { UserType } from "@/typeDatabase/TypeDatabase";
import CircleAvatarComponent from "../circleAvatarComponent/CircleAvatarComponent";
type dataProps = {
  idProject: number;
  totalTaskCount: number;
  kpiPerformance: number;
};
export default function DashboardFoodter({
  idProject,
  totalTaskCount,
  kpiPerformance,
}: dataProps) {
  const [dataAssign, setDataAssign] = useState<UserType[]>([]);
  if (isNaN(kpiPerformance) || isNaN(totalTaskCount)) {
    // Handle the case where data is not available
    kpiPerformance = 1;
    totalTaskCount = 0;
  }

  const getAllAssign = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project/${idProject}/user-in-project`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: UserType[] = await response.json();
      if (response.ok) {
        setDataAssign(data);
      }
      console.log(dataAssign);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllAssign();
  }, [idProject]);

  let kpiPerformanceClas = "";
  let classParameterPerformance;
  if (kpiPerformance >= 0 && kpiPerformance < 0.5) {
    kpiPerformanceClas = "verylow";
    classParameterPerformance = "Chậm trễ";
  } else if (kpiPerformance >= 0.5 && kpiPerformance < 1) {
    kpiPerformanceClas = "low";
    classParameterPerformance = "Chậm";
  } else if (kpiPerformance >= 1) {
    kpiPerformanceClas = "onschedule";
    classParameterPerformance = "Hiệu suất tốt";
  }
  return (
    <div className={styles.dasboard_footer}>
      <div className={styles.dasboard_footer_assign_avatar}>
        {dataAssign.map((assign) => {
          return <CircleAvatarComponent email={assign.email} />;
        })}
      </div>
      <div className={styles.dasboard_footer_totaltask}>
        <div>Số lượng công việc</div>
        {totalTaskCount}
      </div>
      <div className={styles.dasboard_footer_status}>
        <div>Tình trạng</div>
        <div
          className={`${styles.dasboard_footer_status_label} ${styles[kpiPerformanceClas]}`}
        >
          {classParameterPerformance}
        </div>
      </div>
    </div>
  );
}
