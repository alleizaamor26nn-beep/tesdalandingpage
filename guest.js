// ========================================================================
// GUEST DASHBOARD - JAVASCRIPT
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================================================
    // SAMPLE DATA
    // ========================================================================
    const events = [
        { 
            id: 1, 
            title: "Web Dev Quiz 1", 
            date: new Date(2026, 1, 10), 
            type: "course", 
            category: "7days" 
        },
        { 
            id: 2, 
            title: "Guest Lecture: AI Ethics", 
            date: new Date(2026, 1, 15), 
            type: "site", 
            category: "30days" 
        },
        { 
            id: 3, 
            title: "Final Project Submission", 
            date: new Date(2026, 1, 5), 
            type: "course", 
            category: "overdue" 
        },
        { 
            id: 4, 
            title: "UX Design Workshop", 
            date: new Date(2026, 1, 20), 
            type: "category", 
            category: "30days" 
        },
        { 
            id: 5, 
            title: "Python Basics Exam", 
            date: new Date(2026, 2, 5), 
            type: "user", 
            category: "next_month" 
        }
    ];

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Visibility toggle per event type
    let visibleTypes = {
        site: true,
        category: true,
        course: true,
        group: true,
        user: true
    };

    // ========================================================================
    // DOM ELEMENTS
    // ========================================================================
    const timelineContent = document.getElementById('timeline-content');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const timelineSearch = document.getElementById('timeline-search');
    const sortOptions = document.getElementById('sort-options');

    const calendarSection = document.getElementById('calendar-section');
    const calRenderArea = document.getElementById('calendar-render-area');
    const monthYearText = document.getElementById('calendar-month-year');

    const dashboardMain = document.getElementById('dashboard-main-content');
    const fullCalBtn = document.getElementById('full-calendar-btn');
    const backBtn = document.getElementById('back-to-dashboard');
    const calSorting = document.getElementById('calendar-sorting');
    
    const sidebarDash = document.getElementById('sidebar-dashboard-view');
    const sidebarCal = document.getElementById('sidebar-calendar-view');

    const drawer = document.getElementById('right-drawer');
    const overlay = document.getElementById('overlay');
    const drawerToggle = document.getElementById('drawer-toggle');
    const drawerClose = document.getElementById('drawer-close');

    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    // ========================================================================
    // DRAWER FUNCTIONALITY
    // ========================================================================
    // ========================================================================
