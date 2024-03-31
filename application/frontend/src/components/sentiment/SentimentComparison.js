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
          <CCardTitle>Overall Entry Sentiment Comparison</CCardTitle>
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
                Student provided Overall Entry Sentiment, compared to Framework
                determined Overall Entry Sentiment.
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
                      {student.data && student.data["very positive"]}
                    </CListGroupItem>
                    <CListGroupItem>
                      {student.data && student.data["positive"]}
                    </CListGroupItem>
                    <CListGroupItem>
                      {student.data && student.data["neutral"]}
                    </CListGroupItem>
                    <CListGroupItem>
                      {student.data && student.data["negative"]}
                    </CListGroupItem>
                    <CListGroupItem>
                      {student.data && student.data["very negative"]}
                    </CListGroupItem>
                  </CListGroup>
                </CCol>
                <CCol xs={4}>
                  <CListGroup>
                    <CListGroupItem>Framework</CListGroupItem>
                    <CListGroupItem>
                      {ai.data && ai.data["very positive"]}
                    </CListGroupItem>
                    <CListGroupItem>
                      {ai.data && ai.data["positive"]}
                    </CListGroupItem>
                    <CListGroupItem>
                      {ai.data && ai.data["neutral"]}
                    </CListGroupItem>
                    <CListGroupItem>
                      {ai.data && ai.data["negative"]}
                    </CListGroupItem>
                    <CListGroupItem>
                      {ai.data && ai.data["very negative"]}
                    </CListGroupItem>
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
