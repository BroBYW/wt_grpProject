// Navbar module for handling navigation functionality

export function initializeNavbar() {
    const navbar = document.querySelector('.navbar')
    const navbarToggler = document.querySelector('.navbar-toggler')
    const navbarCollapse = document.querySelector('.navbar-collapse')

    if (!navbar || !navbarToggler || !navbarCollapse) return

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const isNavbarClick = navbar.contains(e.target)
        const isExpanded = navbarCollapse.classList.contains('show')

        if (!isNavbarClick && isExpanded) {
            navbarToggler.click()
        }
    })

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link')
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click()
            }
        })
    })

    // Add active class to current page nav link
    const currentPath = window.location.pathname
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active')
        }
    })
}
