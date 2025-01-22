import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Rootlayout from "../Rootlayout/Rootlayout";
import AdminLayout from "../Rootlayout/AdminLayout";
import Dashboard from "../feature/Admin/Dashboard/Dashboard";
import MyDay from "../feature/Admin/My-day/MyDay";
import LeaveApplication from "../feature/Admin/Leave-application/LeaveApplication";
import LeaveList from "../feature/Admin/Leave-List/LeaveList";
import CorrectionAttendence from "../feature/Admin/Correction-attendence/CorrectionAttendence";
import CorrectionList from "../feature/Admin/Correction-List/CorrectionList";
import AddEmployee from "../feature/Admin/Add-Employee/AddEmployee";
import EmployeList from "../feature/Admin/Employess-List/EmployeList";
import EmployeeAttendence from "../feature/Admin/Employee-Attendence/EmployeeAttendence";
import Department from "../feature/Admin/Department/Department";
import LeaveTypes from "../feature/Admin/Leave-Types/LeaveTypes";
import WorkingHour from "../feature/Admin/Woking-hour/WorkingHour";
import AttendenceCollection from "../feature/Admin/Attendence-Collection/AttendenceCollection";
import GovtHolidays from "../feature/Admin/Govt-Holidays/GovtHolidays";
import WeeklyHolidays from "../feature/Admin/Weekly-Holidays/WeeklyHolidays";
import Home from "../feature/employee/Home/Home";
import MyDays from "../feature/employee/My-Day/MyDay";
import Attendence from "../feature/employee/Attendence/Attendence";
import AttendenceList from "../feature/employee/Attendence-List/AttendenceList";
import GovtHoliday from "../feature/employee/Govt-Holidays/GovtHolidays";
import WeeklyHoliday from "../feature/employee/Weekly-Holidays/WeeklyHolidays";
import LeaveApplicaton from "../feature/employee/Leave-application/LeaveApplicaton";
import LeaveLists from "../feature/employee/Leave-List/LeaveList";
import Login from "../feature/employee/Login/Login";
import Registration from "../feature/employee/Registration/Registration";
import Counter from "../components/counter/Counter";

import Announcement from "../feature/Admin/Anouncement/Announcement";
import EmployeAnnounce from "../feature/employee/EmployeAnnoncement/EmployeAnnounce";
import LeaveNotice from "../feature/Admin/Leave-notice/LeaveNotice";

import SetPassword from "../feature/employee/Login/SetNewPass";
import RequestPass from "../feature/employee/Login/RequestPass";
import DailyAttendence from "../feature/employee/dailyAttendence/DailyAttendence";
import MonthlyAttendence from "../feature/employee/monthlyAttendence/MonthlyAttendence";
import EmployeeRoutes from "./EmployeeRoutes";
import AdminRoutes from "./AdminRoutes";
import AddHoliday from "../feature/Admin/AddHoliday/AddHoliday";
import AddAnnouncement from "../feature/Admin/AddAnnouncement/AddAnnouncement";
import EditAnnouncement from "../feature/Admin/Anouncement/EditAnnouncement";
import AddLeaveNotification from "../feature/Admin/AddLeaveNotification/AddLeaveNotification";
import IPsetting from "../feature/Admin/IPSetting/IPsetting";
import HomeOffice from "../feature/Admin/HomeOffice/HomeOffice";

import MonthlyAttAdmin from "../feature/employee/monthlyAttendence/MonthlyAttAdmin";

