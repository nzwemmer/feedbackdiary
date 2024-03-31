import React, { useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CCardGroup,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBook } from "@coreui/icons";

const CourseSelect = ({
  alertConfig,
  setAlertConfig,
  selectedCourse,
  handleCourseChange,
  availableCourses,
  handleContinue,
}) => {
  return (
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
  );
};

export default CourseSelect;
