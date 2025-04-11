// Mortgage Calculator Module

export function initializeMortgageCalculator() {
    const calculatorForm = document.getElementById('mortgageCalculator')
    const resultsDiv = document.getElementById('calculatorResults')

    if (calculatorForm) {
        calculatorForm.addEventListener('submit', (e) => {
            e.preventDefault()

            // Get form values
            const loanAmount = parseFloat(document.getElementById('loanAmount').value)
            const interestRate = parseFloat(document.getElementById('interestRate').value)
            const loanTenure = parseInt(document.getElementById('loanTenure').value)
            const downPayment = parseFloat(document.getElementById('downPayment').value) || 0

            // Calculate loan details
            const principal = loanAmount - downPayment
            const monthlyInterest = interestRate / (12 * 100)
            const totalMonths = loanTenure * 12

            // Calculate EMI
            const emi = calculateEMI(principal, monthlyInterest, totalMonths)
            const totalAmount = emi * totalMonths
            const totalInterest = totalAmount - principal

            // Display results
            displayResults({
                monthlyPayment: emi,
                totalInterest: totalInterest,
                totalAmount: totalAmount,
                principal: principal
            })

            // Show results section
            resultsDiv.style.display = 'block'
        })

        // Add input validation
        setupValidation()
    }
}

// Calculate EMI using the formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
function calculateEMI(principal, monthlyInterest, totalMonths) {
    if (monthlyInterest === 0) return principal / totalMonths

    const temp = Math.pow(1 + monthlyInterest, totalMonths)
    return (principal * monthlyInterest * temp) / (temp - 1)
}

// Display calculated results
function displayResults(results) {
    // Format currency
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    // Update result elements
    document.getElementById('monthlyPayment').textContent = formatter.format(results.monthlyPayment)
    document.getElementById('totalInterest').textContent = formatter.format(results.totalInterest)
    document.getElementById('totalAmount').textContent = formatter.format(results.totalAmount)

    // Update progress bars
    const principalPercentage = (results.principal / results.totalAmount) * 100
    const interestPercentage = (results.totalInterest / results.totalAmount) * 100

    const principalBar = document.getElementById('principalBar')
    const interestBar = document.getElementById('interestBar')

    principalBar.style.width = `${principalPercentage}%`
    principalBar.setAttribute('aria-valuenow', principalPercentage)
    principalBar.textContent = `Principal ${principalPercentage.toFixed(1)}%`

    interestBar.style.width = `${interestPercentage}%`
    interestBar.setAttribute('aria-valuenow', interestPercentage)
    interestBar.textContent = `Interest ${interestPercentage.toFixed(1)}%`
}

// Setup form validation
function setupValidation() {
    const loanAmountInput = document.getElementById('loanAmount')
    const interestRateInput = document.getElementById('interestRate')
    const downPaymentInput = document.getElementById('downPayment')

    // Validate loan amount
    loanAmountInput.addEventListener('input', () => {
        const value = parseFloat(loanAmountInput.value)
        if (value < 1000) {
            loanAmountInput.setCustomValidity('Loan amount must be at least $1,000')
        } else {
            loanAmountInput.setCustomValidity('')
        }
    })

    // Validate interest rate
    interestRateInput.addEventListener('input', () => {
        const value = parseFloat(interestRateInput.value)
        if (value < 0.1 || value > 30) {
            interestRateInput.setCustomValidity('Interest rate must be between 0.1% and 30%')
        } else {
            interestRateInput.setCustomValidity('')
        }
    })

    // Validate down payment
    downPaymentInput.addEventListener('input', () => {
        const downPayment = parseFloat(downPaymentInput.value)
        const loanAmount = parseFloat(loanAmountInput.value)

        if (downPayment >= loanAmount) {
            downPaymentInput.setCustomValidity('Down payment cannot be greater than or equal to loan amount')
        } else {
            downPaymentInput.setCustomValidity('')
        }
    })
}