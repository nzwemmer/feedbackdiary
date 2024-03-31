import React from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardSubtitle,
  CCardImage,
  CForm,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CCardGroup,
  CFormInput,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilLockLocked } from "@coreui/icons";

const SignIn = ({
  alertConfig,
  setAlertConfig,
  formData,
  handleInputChange,
  handleSubmit,
  logo,
}) => {
  return (
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
                    <CButton type="submit" color="primary" className="px-4">
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
  );
};

export default SignIn;
