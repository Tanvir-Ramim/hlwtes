import user from "../assets/user.png";
import cancel from "../assets/cancel.png";
import check from "../assets/check-mark.png";
import timelapse from "../assets/timelapse.png";

export const hrYear = [
  {
    id: 1,
    title: "HR Year Start",
    day: "01/05/2024",
    src: user,
  },
  {
    id: 2,
    title: "HR Year End",
    day: "01/05/2025",
    src: check,
  },
];
export const holidays = [
  {
    id: 1,
    title: "Total Holidays",
    day: "3",
    src: user,
  },
  {
    id: 2,
    title: "Taken Holidays",
    day: "4",
    src: check,
  },
  {
    id: 3,
    title: "Earn Toil",
    day: "6",
    src: cancel,
  },
  {
    id: 4,
    title: "Remaining Toil",
    day: "2",
    src: timelapse,
  },
];

export const sickleave = [
  {
    id: 1,
    title: "Remaining sick leave",
    day: "3",
    src: user,
  },
  {
    id: 2,
    title: "Remaining Holidays",
    day: "10",
    src: check,
  },
];
