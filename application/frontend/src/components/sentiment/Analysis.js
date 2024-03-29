import React from "react";
import {
  CCol,
  CCard,
  CRow,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardSubtitle,
  CButton,
  CSpinner,
} from "@coreui/react";
import { cilReload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import RadarChart from "./Charts/RadarChart";
import Statistics from "./Statistics";

const Analysis = ({
  loadingRadarChartAI,
  loadingRadarChartStudent,
  radarChartAIData,
  radarChartStudentData,
  fetchDataUpdate,
  selectedCourse,
  setLoadingRadarChartAI,
  setLoadingRadarChartStudent,
  setRadarChartDataStudent,
  setRadarChartDataAI,
}) => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CCardTitle>Sentiment Analysis visualization</CCardTitle>

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
              <CCol xs={6}>
                <CCard className="mb-4">
                  <CCardHeader>
                    <CCardTitle>
                      {" "}
                      Overall entry sentiment by students
                      <CButton
                        color="danger"
                        className={`float-end${
                          loadingRadarChartStudent ? " disabled" : ""
                        }`}
                        onClick={() =>
                          fetchDataUpdate(
                            "/api/load/sentiment",
                            setLoadingRadarChartStudent,
                            setRadarChartDataStudent,
                            { type: "Student", course: selectedCourse }
                          )
                        }
                      >
                        <CIcon icon={cilReload} />
                      </CButton>
                    </CCardTitle>
                  </CCardHeader>
                  <CCardBody>
                    {loadingRadarChartStudent ? (
                      <div className="d-flex align-items-center">
                        <strong role="status">
                          This might take a while...
                        </strong>
                        <CSpinner className="ms-auto" />
                      </div>
                    ) : (
                      <RadarChart
                        radarChartDataFetched={radarChartStudentData}
                      />
                    )}
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol xs={6}>
                <CCard className="mb-4">
                  <CCardHeader>
                    <CCardTitle>
                      {" "}
                      Sentiment Analysis results by A.I.
                      <CButton
                        color="danger"
                        className={`float-end${
                          loadingRadarChartAI ? " disabled" : ""
                        }`}
                        onClick={() =>
                          fetchDataUpdate(
                            "/api/load/sentiment",
                            setLoadingRadarChartAI,
                            setRadarChartDataAI,
                            { type: "AI", course: selectedCourse }
                          )
                        }
                      >
                        <CIcon icon={cilReload} />
                      </CButton>
                    </CCardTitle>
                  </CCardHeader>

                  <CCardBody>
                    {loadingRadarChartAI ? (
                      // Display a loading message while data is being fetched
                      <div className="d-flex align-items-center">
                        <strong role="status">
                          This might take a while...
                        </strong>
                        <CSpinner className="ms-auto" />
                      </div>
                    ) : (
                      <RadarChart radarChartDataFetched={radarChartAIData} />
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <Statistics
        loadingRadarChartAI={loadingRadarChartAI}
        radarChartStudentData={radarChartStudentData}
        radarChartAIData={radarChartAIData}
      />
    </CRow>
  );
};

export default Analysis;
