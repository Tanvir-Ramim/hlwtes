import React from "react";
import PropTypes from "prop-types";
import { FaUsers } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { MdViewDay } from "react-icons/md";
import { MdCalendarToday } from "react-icons/md";
import { CgCalendarToday } from "react-icons/cg";
import { MdOutlineContentPasteOff } from "react-icons/md";
import { PiCheckSquareOffsetBold } from "react-icons/pi";
import { FiXSquare } from "react-icons/fi";
import { FaRegSquare } from "react-icons/fa";
import { FaRegMinusSquare } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { TbLayoutGridAdd } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { AiFillNotification } from "react-icons/ai";
import { RiListView } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import { CiFacebook } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
const iconMap = {
  facebook: CiFacebook,
  google: FaGoogle,
  whatsapp: FaWhatsapp,
  phone: FaPhoneAlt,
  users: FaUsers,
  analytics: IoMdAnalytics,
  ViewDay: MdViewDay,
  Calendar: MdCalendarToday,
  CalendarToday: CgCalendarToday,
  dayOff: MdOutlineContentPasteOff,
  CheckSquareOffset: PiCheckSquareOffsetBold,
  Remove: FiXSquare,
  Square: FaRegSquare,
  Minus: FaRegMinusSquare,
  downArrow: MdKeyboardArrowDown,
  LogOut: IoIosLogOut,
  grid: TbLayoutGridAdd,
  Settings: IoMdSettings,
  Time: MdAccessTime,
  Edit: FaEdit,
  delete: MdDeleteForever,
  notification: AiFillNotification,
  view: RiListView,
  report: TbReportSearch,
  holiday: MdOutlineHolidayVillage,
  eye: IoIosEye,
  reset: GrPowerReset,
  add: IoMdAdd,
  close: MdClose,
};

const TypeIcon = React.memo(({ type, className, size }) => {
  const IconComponent = iconMap[type];
  return (
    <>
      {IconComponent ? (
        <IconComponent className={className} size={size} />
      ) : null}
    </>
  );
});

TypeIcon.displayName = "Icon";

TypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
  css: PropTypes.string,
  size: PropTypes.number,
};

TypeIcon.defaultProps = {
  css: "",
};

export default TypeIcon;
