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

const ToolAccuracy = ({ sa, loadingRadarChartAI }) => {
  return (
    <CCol xs={6}>
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle>Sentiment Analysis Tool Accuracies</CCardTitle>
        </CCardHeader>

        <CCardBody>
          {loadingRadarChartAI ? (
            // Display a loading message while data is being fetched
            <div className="d-flex align-items-center">
              <strong role="status">Please don't refresh the page...</strong>
              <CSpinner className="ms-auto" />
            </div>
          ) : (
            <>
              <CCardText>
                Weighted Accuracy for each SA Tool on positive, negative, and
                additional comment categories. This means all comments for each
                category, determined correctly by each tool.
              </CCardText>
              <CRow>
                <CCol xs={3}>
                  <CListGroup>
                    <CListGroupItem>Tool name</CListGroupItem>
                    {Object.keys(sa.tools).map((key) => (
                      <CListGroupItem key={key}>{key}</CListGroupItem>
                    ))}
                  </CListGroup>
                </CCol>
                <CCol xs={3}>
                  <CListGroup>
                    <CListGroupItem>Positive</CListGroupItem>
                    {Object.keys(sa.tools).map((key) => (
                      <CListGroupItem key={key}>
                        {(sa.tools[key].pos * 100).toFixed(0)}%
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCol>
                <CCol xs={3}>
                  <CListGroup>
                    <CListGroupItem>Negative</CListGroupItem>
                    {Object.keys(sa.tools).map((key) => (
                      <CListGroupItem key={key}>
                        {(sa.tools[key].neg * 100).toFixed(0)}%
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCol>
                <CCol xs={3}>
                  <CListGroup>
                    <CListGroupItem>Additional</CListGroupItem>
                    {Object.keys(sa.tools).map((key) => (
                      <CListGroupItem key={key}>
                        {(sa.tools[key].add * 100).toFixed(0)}%
                      </CListGroupItem>
                    ))}
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

export default ToolAccuracy;
