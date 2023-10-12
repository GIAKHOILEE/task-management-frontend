import styles from "./roadmap.module.css";

import React from "react";
import "./App.css";
import {
  GanttComponent,
  TaskFieldsModel,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-gantt";
import { projectData } from "./data";
export default function roadmap() {
  const taskValues: TaskFieldsModel = {
    id: "TaskID",
    name: "TaskName",
    startDate: "StartDate",
    endDate: "EndDate",
    duration: "Duration",
    progress: "Progress",
    child: "subtasks",
    dependency: "Predeceesor",
  };
  return (
    <div>
      {/* To change timeline view add timelineSettings={{timelineViewMode: "Day"} in below tag} */}
      <GanttComponent dataSource={projectData} taskFields={taskValues}>
        <ColumnsDirective>
          <ColumnDirective field="TaskID" headerText="ID"></ColumnDirective>
          <ColumnDirective field="TaskName" headerText="Name"></ColumnDirective>
          <ColumnDirective
            field="StartDate"
            format="dd-MMM-yy"
          ></ColumnDirective>
          <ColumnDirective field="Duration" textAlign="Right"></ColumnDirective>
        </ColumnsDirective>
      </GanttComponent>
    </div>
  );
}
