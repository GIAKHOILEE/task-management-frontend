"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./layout.module.css";
import CircleAvatarComponent from "@/component/circleAvatarComponent/CircleAvatarComponent";
import Link from "next/link";
import Loading from "@/component/loadingComponent/loading";
import { Suspense } from "react";
import { ProjectIDContext } from "@/context/ProjectIDContext";
import { UserProjectInProjectContext } from "@/context/UserProjectInProjectContext";
import { IdProjectOwner } from "@/context/IdProjectOwner";
import { UserProjectType, UserType } from "@/typeDatabase/TypeDatabase";
import AlertComponent from "@/component/alertComponent/AlertComponent";
type LayoutProps = {
  params: { slugProject: string };
  children: React.ReactNode;
};

export default function layout({ params, children }: LayoutProps) {
  const [userInProject, setUserInProject] = useState<UserProjectType[]>([]);
  // console.log(userInProject);
  const [userNotInProject, setUserNotInProject] = useState<UserType[]>([]);
  const [openBoxmAddPeople, setOpenBoxAddPeople] = useState(false);
  const [openSelectViewPeople, setOpenSelectViewPeople] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string>("Tổng Quan");
  const [searchTerm, setSearchTerm] = useState("");
  const [IdProjectowner, setIdProjectOwner] = useState();
  const [projectName, setProjectName] = useState("");

  const userObject = JSON.parse(localStorage.getItem("user") as string);
  const userId = userObject.userId;

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };
  const projectID = params.slugProject;

  const [AlertSuccessAddUserProject, setAlertSuccessAddUserProject] =
    useState(false);
  const [AlertSuccessDeleteUserProject, setAlertSuccessDeleteUserProject] =
    useState(false);
  const [AlertWarningDeleteUserProject, setAlertWarningDeleteUserProject] =
    useState(false);
  const [AlertInfoNotOwner, setAlertInfoNotOwner] = useState(false);

  // kiểm tra alert
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAlertSuccessAddUserProject(false);
      setAlertSuccessDeleteUserProject(false);
      setAlertWarningDeleteUserProject(false);
      setAlertInfoNotOwner(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [
    AlertSuccessAddUserProject,
    AlertSuccessDeleteUserProject,
    AlertWarningDeleteUserProject,
    AlertInfoNotOwner,
  ]);

  // lấy (userProject) trong project
  async function getProjectUsers() {
    try {
      const response = await fetch(
        `http://localhost:8080/project/${projectID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      setUserInProject(data);
      setProjectName(data[0].project.projectName);

      localStorage.setItem(
        "startProject",
        JSON.stringify(data[0].project.startDate)
      );
      localStorage.setItem(
        "endProject",
        JSON.stringify(data[0].project.endDate)
      );
      const owner = data.find((user: any) => user.role === "owner");
      if (owner) {
        const ownerId = owner.user.userId;
        setIdProjectOwner(ownerId);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getProjectUsers();
  }, []);

  // lấy user không có trong project
  async function getUserNotInProject() {
    try {
      const response = await fetch(
        `http://localhost:8080/user/${projectID}/users-not-in-project`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      // console.log(data);
      setUserNotInProject(data);
    } catch (error) {
      console.log(error);
    }
  }

  //thêm user vào project
  async function addUserProject(userId: any) {
    try {
      const response = await fetch("http://localhost:8080/project/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          projectId: projectID,
          role: "member",
        }),
      });
      if (response) {
        setAlertSuccessAddUserProject(true);
        // alert("thêm thành công");
        getProjectUsers();
        getUserNotInProject();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //xóa user khỏi project
  async function deleteUserProject(userId: any) {
    try {
      const response = await fetch(
        "http://localhost:8080/project/remove-member",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            projectId: projectID,
          }),
        }
      );
      if (response.ok) {
        setAlertSuccessDeleteUserProject(true);
        // alert("xóa thành công");
        getProjectUsers();
        getUserNotInProject();
      }
      if (!response.ok) {
        setAlertWarningDeleteUserProject(true);
        // alert("Không thể xóa!!! Người này còn đang trong công việc");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={styles.slug_layout}>
      <div className={styles.alert_log}>
        {AlertInfoNotOwner && (
          <AlertComponent
            severity="info"
            message="Bạn không phải là quản lý dự án"
          />
        )}
        {AlertSuccessAddUserProject && (
          <AlertComponent
            severity="success"
            message="Thêm người dùng vào dự án thành công"
          />
        )}
        {AlertSuccessDeleteUserProject && (
          <AlertComponent
            severity="success"
            message="Xóa người dùng khỏi dự án thành công"
          />
        )}
        {AlertWarningDeleteUserProject && (
          <AlertComponent
            severity="warning"
            message="Không thể xóa!!! Người này còn đang trong công việc"
          />
        )}
      </div>
      <div className={styles.slug_layout_route}>
        <span>
          Quản lý dự án {" > "} Dự án {" > "}
        </span>
        <span className={styles.slug_layout_route_main}>{selectedItem}</span>
      </div>
      <div className={styles.layout_people}>
        <div className={styles.layout_grouproute}>
          <Link
            href={`/projectmanager/${projectID}`}
            className={
              selectedItem === "Tổng Quan"
                ? styles.layout_grouproute_item_choose
                : styles.layout_grouproute_item
            }
          >
            <div onClick={() => handleItemClick("Tổng Quan")}>Tổng Quan</div>
          </Link>

          <Link
            href={`/projectmanager/${projectID}/roadmap`}
            className={
              selectedItem === "Lộ Trình"
                ? styles.layout_grouproute_item_choose
                : styles.layout_grouproute_item
            }
          >
            <div onClick={() => handleItemClick("Lộ Trình")}>Lộ Trình</div>
          </Link>

          <Link
            href={`/projectmanager/${projectID}/taskboard`}
            className={
              selectedItem === "Nhiệm Vụ"
                ? styles.layout_grouproute_item_choose
                : styles.layout_grouproute_item
            }
          >
            <div onClick={() => handleItemClick("Nhiệm Vụ")}>Nhiệm Vụ</div>
          </Link>
        </div>
        <div className={styles.layout_avatar}>
          <div
            className={styles.layout_avatar_add}
            onClick={() => {
              getUserNotInProject();
              setOpenBoxAddPeople(true);
            }}
          >
            <img
              className={styles.layout_avatar_add_icon}
              src="/iconAddPeople.png"
              alt=""
            />
          </div>
          {userInProject.map((user) => (
            <CircleAvatarComponent email={user.user.email} />
          ))}
        </div>
      </div>
      <div className={styles.project_name}>{projectName}</div>
      <IdProjectOwner.Provider value={IdProjectowner}>
        <UserProjectInProjectContext.Provider value={userInProject}>
          <ProjectIDContext.Provider value={projectID}>
            <Suspense fallback={<Loading />}>{children} </Suspense>
          </ProjectIDContext.Provider>
        </UserProjectInProjectContext.Provider>
      </IdProjectOwner.Provider>

      {/* BOX add people  */}
      {openBoxmAddPeople && (
        <div
          className={styles.box_container}
          onClick={() => setOpenBoxAddPeople(false)}
        >
          <div
            className={styles.box_addread_people}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <img src="/iconGlass.png" alt="" className={styles.icon_glass} />
              <input
                className={styles.box_addread_people_search}
                type="search"
                placeholder="tìm thành viên theo email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.box_addread_people_select}>
              <span
                className={styles.box_addread_people_select_choose}
                onClick={() => setOpenSelectViewPeople(true)}
              >
                Thêm thành viên
              </span>
              <span
                className={styles.box_addread_people_select_choose}
                onClick={() => setOpenSelectViewPeople(false)}
              >
                Xem thành viên
              </span>
            </div>
            {openSelectViewPeople && (
              <div className={styles.box_addread_people_content}>
                {userNotInProject
                  .filter((user) =>
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <div className={styles.box_addread_people_content_item}>
                      <CircleAvatarComponent email={user.email} />
                      <div>
                        <div className={styles.box_content_item_name}>
                          {user.firstname} {user.lastname}
                        </div>
                        <span className={styles.box_content_item_email}>
                          {user.email}
                        </span>
                      </div>

                      <button
                        className={styles.box_content_item_btn}
                        onClick={() => {
                          if (userId == IdProjectowner) {
                            addUserProject(user.userId);
                          } else {
                            setAlertInfoNotOwner(true);
                            // alert("bạn không phải người quản lý dự án");
                          }
                          // setUserID(user.userId);
                        }}
                      >
                        Thêm
                      </button>
                    </div>
                  ))}
              </div>
            )}
            {!openSelectViewPeople && (
              <div className={styles.box_addread_people_content}>
                {userInProject
                  .filter((user) =>
                    user.user.email
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <div className={styles.box_addread_people_content_item}>
                      <CircleAvatarComponent email={user.user.email} />
                      <div>
                        <div className={styles.box_content_item_name}>
                          {user.user.firstname} {user.user.lastname}
                        </div>
                        <span className={styles.box_content_item_email}>
                          {user.user.email}
                        </span>
                      </div>
                      {user.role == "member" && (
                        <button
                          className={styles.box_content_item_btn_delete}
                          onClick={() => {
                            if (userId == IdProjectowner) {
                              deleteUserProject(user.user.userId);
                            } else {
                              setAlertInfoNotOwner(true);
                              // alert("bạn không phải người quản lý dự án");
                            }
                          }}
                        >
                          Xóa
                        </button>
                      )}
                      {user.role == "owner" && (
                        <span className={styles.box_content_item_btn_owner}>
                          Người quản lý
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
