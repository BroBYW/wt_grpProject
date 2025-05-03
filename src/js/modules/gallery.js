// Gallery Module

export function initializeGallery() {
    const galleryFilters = document.querySelector('.gallery-filters')
    const galleryItems = document.querySelectorAll('.gallery-item')
    const modal = document.getElementById('galleryModal')
    const modalImage = document.getElementById('modalImage')

    // Initialize gallery filtering
    if (galleryFilters) {
        galleryFilters.addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                // Update active state
                galleryFilters.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active')
                })
                e.target.classList.add('active')

                // Filter gallery items
                const filterValue = e.target.getAttribute('data-filter')
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block'
                    } else {
                        item.style.display = 'none'
                    }
                })
            }
        })
    }

    // Initialize lightbox functionality
    if (modal) {
        modal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget
            const imageUrl = button.getAttribute('data-image')
            modalImage.src = imageUrl
        })

        // Reset modal image when closing
        modal.addEventListener('hidden.bs.modal', () => {
            modalImage.src = ''
        })
    }

    // Initialize lazy loading for gallery images
    const lazyImages = document.querySelectorAll('.gallery-card img')
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target
                    img.src = img.dataset.src
                    img.classList.remove('lazy')
                    observer.unobserve(img)
                }
            })
        })

        lazyImages.forEach(img => imageObserver.observe(img))
    }

    // Initialize video player (if present)
    const videoFrame = document.querySelector('.virtual-tour iframe')
    if (videoFrame) {
        // Add YouTube API parameters for better performance
        if (videoFrame.src.includes('youtube.com')) {
            const currentSrc = new URL(videoFrame.src)
            currentSrc.searchParams.append('rel', '0')
            currentSrc.searchParams.append('modestbranding', '1')
            currentSrc.searchParams.append('enablejsapi', '1')
            videoFrame.src = currentSrc.toString()
        }
    }
}