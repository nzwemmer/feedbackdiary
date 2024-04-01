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

const ModelAccuracy = ({ sa, loadingRadarChartAI }) => {
  return (
    <CCol xs={6}>
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle> Model Accuracies</CCardTitle>
        </CCardHeader>

        <CCardBody>
          {loadingRadarChartAI ? (
            // Display a loading message while data is being fetched
            <div className="d-flex align-items-center">
              <strong role="status">This won't take long...</strong>
              <CSpinner className="ms-auto" />
            </div>
          ) : (
            <>
              <CCardText>
                Weighted Accuracy for each SA model on positive, negative, and
                additional comment categories. This means all comments for each
                category, determined correctly by each model.
              </CCardText>
              <CRow>
                <CCol xs={3}>
                  <CListGroup>
                    <CListGroupItem>Model name</CListGroupItem>
                    {Object.keys(sa.models).map((key) => (
                      <CListGroupItem key={key}>{key}</CListGroupItem>
                    ))}
                  </CListGroup>
                </CCol>
                <CCol xs={3}>
                  <CListGroup>
                    <CListGroupItem>Positive</CListGroupItem>
                    {Object.keys(sa.models).map((key) => (
                      <CListGroupItem key={key}>
                        {(sa.models[key].pos * 100).toFixed(0)}%
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCol>
                <CCol xs={3}>
                  <CListGroup>
                    <CListGroupItem>Negative</CListGroupItem>
                    {Object.keys(sa.models).map((key) => (
                      <CListGroupItem key={key}>
                        {(sa.models[key].neg * 100).toFixed(0)}%
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCol>
                <CCol xs={3}>
                  <CListGroup>
                    <CListGroupItem>Additional</CListGroupItem>
                    {Object.keys(sa.models).map((key) => (
                      <CListGroupItem key={key}>
                        {(sa.models[key].add * 100).toFixed(0)}%
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

export default ModelAccuracy;
