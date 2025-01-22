import { useState, useEffect } from "react";
import ApiClient from "../axios/ApiClient";

const useEmployee = ({
  employee_id,
  employee_name,
  leave_type,
  status,
  emp,
}) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGetEmployee = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.get(
        `/leave-apply?employee_id=${employee_id}&employee_name=${employee_name}&leave_type=${leave_type}&status=${status}&emp=${emp}`
      );
      setEmployeeData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetEmployee();
  }, [employee_id, employee_name, leave_type, status]);

  return { employeeData, loading, error, refetch: handleGetEmployee };
};

export default useEmployee;
