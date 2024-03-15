import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilLockLocked,
  cilUser,
  cilWarning,
  cilCheckCircle,
} from "@coreui/icons";
import useToken from "src/components/authentication/useToken";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ChangePassword = () => {
  const { reset_token: resetToken, email: email } = useParams();
  console.log("Testing 1234");
  const { token, setToken } = useToken();
  const navigate = useNavigate(); // Create a navigate object

  {
    /* useEffect checks if already logged in. If true, go to dashboard. */
  }
  useEffect(() => {
    console.log("This does not work.");
    if (token) {
      navigate("/dashboard");
    } else {
      setFormData({
        ...formData,
        reset_token: resetToken,
        email: email,
      });
    }
  }, [resetToken]);

  const [formData, setFormData] = useState({
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
      const response = await fetch("/api/changepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json(); // Assuming the response is JSON

      if (response.ok) {
        // Handle successful password change
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
      console.error("Error during password change:", error);
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
                  <CForm onSubmit={handleSubmit}>
                    <h1>Change password</h1>
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
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Change
                        </CButton>
                      </CCol>
                    </CRow>
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

export default ChangePassword;
