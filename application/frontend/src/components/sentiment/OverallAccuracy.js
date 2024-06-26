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

const OverallAccuracy = ({ ai, loadingRadarChartAI }) => {
  return (
    <CCol xs={6}>
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle>Framework Accuracy</CCardTitle>
        </CCardHeader>

        <CCardBody>
          {loadingRadarChartAI ? (
            // Display a loading message while data is being fetched
            <div className="d-flex align-items-center">
              <strong role="status">Almost done...</strong>
              <CSpinner className="ms-auto" />
            </div>
          ) : (
            <>
              <CCardText>
                Weighted Accuracy for entire Framework on positive, negative,
                and additional comment categories. This means all comments for
                each category, determined correctly by the average of all models
                and tools.
              </CCardText>
              <CRow>
                <CCol xs={9}>
                  <CListGroup>
                    <CListGroupItem>Condition</CListGroupItem>
                    <CListGroupItem>Positive comment category</CListGroupItem>
                    <CListGroupItem>Negative comment category</CListGroupItem>
                    <CListGroupItem>Additional comment category</CListGroupItem>
                    <CListGroupItem>OES determined correctly</CListGroupItem>
                  </CListGroup>
                </CCol>
                <CCol xs={3}>
                  <CListGroup>
                    <CListGroupItem>W. Accuracy</CListGroupItem>

                    <CListGroupItem>
                      {(ai.pos * 100).toFixed(0)}%
                    </CListGroupItem>
                    <CListGroupItem>
                      {(ai.neg * 100).toFixed(0)}%
                    </CListGroupItem>
                    <CListGroupItem>
                      {(ai.add * 100).toFixed(0)}%
                    </CListGroupItem>
                    <CListGroupItem>
                      {(ai.entry * 100).toFixed(0)}%
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

export default OverallAccuracy;
