import React from "react";
import { UserProjectType } from "@/typeDatabase/TypeDatabase";

export const UserProjectInProjectContext = React.createContext<
  UserProjectType[] | undefined
>(undefined);
