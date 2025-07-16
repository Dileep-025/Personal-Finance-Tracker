const charts = {
  expensePieChart: null,
  monthlyLineChart: null,

  chartColors: [
    "#FFD166", // Yellow
    "#EF476F", // Red-Pink
    "#06D6A0", // Green
    "#118AB2", // Blue
    "#073B4C", // Dark Teal
    "#A0A0B2", // Grey
    "#FF6B6B", // Light Red
    "#4ECDC4", // Turquoise
    "#C7F4B0", // Lime Green
    "#8338EC", // Purple
  ],

  updateExpensePieChart: (transactions) => {
    const ctx = document.getElementById("expense-pie-chart").getContext("2d");
    const expenseData = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const chartLabels = Object.keys(expenseData);
    const chartValues = Object.values(expenseData);

    const backgroundColors = chartLabels.map(
      (_, index) => charts.chartColors[index % charts.chartColors.length]
    );

    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          data: chartValues,
          backgroundColor: backgroundColors,
          borderColor: "#1F1F2E",
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };

    if (charts.expensePieChart) {
      charts.expensePieChart.data = chartData;
      charts.expensePieChart.update();
    } else {
      charts.expensePieChart = new Chart(ctx, {
        type: "doughnut",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: "var(--text-primary)", // Use theme variable for better visibility
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed !== null) {
                    label += "$" + context.parsed.toFixed(2);
                  }
                  return label;
                },
              },
            },
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
    }
  },

  updateMonthlyLineChart: (transactions) => {
    const ctx = document.getElementById("monthly-line-chart").getContext("2d");
    const monthlyData = transactions.reduce((acc, t) => {
      const date = new Date(t.id); // Assuming t.id can be parsed as a date
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = { total: 0 };
      }
      acc[monthYear].total += t.amount; // Summing up all transactions for the month
      return acc;
    }, {});

    const labels = Object.keys(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA - dateB;
    });
    const dataValues = labels.map((monthYear) => monthlyData[monthYear].total);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Total Amount",
          data: dataValues,
          borderColor: "#4A90E2", // Example primary color from NeoFin theme
          backgroundColor: "rgba(74, 144, 226, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#4A90E2",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#4A90E2",
        },
      ],
    };

    if (charts.monthlyLineChart) {
      charts.monthlyLineChart.data = chartData;
      charts.monthlyLineChart.update();
    } else {
      charts.monthlyLineChart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#A0A0B2",
                callback: function (value) {
                  return "₹" + value.toLocaleString("en-IN");
                },
              },
              grid: {
                color: "#33334D",
                drawBorder: false,
              },
            },
            x: {
              ticks: {
                color: "#A0A0B2",
              },
              grid: {
                color: "#33334D",
                drawBorder: false,
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "var(--text-primary)", // Use theme variable for better visibility
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += "₹" + context.parsed.y.toFixed(2);
                  }
                  return label;
                },
              },
            },
          },
        },
      });
    }
  },
};
