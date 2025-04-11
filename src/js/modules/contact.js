// Contact Form Module

export function initializeContactForm() {
    const form = document.getElementById('contactForm')
    const successMessage = document.getElementById('successMessage')

    if (form) {
        // Client-side form validation
        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            if (!form.checkValidity()) {
                e.stopPropagation()
                form.classList.add('was-validated')
                return
            }

            // Gather form data
            const formData = new FormData(form)
            const data = Object.fromEntries(formData.entries())

            try {
                // Simulate server request (replace with actual API endpoint)
                await submitForm(data)

                // Show success message
                form.reset()
                form.classList.remove('was-validated')
                successMessage.style.display = 'block'

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none'
                }, 5000)

            } catch (error) {
                console.error('Form submission error:', error)
                alert('An error occurred. Please try again later.')
            }
        })

        // Custom email validation
        const emailInput = form.querySelector('#email')
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (emailInput.value && !emailRegex.test(emailInput.value)) {
                    emailInput.setCustomValidity('Please enter a valid email address')
                } else {
                    emailInput.setCustomValidity('')
                }
            })
        }

        // Phone number validation
        const phoneInput = form.querySelector('#phone')
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                // Allow only numbers and common phone number characters
                const value = e.target.value.replace(/[^\d+\-()\s]/g, '')
                e.target.value = value

                // Basic phone number validation (adjust regex as needed)
                const phoneRegex = /^[\d+\-()\s]{10,}$/
                if (value && !phoneRegex.test(value)) {
                    phoneInput.setCustomValidity('Please enter a valid phone number')
                } else {
                    phoneInput.setCustomValidity('')
                }
            })
        }
    }
}

// Simulated form submission function (replace with actual API call)
async function submitForm(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simulate server validation
    if (!data.name || !data.email || !data.phone || !data.unitType || !data.message) {
        throw new Error('All fields are required')
    }

    // In a real application, you would send this data to your server
    console.log('Form submitted:', data)

    // Return success response
    return { success: true, message: 'Form submitted successfully' }
}