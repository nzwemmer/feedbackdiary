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
                          <CIcon icon={cilBook} />
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
        ) : (
          <>
            <CRow className="justify-content-center">
              <CCol md={8}>
                <CCardGroup>
                  <CCard className="p-4">
                    <CCardHeader>
                      <CCardTitle>Welcome to Feedbackdiary</CCardTitle>
                      <CCardSubtitle>Feedback Dashboard</CCardSubtitle>
                    </CCardHeader>
                    <CCardBody>
                      <CForm onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        <br></br>
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
                          <CFormInput
                            type="text"
                            name="email"
                            placeholder="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                        </CInputGroup>
                        <CRow>
                          <CCol xs={9}>
                            <CButton
                              type="submit"
                              color="primary"
                              className="px-4"
                            >
                              Login
                            </CButton>
                          </CCol>
                          <br></br>
                          <br></br>
                          <br></br>
                          <CRow>
                            <CCol xs={6} className="text-right">
                              <CButton
                                href="/changepasswordrequest"
                                color="link"
                                className="px-0"
                              >
                                Forgot password?
                              </CButton>
                            </CCol>
                          </CRow>
                        </CRow>
                      </CForm>
                    </CCardBody>
                  </CCard>
                  <CCard className="p-4">
                    <CCardBody>
                      <CCardImage orientation="top" src={logo}></CCardImage>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
            <br></br>
            <CRow className="justify-content-center">
              <CCol md={8}>
                <CCard className="text-white bg-primary p-4">
                  <CCardBody>
                    <div>
                      <h1>Sign up or add courses</h1>
                      <CCardText>
                        You may sign up or add additional courses here if you
                        are a teacher. Please have your Teacher Course Token(s)
                        ready.
                      </CCardText>
                      <CCol xs={9}>
                        <Link to="/register">
                          <CButton
                            color="primary"
                            className="mt-3"
                            active
                            tabIndex={-1}
                          >
                            Proceed
                          </CButton>
                        </Link>
                      </CCol>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </>
        )}
      </CContainer>
    </div>
  );
};

export default Login;
