import girl from "../../Admin/Employess-List/assets/girl1.webp";
import girl2 from "../../Admin/Employess-List/assets/girls2.png";
import boy from "../../Admin/Employess-List/assets/boy.png";
import boy2 from "../../Admin/Employess-List/assets/boy2.png";

export const leavList = [
  {
    id: 1,
    title: "Employee ID",
  },
  {
    id: 2,
    title: "Employee Name & designation",
  },
  {
    id: 3,
    title: "Leave Type",
  },
  {
    id: 4,
    title: "From Date",
  },
  {
    id: 5,
    title: "to Date",
  },
  {
    id: 6,
    title: "Duration",
  },
  {
    id: 7,
    title: "Reason",
  },
  {
    id: 8,
    title: "Approved Days",
  },
  {
    id: 9,
    title: "notes",
  },
  {
    id: 10,
    title: "Approval Status",
  },
];

export const leaveListItem = [
  {
    id: 1,
    employeeID: "Dev02",
    designation: "developer",
    type: "Sick",
    startDate: "9th Sept",
    endDate: "10th Sept",
    duration: "2",
    reason: "Sick",
    days: 4,
    notes: "okays will be fine",
    approval: "approved",
  },
];

export const correctionItem = [
  {
    id: 1,
    employeeID: "Dev02",
    designation: "developer",

    startTime: "10am",
    endTime: "7pm",

    date: "24th july",
    notes: "okays will be fine",
    approval: "approved",
  },
  {
    id: 2,
    employeeID: "Dev02",
    designation: "developer",

    startTime: "10am",
    endTime: "7pm",

    date: "24th july",
    notes: "okays will be fine",
    approval: "rejected",
  },
];

export const employeList = [
  {
    id: 1,
    img: boy,

    title: "Rabbinur ",
    gmail: "Rabbinur@gmail.com",
    designation: "Full stack dev",
    EmployeeID: "ef87",
  },
  {
    id: 2,
    img: boy2,
    title: "Mahmudul Hasan ",
    gmail: "Mahmudul@gmail.com",
    designation: "Backend dev",
    EmployeeID: "ef87",
  },
  {
    id: 3,
    img: girl,
    title: "Ayesha Siddika ",
    gmail: "Ayesha@gmail.com",
    designation: "frontend dev",
    EmployeeID: "ef87",
  },
  {
    id: 4,
    img: girl2,
    title: "Sanjana Ayshi ",
    gmail: "Sanjana@gmail.com",
    designation: "UI/UX Designer",
    EmployeeID: "ef87",
  },
  {
    id: 5,
    img: boy2,
    title: "Ramim",
    gmail: "Ramim@gmail.com",
    designation: "Full Stack dev.",
    EmployeeID: "ef87",
  },
];

export const employeeAttendence = [
  {
    id: 1,
    date: "24th july",
    employeeID: "Dev02",
    designation: "developer",
    inTime: "10am",
    outTime: "7pm",
    holiday: "fridays",
    notes: "approved",
  },
  {
    id: 2,
    date: "24th july",
    employeeID: "Dev02",
    designation: "developer",
    inTime: "10am",
    outTime: "7pm",
    holiday: "fridays",
    notes: "approved",
  },
];