import Report from "../feature/Admin/Report/Report";
import EditEmployee from "../feature/Admin/Employess-List/EditEmployee";
import Newattendance from "../feature/employee/monthlyAttendence/Newattendance";
import WeekPlan from "../feature/Admin/WeekPlan/WeekPlan";
import DailyAttendance from "../feature/Admin/Daily-Attendence/DailyAttendance";
import LeaveRecord from "../feature/Admin/LeaveRecord/LeaveRecord";
import AddCategories from "../feature/Admin/AddCategories/AddCategories";
import YearlyLeaveHoly from "../feature/Admin/YearlyLeaveHoly/YearlyLeaveHoly";
import EmpYearlyLeave from "../feature/employee/EmpYearlyLeave/EmpYearlyLeave";
import Team from "../feature/employee/Team/Team";
import AllLeaveReport from "../feature/Admin/AllLeaveReport/AllLeaveReport";
import Absent from "../feature/Admin/Absent/Absent";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <EmployeeRoutes>
          {" "}
          <Rootlayout />
        </EmployeeRoutes>
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/my-day",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MyDays />
          </Suspense>
        ),
      },
      {
        path: "/correction-attendence",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Attendence />
          </Suspense>
        ),
      },
      {
        path: "/correction-list",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AttendenceList />
          </Suspense>
        ),
      },
      {
        path: "/leave-application",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LeaveApplicaton />
          </Suspense>
        ),
      },
      {
        path: "/team",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Team></Team>
          </Suspense>
        ),
      },
      {
        path: "/daily-attendence",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DailyAttendence></DailyAttendence>
          </Suspense>
        ),
      },
      {
        path: "/monthly-attendence",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MonthlyAttendence></MonthlyAttendence>
          </Suspense>
        ),
      },
      {
        path: "/leave-list",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LeaveLists />
          </Suspense>
        ),
      },
      {
        path: "/weekly-holidays",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WeeklyHoliday />
          </Suspense>
        ),
      },
      {
        path: "/yearly-leave",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EmpYearlyLeave></EmpYearlyLeave>
          </Suspense>
        ),
      },
      {
        path: "/govt-holidays",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GovtHoliday />
          </Suspense>
        ),
      },
      {
        path: "/employe-announcement",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EmployeAnnounce />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminRoutes>
          {" "}
          <AdminLayout />{" "}
        </AdminRoutes>
      </Suspense>
    ),
    children: [
      {
        path: "/admin",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "/admin/my-day",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MyDay />
          </Suspense>
        ),
      },
      {
        path: "/admin/leave-application",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LeaveApplication />
          </Suspense>
        ),
      },
      {
        path: "/admin/leave-list",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LeaveList />
          </Suspense>
        ),
      },
      {
        path: "/admin/week-plan",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WeekPlan></WeekPlan>
          </Suspense>
        ),
      },
      {
        path: "/admin/absent",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Absent></Absent>
          </Suspense>
        ),
      },
      {
        path: "/admin/new-attendence",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Newattendance />
          </Suspense>
        ),
      },
      {
        path: "/admin/daily-attendence",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DailyAttendance></DailyAttendance>
          </Suspense>
        ),
      },
      // {
      //   path: "/admin/correction-attendence",
      //   element: (
      //     <Suspense fallback={<div>Loading...</div>}>
      //       <CorrectionAttendence />
      //     </Suspense>
      //   ),
      // },
      {
        path: "/admin/correction-attendance",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CorrectionList />
          </Suspense>
        ),
      },
      {
        path: "/admin/monthly-attendance",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MonthlyAttAdmin />
          </Suspense>
        ),
      },
      {
        path: "/admin/add-employee",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AddEmployee />
          </Suspense>
        ),
      },
      {
        path: "/admin/employee-list",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EmployeList />
          </Suspense>
        ),
      },
      {
        path: "/admin/edit-employee/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EditEmployee></EditEmployee>
          </Suspense>
        ),
      },
      {
        path: "/admin/report",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Report></Report>
          </Suspense>
        ),
      },
      {
        path: "/admin/employee-attendence",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EmployeeAttendence />
          </Suspense>
        ),
      },
      {
        path: "/admin/department",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Department />
          </Suspense>
        ),
      },
      {
        path: "/admin/leave-types",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LeaveTypes />
          </Suspense>
        ),
      },
      {
        path: "/admin/working-hour",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WorkingHour />
          </Suspense>
        ),
      },
      {
        path: "/admin/attendence-collection",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AttendenceCollection />
          </Suspense>
        ),
      },
      {
        path: "/admin/govt-holidays",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <GovtHolidays />
          </Suspense>
        ),
      },
      {
        path: "/admin/add-holidays",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AddHoliday></AddHoliday>
          </Suspense>
        ),
      },
      {
        path: "/admin/home-office",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <HomeOffice></HomeOffice>
          </Suspense>
        ),
      },
      {
        path: "/admin/manage-ip",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <IPsetting></IPsetting>
          </Suspense>
        ),
      },
      {
        path: "/admin/weekly-holidays",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WeeklyHolidays />
          </Suspense>
        ),
      },
      {
        path: "/admin/leave-overview",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AllLeaveReport></AllLeaveReport>
          </Suspense>
        ),
      },
      {
        path: "/admin/anouncement",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Announcement />
          </Suspense>
        ),
      },
      {
        path: "/admin/add-announcement",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AddAnnouncement></AddAnnouncement>
          </Suspense>
        ),
      },
      {
        path: "/admin/edit-announcement/:id",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EditAnnouncement></EditAnnouncement>
          </Suspense>
        ),
      },
      {
        path: "/admin/add-leave-notification",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AddLeaveNotification></AddLeaveNotification>
          </Suspense>
        ),
      },
      {
        path: "/admin/leave-notice",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LeaveNotice />
          </Suspense>
        ),
      },
      {
        path: "/admin/leave-report",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LeaveRecord></LeaveRecord>
          </Suspense>
        ),
      },
      {
        path: "/admin/yearly-leave",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <YearlyLeaveHoly></YearlyLeaveHoly>
          </Suspense>
        ),
      },
      {
        path: "/admin/add-categories",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AddCategories></AddCategories>
          </Suspense>
        ),
      },
    ],
  },
  // login----
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/login/:token",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SetPassword />
      </Suspense>
    ),
  },
  {
    path: "login/reset=new_password",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RequestPass></RequestPass>
      </Suspense>
    ),
  },
  {
    path: "/registration",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Registration />
      </Suspense>
    ),
  },
  {
    path: "/counter",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Counter />
      </Suspense>
    ),
  },
]);
