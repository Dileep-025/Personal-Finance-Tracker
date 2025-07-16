const charts = {
    expensePieChart: null,
    incomeExpenseBarChart: null,

    // Initialize or update the expense distribution pie chart
    updateExpensePieChart: (transactions) => {
        const ctx = document.getElementById('expense-pie-chart').getContext('2d');
        const expenseData = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        const chartData = {
            labels: Object.keys(expenseData),
            datasets: [{
                data: Object.values(expenseData),
                backgroundColor: [
                    '#FFD166', '#EF476F', '#06D6A0', '#118AB2', 
                    '#073B4C', '#EE82EE', '#FFB347', '#77DD77'
                ],
                borderColor: '#1F1F2E',
                hoverOffset: 4
            }]
        };

        if (charts.expensePieChart) {
            charts.expensePieChart.data = chartData;
            charts.expensePieChart.update();
        } else {
            charts.expensePieChart = new Chart(ctx, {
                type: 'pie',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#F1F1F1'
                            }
                        }
                    }
                }
            });
        }
    },

    // Initialize or update the income vs. expense bar chart
    updateIncomeExpenseBarChart: (transactions) => {
        const ctx = document.getElementById('income-expense-bar-chart').getContext('2d');
        const incomeByMonth = {};
        const expenseByMonth = {};

        transactions.forEach(t => {
            const month = new Date(t.id).toLocaleString('default', { month: 'short' });
            if (t.type === 'income') {
                incomeByMonth[month] = (incomeByMonth[month] || 0) + t.amount;
            } else {
                expenseByMonth[month] = (expenseByMonth[month] || 0) + t.amount;
            }
        });

        const labels = [...new Set([...Object.keys(incomeByMonth), ...Object.keys(expenseByMonth)])];

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: labels.map(m => incomeByMonth[m] || 0),
                    backgroundColor: '#5AF3A5',
                    borderColor: '#5AF3A5',
                    borderWidth: 1
                },
                {
                    label: 'Expense',
                    data: labels.map(m => expenseByMonth[m] || 0),
                    backgroundColor: '#FF7D7D',
                    borderColor: '#FF7D7D',
                    borderWidth: 1
                }
            ]
        };

        if (charts.incomeExpenseBarChart) {
            charts.incomeExpenseBarChart.data = chartData;
            charts.incomeExpenseBarChart.update();
        } else {
            charts.incomeExpenseBarChart = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#A0A0B2'
                            },
                            grid: {
                                color: '#33334D'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#A0A0B2'
                            },
                            grid: {
                                color: '#33334D'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#F1F1F1'
                            }
                        }
                    }
                }
            });
        }
    }
};
