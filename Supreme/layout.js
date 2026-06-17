document.addEventListener("DOMContentLoaded", () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    const loadPromises = [];

    if (headerPlaceholder) {
        loadPromises.push(
            fetch('header.html')
                .then(res => res.text())
                .then(data => {
                    headerPlaceholder.innerHTML = data;
                    initHeader();
                })
        );
    }

    if (footerPlaceholder) {
        loadPromises.push(
            fetch('footer.html')
                .then(res => res.text())
                .then(data => {
                    footerPlaceholder.innerHTML = data;
                })
        );
    }

    // Wait for all layouts to be loaded before dispatching event
    Promise.all(loadPromises).then(() => {
        // Load Chatbot CSS dynamically
        const chatbotLink = document.createElement('link');
        chatbotLink.rel = 'stylesheet';
        chatbotLink.href = 'chatbot.css';
        document.head.appendChild(chatbotLink);

        // Load Chatbot JS dynamically
        const chatbotScript = document.createElement('script');
        chatbotScript.src = 'chatbot.js';
        document.body.appendChild(chatbotScript);

        document.dispatchEvent(new Event('layoutLoaded'));
    });
});

function initHeader() {
    // Sticky header
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }

    // Mobile toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-list');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link:not(.dropbtn)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1200 && navMenu) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Dropdown toggle logic
    const dropdownBtn = document.querySelector('.dropdown .dropbtn');
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const parentDropdown = dropdownBtn.closest('.dropdown');
            parentDropdown.classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.querySelector('.dropdown');
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    // Dynamically set active nav link based on current URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link:not(.dropbtn)').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // Check dropdowns to highlight parent 'DEPARTMENT' link
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            const parentDropdownBtn = link.closest('.dropdown').querySelector('.dropbtn');
            if (parentDropdownBtn) {
                parentDropdownBtn.classList.add('active');
            }
        }
    });
}
