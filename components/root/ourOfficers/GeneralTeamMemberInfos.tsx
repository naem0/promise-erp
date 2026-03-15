"use client";

import { useState } from "react";
import { AllOfficeEmployee } from "@/apiServices/employeeService";
import GeneralTeamMemberCardItem from "./GeneralTeamMemberCardItem";
import EmployeeItemModal from "./EmployeeItemModal";

interface Props {
  employee: AllOfficeEmployee;
}

const GeneralTeamMemberInfos = ({ employee }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        <GeneralTeamMemberCardItem employee={employee} />
      </div>

      <EmployeeItemModal
        employee={employee}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
};

export default GeneralTeamMemberInfos;