// DRAWER FUNCTIONALITY
// ========================================================================
    const toggleDrawer = () => {
        // Chine-check kung may class na 'open', kung meron tatanggalin, kung wala idadagdag.
        drawer.classList.toggle('open');
        overlay.classList.toggle('show');
    };

    const closeDrawer = () => {
        drawer.classList.remove('open');
        overlay.classList.remove('show');
    };

    // Eto yung binago natin: mula openDrawer naging toggleDrawer
    drawerToggle.addEventListener('click', toggleDrawer); 

    drawerClose.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // ========================================================================
    // TIMELINE RENDERING
    // ========================================================================
    function renderTimeline(filter = 'all', search = '', sortBy = 'date') {
        let filtered = events.filter(e => {
            const matchesTab = filter === 'all' || e.category === filter;
            const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
            const isVisible = visibleTypes[e.type];
            return matchesTab && matchesSearch && isVisible;
        });

        // Sorting logic
        if (sortBy === 'date') {
            // Sort by date (earliest first)
            filtered.sort((a, b) => a.date - b.date);
        } else if (sortBy === 'course') {
            // Sort by course title alphabetically
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        if (!filtered.length) {
            timelineContent.innerHTML = `
                <div class="empty-state">
                    <i class='bx bx-calendar-x'></i>
                    <p>No activities found</p>
                </div>
            `;
            return;
        }

        timelineContent.innerHTML = filtered.map(e => `
            <div class="timeline-item" style="border-left-color: var(--${e.type})">
                <div>
                    <strong>${e.title}</strong>
                    <small class="text-muted">${formatDate(e.date)}</small>
                </div>
                <span class="badge-guest">${e.type}</span>
            </div>
        `).join('');
    }

    // Helper function to format dates
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Tab button event listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTimeline(btn.dataset.filter, timelineSearch.value, sortOptions.value);
        });
    });

    // Search input event listener
    timelineSearch.addEventListener('input', (e) => {
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.filter || 'all';
        renderTimeline(activeTab, e.target.value, sortOptions.value);
    });

    // Sort dropdown event listener
    sortOptions.addEventListener('change', (e) => {
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.filter || 'all';
        renderTimeline(activeTab, timelineSearch.value, e.target.value);
    });

    // ========================================================================
    // CALENDAR RENDERING
    // ========================================================================
    function renderCalendar() {
        const isFullView = calendarSection.classList.contains('full-view');

        // Build calendar structure
        calRenderArea.innerHTML = `
            <div class="calendar-grid-header">
                <div>Sun</div><div>Mon</div><div>Tue</div>
                <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div id="calendar-days" class="calendar-grid"></div>
        `;

        const daysContainer = document.getElementById('calendar-days');
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Update month/year display
        const monthYear = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric'
        }).format(new Date(currentYear, currentMonth));
        
        monthYearText.querySelector('span').textContent = monthYear;

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            daysContainer.innerHTML += `<div class="calendar-day empty"></div>`;
        }

        // Render days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = new Date(currentYear, currentMonth, day).toDateString();
            const isToday = new Date().toDateString() === dateStr ? 'today' : '';

            const dayEvents = events.filter(e =>
                e.date.toDateString() === dateStr && visibleTypes[e.type]
            );

            let eventContent = '';

            if (isFullView) {
                // Full calendar view: show event labels
                eventContent = dayEvents.map(e => `
                    <div class="calendar-event-label" style="background-color: var(--${e.type})">
                        ${e.title}
                    </div>
                `).join('');
            } else {
                // Dashboard calendar view: show colored dots
                eventContent = dayEvents.map(e => `
                    <span class="event-dot" style="background-color: var(--${e.type})"></span>
                `).join('');
            }

            daysContainer.innerHTML += `
                <div class="calendar-day ${isToday}">
                    <span class="day-num">${day}</span>
                    <div class="day-events-container">
                        ${eventContent}
                    </div>
                </div>
            `;
        }
    }

    // ========================================================================
    // FULL CALENDAR VIEW TOGGLE
    // ========================================================================
    fullCalBtn.addEventListener('click', () => {
        dashboardMain.classList.add('hidden');
        calendarSection.classList.add('full-view');
        fullCalBtn.classList.add('hidden');
        backBtn.classList.remove('hidden');
        calSorting.classList.remove('hidden');
        sidebarDash.classList.add('hidden');
        sidebarCal.classList.remove('hidden');
        renderCalendar();
    });

    backBtn.addEventListener('click', () => {
        dashboardMain.classList.remove('hidden');
        calendarSection.classList.remove('full-view');
        fullCalBtn.classList.remove('hidden');
        backBtn.classList.add('hidden');
        calSorting.classList.add('hidden');
        sidebarDash.classList.remove('hidden');
        sidebarCal.classList.add('hidden');

        // Reset to month view
        document.querySelectorAll('.cal-sort-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-view="month"]')?.classList.add('active');

        renderCalendar();
    });

    // ========================================================================
    // CALENDAR VIEW SORTING (Month, Day, Upcoming)
    // ========================================================================
    document.querySelectorAll('.cal-sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cal-sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const view = btn.dataset.view;
            
            if (view === 'day') {
                renderDayView();
            } else if (view === 'upcoming') {
                renderUpcomingView();
            } else {
                renderCalendar();
            }
        });
    });

    function renderDayView() {
        const todayStr = new Date().toDateString();
        const todayEvents = events.filter(e =>
            e.date.toDateString() === todayStr && visibleTypes[e.type]
        );

        calRenderArea.innerHTML = `
            <div class="upcoming-events-list">
                <h3>Events for Today</h3>
                ${todayEvents.length
                    ? todayEvents.map(e => `
                        <div class="timeline-item" style="border-left-color: var(--${e.type})">
                            <div>
                                <strong>${e.title}</strong>
                                <small class="text-muted">${e.type.toUpperCase()}</small>
                            </div>
                        </div>
                    `).join('')
                    : '<div class="empty-state"><i class="bx bx-calendar-x"></i><p>No events today.</p></div>'}
            </div>
        `;
    }

    function renderUpcomingView() {
        const upcoming = events
            .filter(e => visibleTypes[e.type] && e.date >= new Date())
            .sort((a, b) => a.date - b.date);

        calRenderArea.innerHTML = `
            <div class="upcoming-events-list">
                <h3>Upcoming Activities</h3>
                ${upcoming.length
                    ? upcoming.map(e => `
                        <div class="timeline-item" style="border-left-color: var(--${e.type})">
                            <div>
                                <strong>${e.title}</strong>
                                <small class="text-muted">${formatDate(e.date)}</small>
                            </div>
                            <span class="badge-guest">${e.type}</span>
                        </div>
                    `).join('')
                    : '<div class="empty-state"><i class="bx bx-calendar-x"></i><p>No upcoming activities.</p></div>'}
            </div>
        `;
    }

    // ========================================================================
    // MONTH NAVIGATION
    // ========================================================================
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // ========================================================================
    // EVENT TYPE VISIBILITY TOGGLE (Eye Icons)
    // ========================================================================
    document.querySelectorAll('.eye-toggle').forEach(eye => {
        eye.addEventListener('click', () => {
            const type = eye.dataset.type;
            visibleTypes[type] = !visibleTypes[type];
            
            // Toggle icon
            eye.classList.toggle('bx-show');
            eye.classList.toggle('bx-hide');
            eye.style.opacity = visibleTypes[type] ? '1' : '0.3';

            // Re-render calendar and timeline
            renderCalendar();
            renderTimeline(
                document.querySelector('.tab-btn.active')?.dataset.filter || 'all',
                timelineSearch.value,
                sortOptions.value
            );
        });
    });

    // ========================================================================
    // NAVIGATION LINKS
    // ========================================================================
    const navHome = document.getElementById('nav-home');
    const navCalendar = document.getElementById('nav-calendar');

    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show dashboard
        dashboardMain.classList.remove('hidden');
        calendarSection.classList.remove('full-view');
        fullCalBtn.classList.remove('hidden');
        backBtn.classList.add('hidden');
        calSorting.classList.add('hidden');
        sidebarDash.classList.remove('hidden');
        sidebarCal.classList.add('hidden');
        
        // Update active state
        navHome.classList.add('active');
        navCalendar.classList.remove('active');
        
        renderCalendar();
    });

    navCalendar.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show full calendar
        dashboardMain.classList.add('hidden');
        calendarSection.classList.add('full-view');
        fullCalBtn.classList.add('hidden');
        backBtn.classList.remove('hidden');
        calSorting.classList.remove('hidden');
        sidebarDash.classList.add('hidden');
        sidebarCal.classList.remove('hidden');
        
        // Update active state
        navCalendar.classList.add('active');
        navHome.classList.remove('active');
        
        renderCalendar();
    });

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    renderTimeline();
    renderCalendar();
    
    console.log('Guest Dashboard initialized successfully!');
});