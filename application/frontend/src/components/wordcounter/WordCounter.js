import React from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CButton,
  CBadge,
  CSpinner,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
  cilReload,
  cilThumbUp,
  cilThumbDown,
  cilChatBubble,
  cilCommentBubble,
} from "@coreui/icons";

const WordCounter = ({
  loadingWords,
  setLoadingWords,
  wordsData,
  setWordsData,
  fetchDataUpdate,
  selectedCourse,
  language,
}) => {
  const renderSentimentList = (sentimentType, color) => {
    const data =
      wordsData && wordsData[language] && wordsData[language][sentimentType];

    return (
      <CCol xs={3}>
        <CCard className="mb-4">
          <CCardHeader style={{ backgroundColor: color }}>
            <CIcon icon={getSentimentIcon(sentimentType)} /> &nbsp;{" "}
            {capitalizeFirstLetter(sentimentType)}
          </CCardHeader>
          <CCardBody>
            <CListGroup>
              {loadingWords ? (
                <div className="d-flex align-items-center">
                  <strong role="status">Recalculating...</strong>
                  <CSpinner className="ms-auto" />
                </div>
              ) : data && data.length === 0 ? (
                <>Empty</>
              ) : (
                data.map((item, index) => (
                  <CListGroupItem
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {item[0]}{" "}
                    <CBadge color="primary" shape="rounded-pill">
                      {item[1]}{" "}
                    </CBadge>
                  </CListGroupItem>
                ))
              )}
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    );
  };

  const getSentimentIcon = (sentimentType) => {
    switch (sentimentType) {
      case "positive":
        return cilThumbUp;
      case "negative":
        return cilThumbDown;
      case "additional":
        return cilCommentBubble;
      case "combined":
        return cilChatBubble;
      default:
        return null;
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <CCardTitle>
              {capitalizeFirstLetter(language)} Frequent Word Counter
              <CButton
                color="primary"
                className={`float-end${loadingWords ? " disabled" : ""}`}
                onClick={() =>
                  fetchDataUpdate(
                    "/api/load/labels",
                    setLoadingWords,
                    setWordsData,
                    {
                      course: selectedCourse,
                    }
                  )
                }
              >
                <CIcon icon={cilReload} />
              </CButton>
            </CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {renderSentimentList("positive", "#2eb85c")}
              {renderSentimentList("negative", "#e55353")}
              {renderSentimentList("additional", "#a17de0")}
              {renderSentimentList("combined", "#39f")}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default WordCounter;
