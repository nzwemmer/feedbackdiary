import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation

// Third-party libraries
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardSubtitle,
  CCardTitle,
  CCol,
  CRow,
  CSpinner,
} from "@coreui/react";

// Core UI icons
import CIcon from "@coreui/icons-react";

import { cilReload } from "@coreui/icons";

// Local components and utilities
import RadarChart from "src/components/sentiment/RadarChart";
import Statistics from "src/components/sentiment/Statistics";
import BarChart from "src/components/sentiment/BarChart";
import Summary from "src/components/sentiment/Summary";
import WordCounter from "src/components/sentiment/WordCounter";
import createAxiosInstance from "src/api/axiosInstance";
import useToken from "src/components/authentication/useToken";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object

  const [loadingWords, setLoadingWords] = useState(true);
  const [loadingRadarChartStudent, setLoadingRadarChartStudent] = useState(
    true
  );
  const [loadingRadarChartAI, setLoadingRadarChartAI] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [chartLabels, setChartLabels] = useState([]);

  // Access the selectedCourse from the state
  const selectedCourse = location.state?.selectedCourse;
  const startDateCourse = location.state?.startDateCourse;
  const endDateCourse = location.state?.endDateCourse;
  const { token, setToken, isTokenExpired } = useToken();

  const [radarChartAIData, setRadarChartDataAI] = useState([]); // State to hold radarchart data for AI
  const [radarChartStudentData, setRadarChartDataStudent] = useState([]); // State to hold radarchart data for Students

  const [chartData, setChartData] = useState({}); // State to hold chart data
  const [wordsData, setWordsData] = useState([]); // State to hold words data
  const [summaryData, setSummaryData] = useState([]); // State to hold summary data

  // For using the correct label type in chart.
  const [timeFrame, setTimeFrame] = useState("Today"); // State to hold the selected time frame
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const formatDate = (date) => {
    if (!date) {
      // Handle the case where date is null or undefined
      const currentDate = new Date();
      return `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;
    }

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);
  };

  const calculateDateRange = (timeFrame) => {
    const currentDate = new Date(); // Get the current date
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDayOfWeek = currentDate.getDay();

    // Calculate the difference between the current day and the first day of the week (Monday)
    const daysSinceMonday = (currentDayOfWeek - 1 + 7) % 7;

    let start, end;

    switch (timeFrame) {
      case "Today":
        // For "Today," use the current date as both start and end date
        start = new Date(); // Initialize start date
        end = new Date(); // Initialize end date
        break;
      case "This Week":
        // Calculate the start date by subtracting the days since Monday
        start = new Date(currentDate);
        start.setDate(currentDate.getDate() - daysSinceMonday);

        // Calculate the end date by adding the remaining days until Sunday
        const remainingDays = 6 - daysSinceMonday;
        end = new Date(currentDate);
        end.setDate(currentDate.getDate() + remainingDays);
        break;
      case "This Month":
        // Create separate objects to avoid modifying the same object
        start = new Date(currentDate);
        start.setDate(1); // Calculate the start date as the first day of the current month

        end = new Date(currentDate);
        end.setMonth(currentDate.getMonth() + 1, 0); // Calculate the end date as the last day of the current month
        break;
      case "This Course":
        start = startDateCourse;
        end = endDateCourse;
        break;
      default:
        start = startDate;
        end = endDate;
        break;
    }

    // Set the state or use the formatted dates as needed
    setStartDate(start);
    setEndDate(end);
  };

  // Create an axios instance with the token
  const axiosInstance = createAxiosInstance(token);

  const fetchDataPost = (
    url,
    setWhichLoading,
    setWhichData,
    argumentsParsed
  ) => {
    setWhichLoading(true);
    setToken(token); // Re-enable token fully.

    axiosInstance
      .post(url, argumentsParsed) // Use the relative API endpoint
      .then((response) => {
        if (setWhichData) {
          setWhichData(response.data);
        }
        setWhichLoading(false);
      })
      .catch((error) => {
        setWhichLoading(false);

        if (error.response.status === 401) {
          // Handle 401 Unauthorized, navigate to logout page
          console.error("Session expired. Logging out.");
          navigate("/logout");
        }
      });
  };

  const fetchDataUpdate = (
    url,
    setWhichLoading,
    setWhichData,
    argumentsParsed
  ) => {
    setWhichLoading(true);
    setToken(token); // Re-enable token fully.
    axiosInstance
      .put(url, argumentsParsed) // Use the relative API endpoint and pass updateArguments directly
      .then((response) => {
        setWhichData(response.data);
        setWhichLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setWhichLoading(false);

        if (error.response.status === 401) {
          // Handle 401 Unauthorized, navigate to logout page
          console.error("Session expired. Logging out.");
          navigate("/logout");
        }
      });
  };

  const fetchChartData = (url, setWhichLoading, setWhichData) => {
    setWhichLoading(true);
    setToken(token); // Re-enable token fully.

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    axiosInstance
      .post(url, { selectedCourse, formattedStartDate, formattedEndDate }) // Use the relative API endpoint
      .then((response) => {
        setWhichData(response.data);
        setWhichLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setWhichLoading(false);

        if (error.response.status === 401) {
          // Handle 401 Unauthorized, navigate to logout page
          console.error("Session expired. Logging out.");
          navigate("/logout");
        }
      });
  };

  const generateLabels = (startDate, endDate) => {
    const labels = [];

    const addZeroPadding = (number) =>
      number < 10 ? `0${number}` : `${number}`;

    const addHourlyLabels = () => {
      for (let i = 0; i < 24; i++) {
        labels.push(`${addZeroPadding(i)}:00`);
      }
    };

    const addDailyLabels = () => {
      const currentDay = new Date(startDate);

      while (currentDay <= endDate) {
        const formattedDate = `${addZeroPadding(
          currentDay.getDate()
        )}/${addZeroPadding(currentDay.getMonth() + 1)}`;
        labels.push(formattedDate);

        currentDay.setDate(currentDay.getDate() + 1);
      }
    };

    if (startDate && endDate) {
      switch (true) {
        case startDate.getDate() === endDate.getDate() &&
          startDate.getMonth() === endDate.getMonth() &&
          startDate.getFullYear() === endDate.getFullYear():
          addHourlyLabels();
          break;
        default:
          addDailyLabels();
          break;
      }
    }
    return labels;
  };

  // Fetch data and update chart data
  useEffect(() => {
    if (!selectedCourse) {
      navigate("/login");
    }

    const checkTokenExpiration = () => {
      if (token && isTokenExpired(token)) {
        // Token has expired; log out the user
        navigate("/logout");
        return;
      }
    };

    fetchDataPost(
      "/api/load/sentiment",
      setLoadingRadarChartStudent,
      setRadarChartDataStudent,
      { type: "Student", course: selectedCourse }
    );

    fetchDataPost(
      "/api/load/sentiment",
      setLoadingRadarChartAI,
      setRadarChartDataAI,
      { type: "AI", course: selectedCourse }
    );

    fetchDataPost("/api/load/labels", setLoadingWords, setWordsData, {
      course: selectedCourse,
    });

    fetchDataPost("/api/load/summary", setLoadingSummary, setSummaryData, {
      course: selectedCourse,
    });

    const intervalId = setInterval(checkTokenExpiration, 60000); // 1 minute interval
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []); // Empty dependency array to ensure the effect runs only once on component mount

  useEffect(() => {
    // Get the start and end dates based on the selected time frame
    calculateDateRange(timeFrame);
  }, [timeFrame]);

  useEffect(() => {
    // Now you can use the startDate and endDate to fetch the data for the selected time frame
    fetchChartData(
      "/api/load/sentiment/overtime",
      setLoadingChart,
      setChartData
    );
    // Generate labels based on the selected time frame
    setChartLabels(generateLabels(startDate, endDate));
  }, [endDate]);

  const resetTimeFrame = () => {
    setTimeFrame(null);
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CCardTitle>Sentiment over time for {selectedCourse}</CCardTitle>
              <CCardSubtitle>
                {loadingChart ? (
                  <p>Loading ...</p>
                ) : (
                  <p>Total entries for this range: {chartData["combined"]} </p>
                )}
              </CCardSubtitle>
            </CCardHeader>
            <CCardBody>
              <CCol sm={8} className="d-none d-md-block">
                <CButton
                  color="primary"
                  className="float-end"
                  onClick={() =>
                    fetchDataPost("/api/download/entries", setLoadingChart)
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
                        onClick={() => setTimeFrame(value)} // Update the timeFrame state on button click
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
                  // inline NOTE: Can be used to have a calendar always visible.
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
      <Summary
        loadingSummary={loadingSummary}
        setLoadingSummary={setLoadingSummary}
        setSummaryData={setSummaryData}
        summaryData={summaryData}
        fetchDataUpdate={fetchDataUpdate}
        selectedCourse={selectedCourse}
      />
      <div style={{ marginTop: `2%` }}></div>
      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <CCardTitle>
                {" "}
                Overall sentiment by students
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
              <CCardSubtitle>
                {loadingRadarChartStudent ? (
                  <>Filtering data... calculating...</>
                ) : (
                  <>Last run: {radarChartStudentData["modify_date_student"]}</>
                )}
              </CCardSubtitle>
            </CCardHeader>
            <CCardBody>
              {loadingRadarChartStudent ? (
                <div className="d-flex align-items-center">
                  <strong role="status">This might take a while...</strong>
                  <CSpinner className="ms-auto" />
                </div>
              ) : (
                <RadarChart radarChartDataFetched={radarChartStudentData} />
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
              <CCardSubtitle>
                {loadingRadarChartAI ? (
                  <>Performing sentiment analysis...</>
                ) : (
                  <>Last run: {radarChartAIData["modify_date_ai"]}</>
                )}
              </CCardSubtitle>
            </CCardHeader>

            <CCardBody>
              {loadingRadarChartAI ? (
                // Display a loading message while data is being fetched
                <div className="d-flex align-items-center">
                  <strong role="status">This might take a while...</strong>
                  <CSpinner className="ms-auto" />
                </div>
              ) : (
                <RadarChart radarChartDataFetched={radarChartAIData} />
              )}
            </CCardBody>
          </CCard>
        </CCol>

        <Statistics
          loadingRadarChartAI={loadingRadarChartAI}
          radarChartStudentData={radarChartStudentData}
          radarChartAIData={radarChartAIData}
        />
      </CRow>
      <WordCounter
        loadingWords={loadingWords}
        setLoadingWords={setLoadingWords}
        setWordsData={setWordsData}
        wordsData={wordsData}
        fetchDataUpdate={fetchDataUpdate}
        selectedCourse={selectedCourse}
        language="dutch"
      />
      <div style={{ marginTop: `2%` }}></div>
      <WordCounter
        loadingWords={loadingWords}
        setLoadingWords={setLoadingWords}
        setWordsData={setWordsData}
        wordsData={wordsData}
        fetchDataUpdate={fetchDataUpdate}
        selectedCourse={selectedCourse}
        language="english"
      />
      <div style={{ marginTop: `2%` }}></div>
    </>
  );
};

export default Dashboard;
