import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCardText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilLockLocked,
  cilWarning,
  cilCheckCircle,
  cilFingerprint,
} from "@coreui/icons";
import useToken from "src/components/authentication/useToken";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CAlert } from "@coreui/react";

const Register = () => {
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  {
    /* useEffect checks if already logged in. If true, go to dashboard. */
  }
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []); // The empty array means this effect runs only on component mount

  const [formData, setFormData] = useState({
    course_token: "",
    email: "",
    password: "",
    password_verify: "",
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json(); // Assuming the response is JSON

      if (response.ok) {
        // Handle successful login
        setAlertConfig({
          icon: cilCheckCircle,
          color: "success",
          visible: true,
          message: responseData.msg,
        });

        // Access the access_token
        const access_token = responseData.access_token;

        // Store it.
        setToken(access_token);

        // Delay the redirect for 2 seconds (2000 milliseconds)
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setAlertConfig({
          icon: cilWarning,
          color: "warning",
          visible: true,
          message: responseData.msg,
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Registration</h1>

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
                  <CCardText>
                    You need to use the Teacher Course Token (TCT) provided for
                    your course.
                    <br></br>
                    If you teach multiple courses, separate each TCT with a ;
                    (semicolon). If you already own an account, the new
                    course(s) will be added to it.
                    <br></br>
                    <br></br>
                    Don't have a TCT? Please contact: n.j.zwemmer@uva.nl
                  </CCardText>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilFingerprint} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      name="course_token"
                      placeholder="TCT(s) example: TCT1;TCT2;TCT3 or TCT1"
                      value={formData.course_token}
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="text"
                      name="email"
                      placeholder="E-mail"
                      value={formData.email}
                      autoComplete="email"
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      autoComplete="new-password"
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="password_verify"
                      placeholder="Repeat password"
                      value={formData.password_verify}
                      autoComplete="new-password"
                      onChange={handleInputChange}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="primary" className="px-4">
                      {/* <CButton color="success">Create Account</CButton> */}
                      Register
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
