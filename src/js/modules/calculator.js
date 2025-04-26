// Mortgage Calculator Module

export function initializeMortgageCalculator() {
  console.log("Initializing mortgage calculator...");

  const calculatorForm = document.getElementById("mortgageCalculator");
  const resultsDiv = document.getElementById("calculatorResults");
  const propertyValueInput = document.getElementById("propertyValue");
  const downPaymentInput = document.getElementById("downPayment");
  const loanAmountInput = document.getElementById("loanAmount");
  const saveResultsBtn = document.getElementById("saveResults");

  // Check if elements exist
  console.log("Form elements:", {
    calculatorForm,
    resultsDiv,
    propertyValueInput,
    downPaymentInput,
    loanAmountInput,
    saveResultsBtn,
  });

  // Initialize charts
  let amortizationChart = null;
  let comparisonChart = null;

  if (calculatorForm) {
    console.log("Calculator form found, setting up event listeners");

    // Auto-calculate loan amount
    if (propertyValueInput && downPaymentInput && loanAmountInput) {
      propertyValueInput.addEventListener("input", updateLoanAmount);
      downPaymentInput.addEventListener("input", updateLoanAmount);
    }

    // Handle form submission
    calculatorForm.addEventListener("submit", (e) => {
      console.log("Form submission event triggered");
      e.preventDefault();

      // Get form values
      const propertyValue = parseFloat(
        document.getElementById("propertyValue")?.value || "0"
      );
      const loanAmount = parseFloat(
        document.getElementById("loanAmount").value
      );
      const interestRate = parseFloat(
        document.getElementById("interestRate").value
      );
      const loanTenure = parseInt(document.getElementById("loanTenure").value);
      const downPayment = parseFloat(
        document.getElementById("downPayment")?.value || "0"
      );

      console.log("Input values:", {
        propertyValue,
        loanAmount,
        interestRate,
        loanTenure,
        downPayment,
      });

      try {
        // Calculate loan details
        const principal = loanAmount;
        const monthlyInterest = interestRate / (12 * 100);
        const totalMonths = loanTenure * 12;

        // Calculate EMI
        const emi = calculateEMI(principal, monthlyInterest, totalMonths);
        const totalAmount = emi * totalMonths;
        const totalInterest = totalAmount - principal;

        console.log("Calculation results:", {
          principal,
          monthlyInterest,
          totalMonths,
          emi,
          totalAmount,
          totalInterest,
        });

        // Display results
        displayResults({
          monthlyPayment: emi,
          totalInterest: totalInterest,
          totalAmount: totalAmount,
          principal: principal,
        });

        // Check if Chart is available
        console.log("Chart object available:", typeof Chart !== "undefined");

        // Create repayment chart
        if (typeof Chart !== "undefined") {
          createAmortizationChart(principal, monthlyInterest, totalMonths, emi);
          createTenureComparisonChart(principal, interestRate);
        } else {
          console.error("Chart.js not properly loaded, cannot create charts");
        }

        // Show results section
        resultsDiv.style.display = "block";

        // Scroll to results area
        resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        console.error("Error during calculation:", error);
        alert("An error occurred during calculation: " + error.message);
      }
    });

    // Save results
    if (saveResultsBtn) {
      saveResultsBtn.addEventListener("click", saveCalculationResults);
    }

    // Add input validation
    setupValidation();
  } else {
    console.warn("Calculator form element not found!");
  }

  // Auto-calculate loan amount (property value - down payment)
  function updateLoanAmount() {
    console.log("Updating loan amount");
    const propertyValue = parseFloat(propertyValueInput.value) || 0;
    const downPayment = parseFloat(downPaymentInput.value) || 0;

    // Ensure down payment is not greater than property value
    if (downPayment > propertyValue) {
      downPaymentInput.value = propertyValue;
      loanAmountInput.value = 0;
    } else {
      loanAmountInput.value = propertyValue - downPayment;
    }
  }

  // Initialize sliders and connect them with input fields
  initializeSliders();
}

