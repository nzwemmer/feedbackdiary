import React from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardSubtitle,
  CButton,
  CButtonGroup,
  CSpinner,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilReload } from "@coreui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BarChart from "./Charts/BarChart";
import { useState } from "react";

const OverTime = ({
  loadingChart,
  chartData,
  chartLabels,
  timeFrame,
  setTimeFrame,
  setLoadingChart,
  startDate,
  endDate,
  handleDateChange,
  resetTimeFrame,
  fetchDataPost,
  selectedCourse,
}) => {
  const [downloadingEntries, setDownloadingEntries] = useState(false);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CCardTitle>Sentiment Over Time for {selectedCourse}</CCardTitle>
            <CCardSubtitle>
              <div className="d-flex align-items-center">
                <strong role="status">
                  {loadingChart || downloadingEntries ? (
                    <>
                      {downloadingEntries
                        ? "Downloading entries from Diary Dashboard..."
                        : "Loading ..."}
                    </>
                  ) : (
                    `Total entries for this range: ${chartData["combined"]}`
                  )}
                </strong>
                {loadingChart ||
                  (downloadingEntries && <CSpinner className="ms-auto" />)}
              </div>
            </CCardSubtitle>
          </CCardHeader>
          <CCardBody>
            <CCol sm={8} className="d-none d-md-block">
              <CButton
                color="primary"
                className="float-end"
                onClick={() =>
                  fetchDataPost("/api/download/entries", setDownloadingEntries)
                }
              >
                <CIcon icon={cilReload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {["Today", "This Week", "This Month", "This Course"].map(
                  (value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      active={timeFrame === value}
                      onClick={() => setTimeFrame(value)}
                    >
                      {value}
                    </CButton>
                  )
                )}
              </CButtonGroup>
            </CCol>
            <CCol sm={12}>
              <DatePicker
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                selectsRange
                dateFormat="dd/MM/yyyy"
                onFocus={resetTimeFrame}
              />
              <div className="small text-medium-emphasis"></div>
            </CCol>
            <BarChart
              chartLabels={chartLabels}
              chartData={chartData}
              loadingChart={loadingChart}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default OverTime;
