import React from "react";

import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CListGroup,
  CCardSubtitle,
  CCardText,
  CListGroupItem,
  CSpinner,
} from "@coreui/react";

import ModelAccuracy from "./ModelAccuracy";
import ToolAccuracy from "./ToolAccuracy";
import SentimentComparison from "./SentimentComparison";
import OverallAccuracy from "./OverallAccuracy";

const Statistics = ({
  loadingRadarChartAI,
  radarChartAIData,
  radarChartStudentData,
}) => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CCardTitle>Sentiment Analysis Statistics</CCardTitle>

            <CCardSubtitle>
              {loadingRadarChartAI ? (
                <>Performing sentiment analysis...</>
              ) : (
                <>Last run: {radarChartAIData["modify_date_ai"]}</>
              )}
            </CCardSubtitle>
          </CCardHeader>

          <CCardBody>
            <CRow>
              <SentimentComparison
                student={radarChartStudentData}
                ai={radarChartAIData}
                loadingRadarChartAI={loadingRadarChartAI}
              />
              <OverallAccuracy
                ai={radarChartAIData.accuracy}
                loadingRadarChartAI={loadingRadarChartAI}
              />
            </CRow>
            <CRow>
              <ModelAccuracy
                sa={radarChartAIData.accuracy}
                loadingRadarChartAI={loadingRadarChartAI}
              />
              <ToolAccuracy
                sa={radarChartAIData.accuracy}
                loadingRadarChartAI={loadingRadarChartAI}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Statistics;
