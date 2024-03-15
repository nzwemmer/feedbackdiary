import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilWarning } from "@coreui/icons";
import useToken from "src/components/authentication/useToken";
import createAxiosInstance from "src/api/axiosInstance";

const SelectCourse = () => {
  const { token } = useToken();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startDateCourse, setStartDateCourse] = useState("");
  const [endDateCourse, setEndDateCourse] = useState("");

  const [alertConfig, setAlertConfig] = useState({
    icon: null,
    color: "info",
    visible: false,
    message: "error",
  });

  const axiosInstance = createAxiosInstance(token);

  useEffect(() => {
    // Fetch the list of available courses
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/api/load/courses");

        if (response.status === 200) {
          const courseList = response.data["courses"];
          setCourses(courseList);
          setAvailableCourses(Object.keys(courseList));
        } else {
          setAlertConfig({
            icon: cilWarning,
            color: "warning",
            visible: true,
            message: "Failed to fetch courses.",
          });
        }
      } catch (error) {
        console.error("Error during course fetching:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (event) => {
    const selectedValue = event.target.value;

    setSelectedCourse(selectedValue);
    // courses[selectedValue] is an array with two date strings in format DD-MM-YYYY
    const [startDateString, endDateString] = courses[selectedValue];

    setStartDateCourse(parseDateString(startDateString));
    setEndDateCourse(parseDateString(endDateString));
  };

  // Helper function to parse DD-MM-YYYY formatted date string
  const parseDateString = (dateString) => {
    const [day, month, year] = dateString.split("-");
    // Month is 0-indexed in JavaScript Date, so subtract 1 from the parsed month
    return new Date(year, month - 1, day);
  };

  const handleContinue = () => {
    // Handle course selection and navigate to dashboard with selected course
    if (selectedCourse) {
      navigate("/dashboard", {
        state: {
          selectedCourse,
          startDateCourse,
          endDateCourse,
        },
      });
    } else {
      setAlertConfig({
        icon: cilWarning,
        color: "warning",
        visible: true,
        message: "Please select a course.",
      });
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Select Course</h1>
                    {alertConfig.visible && (
                      <CAlert
                        color={alertConfig.color}
                        dismissible
                        onClose={() =>
                          setAlertConfig({ ...alertConfig, visible: false })
                        }
                        className="d-flex align-items-center"
                      >
                        <CIcon
                          icon={alertConfig.icon}
                          className="flex-shrink-0 me-2"
                          width={24}
                          height={24}
                        />
                        <div>{alertConfig.message}</div>
                      </CAlert>
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormSelect
                        name="course"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                      >
                        <option value="" disabled>
                          Select a course
                        </option>
                        {availableCourses.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    <CButton
                      type="button"
                      color="primary"
                      className="px-4"
                      onClick={handleContinue}
                    >
                      Continue
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default SelectCourse;
