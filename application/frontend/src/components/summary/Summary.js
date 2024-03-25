import React from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CCardSubtitle,
  CSpinner,
  CListGroup,
  CButton,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilReload,
  cilThumbUp,
  cilThumbDown,
  cilCommentBubble,
} from "@coreui/icons";

const Summary = ({
  loadingSummary,
  setLoadingSummary,
  summaryData,
  setSummaryData,
  fetchDataUpdate,
  selectedCourse,
}) => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <CCardTitle>
              {" "}
              A.I. Overall summary per sentiment
              <CButton
                color="primary"
                className={`float-end${loadingSummary ? " disabled" : ""}`}
                onClick={() =>
                  fetchDataUpdate(
                    "/api/load/summary",
                    setLoadingSummary,
                    setSummaryData,
                    {
                      course: selectedCourse,
                    }
                  )
                }
              >
                <CIcon icon={cilReload} />
              </CButton>
            </CCardTitle>
            <CCardSubtitle>
              {loadingSummary ? (
                <p>Peforming summarization...</p>
              ) : (
                <p>Last run: {summaryData["modify_date"]}</p>
              )}
            </CCardSubtitle>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12}>
                {["positive", "negative", "additional"].map(
                  (sentiment, index) => (
                    <CCard key={index} className="mb-4">
                      <CCardHeader
                        style={{
                          backgroundColor: getSentimentColor(sentiment),
                        }}
                      >
                        {getSentimentIcon(sentiment)} &nbsp;{" "}
                        {capitalizeFirstLetter(sentiment)}
                      </CCardHeader>
                      <CCardBody>
                        <CListGroup>
                          {loadingSummary ? (
                            // Display a loading message while data is being fetched
                            <div className="d-flex align-items-center">
                              <strong role="status">
                                Generating {sentiment} entries summary...
                              </strong>
                              <CSpinner className="ms-auto" />
                            </div>
                          ) : summaryData &&
                            summaryData["data"] &&
                            summaryData["data"][`${sentiment}_summary`] ? (
                            summaryData["data"][`${sentiment}_summary`]
                          ) : (
                            <div>No {sentiment} summary available.</div>
                          )}
                        </CListGroup>
                      </CCardBody>
                    </CCard>
                  )
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

// Helper functions
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getSentimentIcon = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return <CIcon icon={cilThumbUp} />;
    case "negative":
      return <CIcon icon={cilThumbDown} />;
    case "additional":
      return <CIcon icon={cilCommentBubble} />;
    default:
      return null;
  }
};

const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return "#2eb85c";
    case "negative":
      return "#e55353";
    case "additional":
      return "#a17de0";
    default:
      return null;
  }
};

export default Summary;
