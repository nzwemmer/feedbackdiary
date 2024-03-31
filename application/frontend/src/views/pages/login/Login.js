import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CCardHeader,
  CCardText,
  CCardImage,
  CCardSubtitle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilLockLocked,
  cilUser,
  cilWarning,
  cilCheckCircle,
  cilBook,
} from "@coreui/icons";
import useToken from "src/components/authentication/useToken";
import { useEffect } from "react";
import createAxiosInstance from "src/api/axiosInstance";
import logo from "src/assets/brand/logo.png";
import CourseSelect from "src/components/authentication/CourseSelect";
import SignUp from "src/components/authentication/SignUp";
import SignIn from "src/components/authentication/SignIn";

const Login = () => {
  const { token, setToken, isTokenExpired } = useToken();
  const navigate = useNavigate(); // Create a navigate object
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startDateCourse, setStartDateCourse] = useState("");
  const [endDateCourse, setEndDateCourse] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const login = async () => {
      if (token !== null && !isTokenExpired(token)) {
        setIsLoggedIn(true);
        await fetchCourses();
      }
    };
    login();
  }, [isLoggedIn]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [alertConfig, setAlertConfig] = useState({
    icon: null,
    color: "info",
    visible: false,
    message: "error",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const axiosInstance = createAxiosInstance(token);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        const access_token = responseData.access_token;

        // Store it.
        setToken(access_token);

        // Handle successful login
        setAlertConfig({
          icon: cilCheckCircle,
          color: "success",
          visible: true,
          message: "Credentials accepted.",
        });

        setIsLoggedIn(true);
      } else {
        setAlertConfig({
          icon: cilWarning,
          color: "warning",
          visible: true,
          message: responseData.msg,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        {isLoggedIn ? (
          <CourseSelect
            alertConfig={alertConfig}
            setAlertConfig={setAlertConfig}
            selectedCourse={selectedCourse}
            handleCourseChange={handleCourseChange}
            availableCourses={availableCourses}
            handleContinue={handleContinue}
          />
        ) : (
          <>
            <SignIn
              alertConfig={alertConfig}
              setAlertConfig={setAlertConfig}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              logo={logo}
            />
            <br></br>
            <SignUp />
          </>
        )}
      </CContainer>
    </div>
  );
};

export default Login;