// Calculate EMI using the formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
function calculateEMI(principal, monthlyInterest, totalMonths) {
  if (monthlyInterest === 0) return principal / totalMonths;

  const temp = Math.pow(1 + monthlyInterest, totalMonths);
  return (principal * monthlyInterest * temp) / (temp - 1);
}

// Display calculated results
function displayResults(results) {
  console.log("Displaying calculation results");
  // Format currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Update result elements
  document.getElementById("monthlyPayment").textContent = formatter.format(
    results.monthlyPayment
  );
  document.getElementById("totalInterest").textContent = formatter.format(
    results.totalInterest
  );
  document.getElementById("totalAmount").textContent = formatter.format(
    results.totalAmount
  );
  document.getElementById("principalAmount").textContent = formatter.format(
    results.principal
  );

  // Update progress bars
  const principalPercentage = (results.principal / results.totalAmount) * 100;
  const interestPercentage =
    (results.totalInterest / results.totalAmount) * 100;

  const principalBar = document.getElementById("principalBar");
  const interestBar = document.getElementById("interestBar");

  principalBar.style.width = `${principalPercentage}%`;
  principalBar.setAttribute("aria-valuenow", principalPercentage);
  principalBar.textContent = `Principal ${principalPercentage.toFixed(1)}%`;

  interestBar.style.width = `${interestPercentage}%`;
  interestBar.setAttribute("aria-valuenow", interestPercentage);
  interestBar.textContent = `Interest ${interestPercentage.toFixed(1)}%`;
}

// Create loan repayment chart
function createAmortizationChart(principal, monthlyInterest, totalMonths, emi) {
  console.log("Creating repayment chart");
  const ctx = document.getElementById("amortizationChart");

  if (!ctx) {
    console.error("Chart canvas element not found");
    return;
  }

  // Check if Chart is available
  const ChartClass =
    window.Chart || (typeof Chart !== "undefined" ? Chart : null);
  if (!ChartClass) {
    console.error("Chart class not available, cannot create chart");
    // Show fallback text result
    const chartContainer = ctx.parentElement;
    if (chartContainer) {
      const resultText = document.createElement("div");
      resultText.innerHTML = `<p class="text-danger">Chart library failed to load, but your calculation results have been generated.</p>`;
      chartContainer.appendChild(resultText);
    }
    return;
  }

  // If chart already exists, destroy it
  try {
    if (
      window.amortizationChart &&
      typeof window.amortizationChart.destroy === "function"
    ) {
      window.amortizationChart.destroy();
      console.log("Existing chart destroyed successfully");
    } else if (window.amortizationChart) {
      console.log("Existing chart found but destroy method not available");
      window.amortizationChart = null;
    }
  } catch (error) {
    console.error("Error destroying existing chart:", error);
    window.amortizationChart = null;
  }

  // Calculate monthly principal and interest
  const labels = [];
  const principalData = [];
  const interestData = [];

  let remainingPrincipal = principal;

  // Take a data point every 12 months to avoid chart being too dense
  const interval = totalMonths > 60 ? 12 : 6;

  for (let month = 1; month <= totalMonths; month++) {
    const interestForMonth = remainingPrincipal * monthlyInterest;
    const principalForMonth = emi - interestForMonth;

    remainingPrincipal -= principalForMonth;

    if (month % interval === 0 || month === 1 || month === totalMonths) {
      labels.push(`Year ${Math.floor(month / 12)} Month ${month % 12 || 12}`);
      principalData.push(principalForMonth);
      interestData.push(interestForMonth);
    }
  }

  try {
    // Create chart
    window.amortizationChart = new ChartClass(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Monthly Principal Payment",
            data: principalData,
            backgroundColor: "rgba(40, 167, 69, 0.2)",
            borderColor: "rgba(40, 167, 69, 1)",
            borderWidth: 2,
            tension: 0.1,
          },
          {
            label: "Monthly Interest Payment",
            data: interestData,
            backgroundColor: "rgba(23, 162, 184, 0.2)",
            borderColor: "rgba(23, 162, 184, 1)",
            borderWidth: 2,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ": $" + context.raw.toFixed(2);
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
        },
      },
    });
    console.log("New chart created successfully");
  } catch (error) {
    console.error("Error creating chart:", error);
    window.amortizationChart = null;
  }
}

