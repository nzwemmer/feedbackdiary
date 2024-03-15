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

const Statistics = ({
  loadingRadarChartAI,
  radarChartAIData,
  radarChartStudentData,
}) => {
  // Check if radarChartStudentData is defined and has the expected structure
  const isStudentDataValid =
    radarChartStudentData && radarChartStudentData.data;

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CCardTitle>Sentiment Analysis statistics</CCardTitle>

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
                      Student provided vs A.I. determined sentiments
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
                      <>
                        <CCardText>
                          Student provided overall sentiment per diary entry,
                          compared to A.I. determined sentiment per diary entry.
                        </CCardText>
                        <CRow>
                          <CCol xs={4}>
                            <CListGroup>
                              {/* Check if the necessary data is available before accessing it */}
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
                              {/* Check if the necessary data is available before accessing it */}
                              <CListGroupItem>Student</CListGroupItem>
                              {isStudentDataValid ? (
                                <>
                                  <CListGroupItem>
                                    {
                                      radarChartStudentData.data[
                                        "very positive"
                                      ]
                                    }
                                  </CListGroupItem>
                                  <CListGroupItem>
                                    {radarChartStudentData.data["positive"]}
                                  </CListGroupItem>
                                  <CListGroupItem>
                                    {radarChartStudentData.data["neutral"]}
                                  </CListGroupItem>
                                  <CListGroupItem>
                                    {radarChartStudentData.data["negative"]}
                                  </CListGroupItem>
                                  <CListGroupItem>
                                    {
                                      radarChartStudentData.data[
                                        "very negative"
                                      ]
                                    }
                                  </CListGroupItem>
                                </>
                              ) : (
                                <CListGroupItem>N/A</CListGroupItem>
                              )}
                            </CListGroup>
                          </CCol>
                          <CCol xs={4}>
                            <CListGroup>
                              {/* Check if the necessary data is available before accessing it */}
                              <CListGroupItem>A.I.</CListGroupItem>
                              <CListGroupItem>
                                {radarChartAIData.data["very positive"]}
                              </CListGroupItem>
                              <CListGroupItem>
                                {radarChartAIData.data["positive"]}
                              </CListGroupItem>
                              <CListGroupItem>
                                {radarChartAIData.data["neutral"]}
                              </CListGroupItem>
                              <CListGroupItem>
                                {radarChartAIData.data["negative"]}
                              </CListGroupItem>
                              <CListGroupItem>
                                {radarChartAIData.data["very negative"]}
                              </CListGroupItem>
                            </CListGroup>
                          </CCol>
                        </CRow>
                      </>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={6}>
                <CCard className="mb-4">
                  <CCardHeader>
                    <CCardTitle>Comment sentiment A.I. accuracy</CCardTitle>
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
                      <>
                        <CCardText>
                          Weighted accuracy of positive, negative and additional
                          message fields sentiment determination in
                          FeedbackDiary.
                        </CCardText>
                        <CRow>
                          <CCol xs={9}>
                            <CListGroup>
                              <CListGroupItem>Condition</CListGroupItem>

                              <CListGroupItem>
                                Positive comment determined '(very) positive'
                              </CListGroupItem>
                              <CListGroupItem>
                                Negative comment determined '(very) negative'
                              </CListGroupItem>
                              <CListGroupItem>
                                Additional comment determined 'neutral'
                              </CListGroupItem>
                              <CListGroupItem>
                                Overall entry sentiment determined correctly
                              </CListGroupItem>
                            </CListGroup>
                          </CCol>
                          <CCol xs={3}>
                            <CListGroup>
                              <CListGroupItem>W. Accuracy</CListGroupItem>

                              <CListGroupItem>
                                {(
                                  radarChartAIData["accuracy"]["pos"] * 100
                                ).toFixed(0)}
                                %
                              </CListGroupItem>
                              <CListGroupItem>
                                {(
                                  radarChartAIData["accuracy"]["neg"] * 100
                                ).toFixed(0)}
                                %
                              </CListGroupItem>
                              <CListGroupItem>
                                {(
                                  radarChartAIData["accuracy"]["add"] * 100
                                ).toFixed(0)}
                                %
                              </CListGroupItem>
                              <CListGroupItem>
                                {(
                                  radarChartAIData["accuracy"]["entry"] * 100
                                ).toFixed(0)}
                                %
                              </CListGroupItem>
                            </CListGroup>
                          </CCol>
                        </CRow>
                      </>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Statistics;
