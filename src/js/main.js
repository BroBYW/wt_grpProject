// Import Bootstrap JS and dependencies
import 'bootstrap'

// Import custom modules
import { initializeNavbar } from './modules/navbar'
import { initializeHero } from './modules/hero'
import { initializeFloorPlan } from './modules/floor-plan'
import { initializeGallery } from './modules/gallery'
import { initializeContactForm } from './modules/contact'
import { initializeMortgageCalculator } from './modules/calculator'

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap components
    initializeNavbar()
    initializeHero()
    initializeFloorPlan()
    initializeGallery()
    initializeContactForm()
    initializeMortgageCalculator()

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute('href'))
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
        })
    })

    // Add scroll event listener for navbar background
    const navbar = document.querySelector('.navbar')
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled')
            } else {
                navbar.classList.remove('navbar-scrolled')
            }
        })
    }
})