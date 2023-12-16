import React from "react";
import { TaskType } from "@/typeDatabase/TypeDatabase";

export const TasksContext = React.createContext<TaskType[]>([]);
