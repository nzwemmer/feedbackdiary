import React from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardText,
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <CRow className="justify-content-center">
      <CCol md={8}>
        <CCard className="text-white bg-primary p-4">
          <CCardBody>
            <div>
              <h1>Sign up or add courses</h1>
              <CCardText>
                You may sign up or add additional courses here if you are a
                teacher. Please have your Teacher Course Token(s) ready.
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
  );
};

export default SignUp;
