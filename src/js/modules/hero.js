// Hero module for handling hero section functionality

export function initializeHero() {
    const heroSection = document.querySelector('.hero')
    if (!heroSection) return

    // Add parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset
        const rate = scrolled * 0.5

        // Only apply transform if the element is in viewport
        if (isElementInViewport(heroSection)) {
            heroSection.style.backgroundPosition = `center ${rate}px`
        }
    })

    // Add fade-in animation for hero content
    const heroContent = heroSection.querySelector('.container')
    if (heroContent) {
        heroContent.style.opacity = '0'
        heroContent.style.transform = 'translateY(20px)'

        // Trigger animation after a short delay
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease'
            heroContent.style.opacity = '1'
            heroContent.style.transform = 'translateY(0)'
        }, 200)
    }
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    return (
        rect.top >= -rect.height &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}