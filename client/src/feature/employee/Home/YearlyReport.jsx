import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const YearlyReport = ({ user, employeSelect, leave, employeeData }) => {
  const [sections, setSections] = useState([
    {
      id: "hrYearStart",
      title: "HR Year Start",
      value: user?.hr_start_year?.slice(0, 10),
    },
    {
      id: "hrYearEnd",
      title: "HR Year End",
      value: user?.hr_end_year?.slice(0, 10),
    },
    {
      id: "totalYearlyLeave",
      title: "Total Yearly Leave",
      value: employeSelect?.total_leaves,
    },
    {
      id: "leaveBalance",
      title: "My Leave Balance",
      value: employeSelect?.leave_balance,
    },
  ]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedSections = Array.from(sections);
    const [removed] = reorderedSections.splice(source.index, 1);
    reorderedSections.splice(destination.index, 0, removed);

    setSections(reorderedSections);
  };
 return (
   <div className="border py-5 px-5 shadow rounded">
     <h2 className="text-xl font-semibold text-gray-800 mb-5 uppercase">
       My Yearly Report
     </h2>

     <DragDropContext onDragEnd={onDragEnd}>
       {/* Draggable Main Sections */}
       <Droppable droppableId="sections">
         {(provided) => (
           <div
             ref={provided.innerRef}
             {...provided.droppableProps}
             className="grid md:grid-cols-4 grid-cols-2 gap-5"
           >
             {sections.map((section, index) => (
               <Draggable
                 key={section.id}
                 draggableId={section.id}
                 index={index}
               >
                 {(provided) => (
                   <div
                     ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                     className="border text-center rounded shadow bg-primary"
                   >
                     <div className="py-5 col-span-4 flex flex-col justify-between h-full">
                       <p className="xl:text-xl text-base text-white font-semibold capitalize pb-5">
                         {section.title}
                       </p>
                       <p className="text-
                       
                       
                       
                       
                       
                       text-white font-normal">
                         {section.value}
                       </p>
                     </div>
                   </div>
                 )}
               </Draggable>
             ))}
             {provided.placeholder}
           </div>
         )}
       </Droppable>

       {/* Draggable Leave Sections */}
       <Droppable droppableId="leaveSections">
         {(provided) => (
           <div
             ref={provided.innerRef}
             {...provided.droppableProps}
             className="grid md:grid-cols-4 grid-cols-2 gap-5 mt-5"
           >
             {leave?.map((item, index) => {
               if (
                 user?.employment_status !== "intern" &&
                 ((user?.gender === "Male" &&
                   item?.name === "Maternity Leave") ||
                   (user?.gender === "Female" &&
                     item?.name === "Paternity Leave") ||
                   item?.duration_Type !== "Full Day" ||
                   item?.name === "Absent")
               ) {
                 return null;
               }

               if (
                 user?.employment_status === "intern" &&
                 item?.provision?.day === 0
               ) {
                 return null;
               }

               const remainingDays =
                 user?.employment_status !== "intern"
                   ? item?.day -
                     (employeeData?.leaveSummary?.[
                       Object.keys(employeeData?.leaveSummary || {}).find(
                         (key) => key.startsWith(item?.name?.split(" ")[0])
                       )
                     ] || 0)
                   : item?.provision?.day -
                     (employeeData?.leaveSummary?.[
                       `${item?.provision?.name}`
                     ] || 0);

               const title =
                 user?.employment_status !== "intern"
                   ? `Remaining ${item?.name}`
                   : `Remaining ${item?.provision?.name}`;

               return (
                 <Draggable
                   key={item?.id || index}
                   draggableId={`leave-${item?.id || index}`}
                   index={index}
                 >
                   {(provided) => (
                     <div
                       ref={provided.innerRef}
                       {...provided.draggableProps}
                       {...provided.dragHandleProps}
                       className="border text-center rounded shadow bg-primary"
                     >
                       <div className="py-5 col-span-4 flex flex-col justify-between h-full">
                         <p className="xl:text-xl text-base text-white font-semibold capitalize pb-5">
                           {title}
                         </p>
                         <p className="text-base text-white font-normal">
                           {remainingDays}
                         </p>
                       </div>
                     </div>
                   )}
                 </Draggable>
               );
             })}
             {provided.placeholder}
           </div>
         )}
       </Droppable>
     </DragDropContext>
   </div>
 );

};

// Define PropTypes
YearlyReport.propTypes = {
  user: PropTypes.shape({
    hr_start_year: PropTypes.string,
    hr_end_year: PropTypes.string,
    employment_status: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  employeSelect: PropTypes.shape({
    total_leaves: PropTypes.number,
    leave_balance: PropTypes.number,
  }).isRequired,
  leave: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      duration_Type: PropTypes.string,
      day: PropTypes.number,
      provision: PropTypes.shape({
        name: PropTypes.string,
        day: PropTypes.number,
      }),
    })
  ).isRequired,
  employeeData: PropTypes.shape({
    leaveSummary: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
};

export default YearlyReport;
