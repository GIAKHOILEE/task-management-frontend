export type UserType = {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  password: string;
  avatar: string | null;
};
export type ProjectType = {
  projectId: number;
  owner: OwnerType;
  projectName: string;
  projectDescription: string;
  level: number;
  status: string;
  startDate: string;
  endDate: string;
};
export type TaskType = {
  taskId: number;
  project: ProjectType;
  taskName: string;
  taskDescription: string;
  level: number;
  status: string;
  index: null | number;
  startDate: string;
  endDate: string;
};
export type UserProjectType = {
  userProjectId: number;
  user: UserType;
  project: ProjectType;
  role: string;
};
export type AssigneeType = {
  assignmentId: number;
  task: TaskType;
  userProject: UserProjectType;
};
export type OwnerType = {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: null | number;
  password: string;
  avatar: string;
};
