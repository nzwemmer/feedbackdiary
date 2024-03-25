import React from "react";
import {
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CRow,
  CSpinner,
} from "@coreui/react";

const SentimentComparison = ({ student, ai, loadingRadarChartAI }) => {
  return (
    <CCol xs={6}>
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle>
            Student Provided vs A.I. Determined Sentiments
          </CCardTitle>
        </CCardHeader>

        <CCardBody>
          {loadingRadarChartAI ? (
            // Display a loading message while data is being fetched
            <div className="d-flex align-items-center">
              <strong role="status">Don't leave yet...</strong>
              <CSpinner className="ms-auto" />
            </div>
          ) : (
            <>
              <CCardText>
                Student provided overall sentiment per diary entry, compared to
                A.I. determined sentiment per diary entry.
              </CCardText>
              <CRow>
                <CCol xs={4}>
                  <CListGroup>
                    <CListGroupItem>Sentiment</CListGroupItem>
                    <CListGroupItem>Very Positive</CListGroupItem>
                    <CListGroupItem>Positive</CListGroupItem>
                    <CListGroupItem>Neutral</CListGroupItem>
                    <CListGroupItem>Negative</CListGroupItem>
                    <CListGroupItem>Very Negative</CListGroupItem>
                  </CListGroup>
                </CCol>
                <CCol xs={4}>
                  <CListGroup>
                    <CListGroupItem>Student</CListGroupItem>
                    <CListGroupItem>
                      {student.data["very positive"]}
                    </CListGroupItem>
                    <CListGroupItem>{student.data["positive"]}</CListGroupItem>
                    <CListGroupItem>{student.data["neutral"]}</CListGroupItem>
                    <CListGroupItem>{student.data["negative"]}</CListGroupItem>
                    <CListGroupItem>
                      {student.data["very negative"]}
                    </CListGroupItem>
                  </CListGroup>
                </CCol>
                <CCol xs={4}>
                  <CListGroup>
                    <CListGroupItem>A.I.</CListGroupItem>
                    <CListGroupItem>{ai.data["very positive"]}</CListGroupItem>
                    <CListGroupItem>{ai.data["positive"]}</CListGroupItem>
                    <CListGroupItem>{ai.data["neutral"]}</CListGroupItem>
                    <CListGroupItem>{ai.data["negative"]}</CListGroupItem>
                    <CListGroupItem>{ai.data["very negative"]}</CListGroupItem>
                  </CListGroup>
                </CCol>
              </CRow>
            </>
          )}
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default SentimentComparison;
