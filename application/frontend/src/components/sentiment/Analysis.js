import React from "react";
import Visualization from "./Visualization";
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
    <>
      <Visualization
        loadingRadarChartAI={loadingRadarChartAI}
        loadingRadarChartStudent={loadingRadarChartStudent}
        radarChartAIData={radarChartAIData}
        radarChartStudentData={radarChartStudentData}
        fetchDataUpdate={fetchDataUpdate}
        selectedCourse={selectedCourse}
        setLoadingRadarChartAI={setLoadingRadarChartAI}
        setLoadingRadarChartStudent={setLoadingRadarChartStudent}
        setRadarChartDataStudent={setRadarChartDataStudent}
        setRadarChartDataAI={setRadarChartDataAI}
      />
      <Statistics
        loadingRadarChartAI={loadingRadarChartAI}
        radarChartStudentData={radarChartStudentData}
        radarChartAIData={radarChartAIData}
      />
    </>
  );
};

export default Analysis;
