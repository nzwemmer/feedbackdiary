import React from "react";
import { CChartBar } from "@coreui/react-chartjs";
import { hexToRgba, getStyle } from "@coreui/utils";

// Helper function to sort timestamps
const sortTimestamps = (timestamps) => {
  const sortedKeys = Object.keys(timestamps).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("/");
    const [dayB, monthB, yearB] = b.split("/");

    // Creating Date objects with the correct format (DD/MM/YYYY)
    const dateA = new Date(`${monthA}/${dayA}/${yearA}`);
    const dateB = new Date(`${monthB}/${dayB}/${yearB}`);

    return dateA.getTime() - dateB.getTime();
  });

  return sortedKeys.map((key) => [key, timestamps[key]]);
};

const BarChart = ({ chartLabels, chartData, loadingChart }) => {
  // Helper function to render chart datasets
  const renderDataset = (label, backgroundColor, borderColor, dataKey) => {
    const sortedData = chartData[dataKey]
      ? sortTimestamps(chartData[dataKey])
      : [];
    return {
      label: label,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      hoverBackgroundColor: borderColor,
      borderWidth: 2,
      fill: true,
      data: sortedData.map(([timestamp, value]) => value),
    };
  };

  return (
    <CChartBar
      style={{ height: "300px", marginTop: "40px" }}
      data={{
        labels: chartLabels,
        datasets: [
          renderDataset(
            "Very Negative",
            hexToRgba(getStyle("--cui-danger"), 10),
            getStyle("--cui-danger"),
            "very negative"
          ),
          renderDataset(
            "Negative",
            "transparent",
            getStyle("--cui-warning"),
            "negative"
          ),
          renderDataset(
            "Neutral",
            hexToRgba(getStyle("--cui-black"), 10),
            getStyle("--cui-black"),
            "neutral"
          ),
          renderDataset(
            "Positive",
            hexToRgba(getStyle("--cui-success"), 10),
            getStyle("--cui-success"),
            "positive"
          ),
          renderDataset(
            "Very Positive",
            hexToRgba(getStyle("--cui-primary"), 10),
            getStyle("--cui-primary"),
            "very positive"
          ),
        ],
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          x: {
            grid: {
              drawOnChartArea: false,
              maxTicksLimit: 200,
            },
          },
          y: {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 20,
              stepSize: Math.ceil(250 / 5),
              max: 250,
            },
          },
        },
        elements: {
          bar: {
            borderRadius: 4,
          },
        },
      }}
    />
  );
};

export default BarChart;