// Create different loan tenure comparison chart
function createTenureComparisonChart(principal, interestRate) {
  console.log("Creating loan term comparison chart");
  const ctx = document.getElementById("tenureComparisonChart");

  if (!ctx) {
    console.error("Term comparison chart canvas element not found");
    return;
  }

  // Check if Chart is available
  const ChartClass =
    window.Chart || (typeof Chart !== "undefined" ? Chart : null);
  if (!ChartClass) {
    console.error(
      "Chart class not available, cannot create term comparison chart"
    );
    return;
  }

  // If chart already exists, destroy it
  try {
    if (
      window.tenureComparisonChart &&
      typeof window.tenureComparisonChart.destroy === "function"
    ) {
      window.tenureComparisonChart.destroy();
      console.log("Existing tenure comparison chart destroyed successfully");
    } else if (window.tenureComparisonChart) {
      console.log(
        "Existing tenure comparison chart found but destroy method not available"
      );
      window.tenureComparisonChart = null;
    }
  } catch (error) {
    console.error("Error destroying existing tenure chart:", error);
    window.tenureComparisonChart = null;
  }

  // Calculate monthly payments and total interest for different loan terms
  const tenures = [5, 10, 15, 20, 25, 30];
  const monthlyPayments = [];
  const totalInterests = [];

  for (const years of tenures) {
    const months = years * 12;
    const monthlyInterest = interestRate / (12 * 100);
    const emi = calculateEMI(principal, monthlyInterest, months);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    monthlyPayments.push(emi);
    totalInterests.push(totalInterest);
  }

  try {
    // Create chart
    window.tenureComparisonChart = new ChartClass(ctx, {
      type: "bar",
      data: {
        labels: tenures.map((years) => `${years} Years`),
        datasets: [
          {
            label: "Monthly Payment",
            data: monthlyPayments,
            backgroundColor: "rgba(40, 167, 69, 0.6)",
            yAxisID: "y",
          },
          {
            label: "Total Interest",
            data: totalInterests,
            backgroundColor: "rgba(23, 162, 184, 0.6)",
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return (
                  context.dataset.label +
                  ": $" +
                  context.raw.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                );
              },
            },
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Monthly Payment ($)",
            },
            ticks: {
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Total Interest ($)",
            },
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
        },
      },
    });
    console.log("New tenure comparison chart created successfully");
  } catch (error) {
    console.error("Error creating term comparison chart:", error);
    window.tenureComparisonChart = null;
  }
}

