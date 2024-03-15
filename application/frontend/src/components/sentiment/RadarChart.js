import React from "react";
import { CChartRadar } from "@coreui/react-chartjs";

const RadarChart = ({ radarChartDataFetched }) => {
  if ("msg" in radarChartDataFetched) {
    return <div> No data yet. </div>;
  } else {
    const sentiment = radarChartDataFetched["data"] || {};

    const radarChartData = {
      labels: [
        "Very Negative",
        "Negative",
        "Neutral",
        "Positive",
        "Very Positive",
      ],
      datasets: [
        {
          label: "Sentiment Data",
          backgroundColor: "rgba(51, 153, 255, 1)",
          borderColor: "rgba(50, 31, 219, 1)",
          pointBackgroundColor: "rgba(50, 31, 219, 1)",
          pointBorderColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(0, 0, 255, 1)",
          data: [
            sentiment["very negative"] || 0,
            sentiment["negative"] || 0,
            sentiment["neutral"] || 0,
            sentiment["positive"] || 0,
            sentiment["very positive"] || 0,
          ],
        },
      ],
    };

    return (
      <div>
        <CChartRadar
          data={radarChartData}
          options={{
            aspectRatio: 1,
            maintainAspectRatio: true,
            scales: {
              r: {
                pointLabels: {
                  fontSize: 14,
                },
                ticks: {
                  display: false, // Remove ticks
                },
              },
            },
          }}
        />
      </div>
    );
  }
};

export default RadarChart;
