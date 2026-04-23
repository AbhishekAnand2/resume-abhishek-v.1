// Bold.pro Inspired Modern Resume - Interactive Subsystem & Dynamic Renderer

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Dynamic Content Renderer --- */
    
    // Auto-hide sections and their nav links if no data exists
    const manageSectionVisibility = (sectionId, checkData) => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`.floating-nav a[href="#${sectionId}"]`);
        
        let hasData = false;
        if (Array.isArray(checkData)) {
            hasData = checkData.length > 0;
        } else if (typeof checkData === 'string') {
            hasData = checkData.trim().length > 0;
        } else if (checkData && typeof checkData === 'object') {
            hasData = Object.keys(checkData).length > 0;
        }

        if (section) section.style.display = hasData ? 'block' : 'none';
        if (navLink) navLink.style.display = hasData ? 'flex' : 'none';
        
        return hasData;
    };

    if (typeof resumeData !== 'undefined') {
        
        // Render Summary
        if (manageSectionVisibility('summary', resumeData.summary)) {
            const summaryContainer = document.getElementById('summary-content');
            if (summaryContainer) summaryContainer.innerHTML = resumeData.summary;
        }

        // Render Overview
        if (manageSectionVisibility('overview', resumeData.overview)) {
            const overviewContainer = document.getElementById('overview-container');
            if (overviewContainer) {
                overviewContainer.innerHTML = `
                    <div class="overview-card" data-number="${resumeData.overview.yearsExperience}">
                        <span class="overview-number">${resumeData.overview.yearsExperience}</span>
                        <span class="overview-text">YEARS OF PROFESSIONAL<br>EXPERIENCE</span>
                    </div>
                    <div class="overview-card" data-number="${resumeData.overview.totalCertifications}">
                        <span class="overview-number">${resumeData.overview.totalCertifications}</span>
                        <span class="overview-text">CERTIFICATION</span>
                    </div>
                `;
            }
        }

        // Render Work History
        if (manageSectionVisibility('work-history', resumeData.workHistory)) {
            const workContainer = document.getElementById('work-history-container');
            if (workContainer) {
                let workHTML = '';
                resumeData.workHistory.forEach(job => {
                    let bulletsHTML = job.bullets.map(bullet => `<li>${bullet}</li>`).join('');
                    workHTML += `
                    <div class="experience-card">
                        <div class="card-header">
                            <div class="card-icon"><i class="fa-solid ${job.icon}"></i></div>
                            <span class="card-title">${job.title}</span>
                        </div>
                        <div class="card-subtitle">${job.company}</div>
                        <div class="card-meta">
                            <span>${job.location}</span>
                            <span>${job.date}</span>
                        </div>
                        <div class="card-body">
                            ${job.description ? `<p style="margin-bottom: 0.8rem; color: var(--text-muted);">${job.description}</p>` : ''}
                            <ul>${bulletsHTML}</ul>
                        </div>
                    </div>`;
                });
                workContainer.innerHTML = workHTML;
            }
        }

        // Render Education
        if (manageSectionVisibility('education', resumeData.education)) {
            const eduContainer = document.getElementById('education-container');
            if (eduContainer) {
                let eduHTML = '';
                resumeData.education.forEach(edu => {
                    eduHTML += `
                    <div class="experience-card">
                        <div class="card-header">
                            <div class="card-icon"><i class="fa-solid ${edu.icon}"></i></div>
                            <span class="card-title">${edu.title}</span>
                        </div>
                        <div class="card-subtitle">${edu.school}</div>
                        <div class="card-meta">
                            <span>${edu.date}</span>
                        </div>
                        <div class="card-body">
                            <p>${edu.text}</p>
                        </div>
                    </div>`;
                });
                eduContainer.innerHTML = eduHTML;
            }
        }

        // Render Simple Grids (Skills, Certs, Info, Languages)
        const renderListTemplate = (sectionId, containerId, dataArray) => {
            if (manageSectionVisibility(sectionId, dataArray)) {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = dataArray.map(item => `<li>${item}</li>`).join('');
                }
            }
        };
        
        renderListTemplate('skills', 'skills-container', resumeData.skills);
        renderListTemplate('certifications', 'certifications-container', resumeData.certifications);
        renderListTemplate('personal', 'personal-container', resumeData.personalInfo);
        renderListTemplate('languages', 'languages-container', resumeData.languages);

        // Render Websites
        if (manageSectionVisibility('websites', resumeData.websites)) {
            const webContainer = document.getElementById('websites-container');
            if (webContainer) {
                webContainer.innerHTML = resumeData.websites.map(site => `
                    <div class="website-card">
                        <i class="fa-brands ${site.icon}"></i>
                        <a href="${site.url}" target="_blank">${site.displayUrl}</a>
                    </div>
                `).join('');
            }
        }

        // Render Projects
        if (manageSectionVisibility('projects', resumeData.projects)) {
            const projectsContainer = document.getElementById('projects-container');
            if (projectsContainer) {
                let projectsHTML = '';
                resumeData.projects.forEach(proj => {
                    let bulletsHTML = proj.bullets.map(bullet => `<li>${bullet}</li>`).join('');
                    
                    let metaHTML = '';
                    if (proj.location || proj.date) {
                        metaHTML = `<div class="card-meta">
                            ${proj.location ? `<span>${proj.location}</span>` : ''}
                            ${proj.date ? `<span>${proj.date}</span>` : ''}
                        </div>`;
                    }

                    projectsHTML += `
                    <div class="experience-card">
                        <div class="card-header">
                            <div class="card-icon"><i class="fa-solid ${proj.icon || 'fa-folder'}"></i></div>
                            <span class="card-title">${proj.title}</span>
                        </div>
                        ${proj.company ? `<div class="card-subtitle">${proj.company}</div>` : ''}
                        ${metaHTML}
                        <div class="card-body">
                            ${proj.description ? `<p style="margin-bottom: 0.8rem; color: var(--text-muted);">${proj.description}</p>` : ''}
                            <ul>${bulletsHTML}</ul>
                        </div>
                    </div>`;
                });
                projectsContainer.innerHTML = projectsHTML;
            }
        }

        // Render Timeline
        if (manageSectionVisibility('timeline', resumeData.timeline)) {
            const timelineContainer = document.getElementById('timeline-container');
            if (timelineContainer) {
                let timelineHTML = '';
                resumeData.timeline.forEach(node => {
                    let iconClass = node.title.toLowerCase().includes("b.tech") || node.title.toLowerCase().includes("education") 
                        ? "fa-graduation-cap" : "fa-briefcase";
                        
                    timelineHTML += `
                    <div class="timeline-node">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="card-icon" style="margin-bottom: 0.8rem;"><i class="fa-solid ${iconClass}"></i></div>
                            <div class="timeline-title">${node.title}</div>
                            <div class="timeline-company">${node.date}</div>
                        </div>
                    </div>`;
                });
                timelineContainer.innerHTML = timelineHTML;
            }
        }
    } else {
        // If data.js is completely missing, redirect the viewport to our custom 404 interactive game!
        window.location.replace('404.html');
    }


    /* --- 2. ScrollSpy & Interactive Subsystems --- */
    
    // We defer standard DOM element selection slightly to ensure injected content is rendered
    setTimeout(() => {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.floating-nav a');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // Highlight when section is near top of viewport
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        });

        /* --- Smooth Scrolling for Navigation Links --- */
        navItems.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 50,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
    }, 50);

    /* --- 3. Theme Toggle Logic --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        
        // Check local storage for theme
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            } else {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    }

});
