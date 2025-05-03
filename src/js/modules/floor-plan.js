// Floor Plan Module

export function initializeFloorPlan() {
    const unitFilters = document.querySelector('.unit-filters')
    const floorPlanItems = document.querySelectorAll('.floor-plan-item')

    // Initialize unit type filtering
    if (unitFilters) {
        unitFilters.addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                // Update active state
                unitFilters.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active')
                })
                e.target.classList.add('active')

                // Filter floor plans
                const filterValue = e.target.getAttribute('data-filter')
                floorPlanItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-type') === filterValue) {
                        item.style.display = 'block'
                    } else {
                        item.style.display = 'none'
                    }
                })
            }
        })
    }

    // Initialize room highlighting
    const floorPlanImages = document.querySelectorAll('.floor-plan-image')
    floorPlanImages.forEach(container => {
        const image = container.querySelector('img')
        const highlights = container.querySelector('.room-highlights')

        if (image && highlights) {
            // Create highlight areas for different rooms
            const rooms = [
                { name: 'Living Room', coords: '100,100,200,200' },
                { name: 'Bedroom', coords: '220,100,320,200' },
                { name: 'Kitchen', coords: '100,220,200,320' }
            ]

            // Create area map
            const map = document.createElement('map')
            map.name = `floor-plan-${Math.random().toString(36).substr(2, 9)}`
            image.useMap = `#${map.name}`

            rooms.forEach(room => {
                const area = document.createElement('area')
                area.shape = 'rect'
                area.coords = room.coords
                area.alt = room.name
                area.title = room.name

                // Highlight room on hover
                area.addEventListener('mouseenter', () => {
                    const [x1, y1, x2, y2] = room.coords.split(',').map(Number)
                    highlights.style.cssText = `
                        position: absolute;
                        left: ${x1}px;
                        top: ${y1}px;
                        width: ${x2 - x1}px;
                        height: ${y2 - y1}px;
                        background: rgba(44, 62, 80, 0.2);
                        pointer-events: none;
                        transition: all 0.3s ease;
                    `
                })

                area.addEventListener('mouseleave', () => {
                    highlights.style.background = 'transparent'
                })

                map.appendChild(area)
            })

            container.appendChild(map)
        }
    })
}