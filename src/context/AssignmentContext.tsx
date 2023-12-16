import React from "react";
import { AssigneeType } from "@/typeDatabase/TypeDatabase";

export const AssignmentContext = React.createContext<AssigneeType[]>([]);
