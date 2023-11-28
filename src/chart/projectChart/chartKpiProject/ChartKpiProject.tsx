import React from "react";
import styles from "./ChartKpiProject.module.css";

interface DataProgress {
  planProgress: number;
  actualProgress: number;
  kpiPerformance: number;
  totalTaskCount: number;
  doneTaskCount: number;
}
export default function ChartKpiProject({
  planProgress,
  actualProgress,
  kpiPerformance,
  totalTaskCount,
  doneTaskCount,
}: DataProgress) {
  console.log(planProgress);
  if (
    isNaN(planProgress) ||
    isNaN(actualProgress) ||
    isNaN(kpiPerformance) ||
    isNaN(totalTaskCount) ||
    isNaN(doneTaskCount)
  ) {
    planProgress = 0;
    actualProgress = 0;
    kpiPerformance = 1;
    totalTaskCount = 0;
    doneTaskCount = 0;
  }
  if (planProgress == 0) {
    planProgress = 1;
  }
  if (actualProgress == 0) {
    actualProgress = 1;
  }
  const kpiProgress = actualProgress / planProgress;
  let kpiProgressClass = "";
  let classParameterProgress;
  if (kpiProgress >= 0 && kpiProgress < 0.5) {
    kpiProgressClass = "verylow";
    classParameterProgress = "Rất chậm";
  } else if (kpiProgress >= 0.5 && kpiProgress < 1) {
    kpiProgressClass = "low";
    classParameterProgress = "Chậm";
  } else if (kpiProgress >= 1) {
    kpiProgressClass = "onschedule";
    classParameterProgress = "Đúng kế hoạch";
  }

  let kpiPerformanceClas = "";
  let classParameterPerformance;
  if (kpiPerformance >= 0 && kpiPerformance < 0.5) {
    kpiPerformanceClas = "verylow";
    classParameterPerformance = "Rất chậm";
  } else if (kpiPerformance >= 0.5 && kpiPerformance < 1) {
    kpiPerformanceClas = "low";
    classParameterPerformance = "Chậm";
  } else if (kpiPerformance >= 1) {
    kpiPerformanceClas = "onschedule";
    classParameterPerformance = "Hiệu suất tốt";
  }
  return (
    <div>
      <div className={styles.kpi_chart}>
        <div className={styles.kpi_chart_title}>KPI tiến độ</div>
        <div
          className={`${styles.kpi_chart_parameter} ${styles[kpiProgressClass]}`}
        >
          {parseFloat((kpiProgress * 100).toFixed(2))}% -{" "}
          {classParameterProgress}
        </div>
        {kpiProgressClass == "verylow" && (
          <div className={styles.kpi_container}>
            <div className={styles.kpi_container_label_verylow}></div>
            <div className={styles.kpi_container_label}></div>
            <div className={styles.kpi_container_label}></div>
          </div>
        )}
        {kpiProgressClass == "low" && (
          <div className={styles.kpi_container}>
            <div className={styles.kpi_container_label_low}></div>
            <div className={styles.kpi_container_label_low}></div>
            <div className={styles.kpi_container_label}></div>
          </div>
        )}
        {kpiProgressClass == "onschedule" && (
          <div className={styles.kpi_container}>
            <div className={styles.kpi_container_label_onschedule}></div>
            <div className={styles.kpi_container_label_onschedule}></div>
            <div className={styles.kpi_container_label_onschedule}></div>
          </div>
        )}
      </div>
      <div className={styles.kpi_chart}>
        <div className={styles.kpi_chart_title}>KPI hiệu suất công việc</div>
        <div
          className={`${styles.kpi_chart_parameter} ${styles[kpiPerformanceClas]}`}
        >
          {doneTaskCount}/{totalTaskCount} - {classParameterPerformance}
        </div>
        {kpiPerformanceClas == "verylow" && (
          <div className={styles.kpi_container}>
            <div className={styles.kpi_container_label_verylow}></div>
            <div className={styles.kpi_container_label}></div>
            <div className={styles.kpi_container_label}></div>
          </div>
        )}
        {kpiPerformanceClas == "low" && (
          <div className={styles.kpi_container}>
            <div className={styles.kpi_container_label_low}></div>
            <div className={styles.kpi_container_label_low}></div>
            <div className={styles.kpi_container_label}></div>
          </div>
        )}
        {kpiPerformanceClas == "onschedule" && (
          <div className={styles.kpi_container}>
            <div className={styles.kpi_container_label_onschedule}></div>
            <div className={styles.kpi_container_label_onschedule}></div>
            <div className={styles.kpi_container_label_onschedule}></div>
          </div>
        )}
      </div>
    </div>
  );
}