// Save calculation results as CSV
function saveCalculationResults() {
  console.log("Saving calculation results");
  try {
    const monthlyPayment =
      document.getElementById("monthlyPayment").textContent;
    const totalInterest = document.getElementById("totalInterest").textContent;
    const totalAmount = document.getElementById("totalAmount").textContent;
    const principalAmount =
      document.getElementById("principalAmount").textContent;

    // Create CSV content
    const csvContent = `"Mortgage Calculation Results",\n"Monthly Payment",${monthlyPayment},\n"Principal",${principalAmount},\n"Total Interest",${totalInterest},\n"Total Payment",${totalAmount},\n\n"Generated Date","${new Date().toLocaleDateString()}"`;

    // Create Blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `MortgageCalculation_${new Date()
        .toLocaleDateString()
        .replace(/\//g, "-")}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error saving results:", error);
    alert("Error saving results: " + error.message);
  }
}

// Setup form validation
function setupValidation() {
  console.log("Setting up form validation");
  const propertyValueInput = document.getElementById("propertyValue");
  const interestRateInput = document.getElementById("interestRate");
  const downPaymentInput = document.getElementById("downPayment");
  const loanAmountInput = document.getElementById("loanAmount");

  // Validate property value
  if (propertyValueInput) {
    propertyValueInput.addEventListener("input", () => {
      const value = parseFloat(propertyValueInput.value);
      if (value < 50000) {
        propertyValueInput.setCustomValidity(
          "Property value must be at least $50,000"
        );
      } else {
        propertyValueInput.setCustomValidity("");
      }
    });
  }

  // Validate interest rate
  if (interestRateInput) {
    interestRateInput.addEventListener("input", () => {
      const value = parseFloat(interestRateInput.value);
      if (value < 0.1 || value > 20) {
        interestRateInput.setCustomValidity(
          "Interest rate must be between 0.1% and 20%"
        );
      } else {
        interestRateInput.setCustomValidity("");
      }
    });
  }

  // Validate down payment
  if (downPaymentInput && propertyValueInput) {
    downPaymentInput.addEventListener("input", () => {
      const downPayment = parseFloat(downPaymentInput.value) || 0;
      const propertyValue = parseFloat(propertyValueInput.value) || 0;

      if (downPayment > propertyValue) {
        downPaymentInput.setCustomValidity(
          "Down payment cannot be greater than property value"
        );
      } else {
        downPaymentInput.setCustomValidity("");
      }
    });
  }

  // Validate loan amount
  if (loanAmountInput) {
    loanAmountInput.addEventListener("input", () => {
      const value = parseFloat(loanAmountInput.value);
      if (value < 1000) {
        loanAmountInput.setCustomValidity(
          "Loan amount must be at least $1,000"
        );
      } else {
        loanAmountInput.setCustomValidity("");
      }
    });
  }
}

/**
 * Initialize sliders and connect them with input fields
 */
function initializeSliders() {
  // Property Value Slider
  const propertyValueInput = document.getElementById("propertyValue");
  const propertyValueSlider = document.getElementById("propertyValueSlider");

  // Down Payment Slider
  const downPaymentInput = document.getElementById("downPayment");
  const downPaymentSlider = document.getElementById("downPaymentSlider");

  // Interest Rate Slider
  const interestRateInput = document.getElementById("interestRate");
  const interestRateSlider = document.getElementById("interestRateSlider");

  // Loan Tenure Slider
  const loanTenureSelect = document.getElementById("loanTenure");
  const loanTenureSlider = document.getElementById("loanTenureSlider");

  // Update input when sliders change
  propertyValueSlider.addEventListener("input", () => {
    propertyValueInput.value = propertyValueSlider.value;
    updateLoanAmount();
    updateDownPaymentSliderMax();
  });

  downPaymentSlider.addEventListener("input", () => {
    downPaymentInput.value = downPaymentSlider.value;
    updateLoanAmount();
  });

  interestRateSlider.addEventListener("input", () => {
    interestRateInput.value = interestRateSlider.value;
  });

  loanTenureSlider.addEventListener("input", () => {
    const value = loanTenureSlider.value;
    loanTenureSelect.value = value;
  });

  // Update sliders when inputs change
  propertyValueInput.addEventListener("input", () => {
    propertyValueSlider.value = propertyValueInput.value;
    updateLoanAmount();
    updateDownPaymentSliderMax();
  });

  downPaymentInput.addEventListener("input", () => {
    downPaymentSlider.value = downPaymentInput.value;
    updateLoanAmount();
  });

  interestRateInput.addEventListener("input", () => {
    interestRateSlider.value = interestRateInput.value;
  });

  loanTenureSelect.addEventListener("change", () => {
    loanTenureSlider.value = loanTenureSelect.value;
  });

  // Update loan amount when property value or down payment changes
  function updateLoanAmount() {
    const propertyValue = parseFloat(propertyValueInput.value) || 0;
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const loanAmount = propertyValue - downPayment;

    if (loanAmount >= 0) {
      document.getElementById("loanAmount").value = loanAmount;
    } else {
      document.getElementById("loanAmount").value = 0;
      downPaymentInput.value = propertyValue;
      downPaymentSlider.value = propertyValue;
    }
  }

  // Update down payment slider max when property value changes
  function updateDownPaymentSliderMax() {
    const propertyValue = parseFloat(propertyValueInput.value) || 0;
    downPaymentSlider.max = propertyValue;
  }

  // Initial update
  updateDownPaymentSliderMax();
}
