/* =========================================================
   SANTHOSH C — DATA SCIENCE PORTFOLIO
   Advanced Interactive JavaScript
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL APPLICATION
   ========================================================= */

const PortfolioApp = (() => {

    /* ---------------------------------------------------------
       DOM CACHE
    --------------------------------------------------------- */

    const DOM = {

        loader:
            document.getElementById("loader"),

        header:
            document.getElementById("header"),

        navMenu:
            document.getElementById("navMenu"),

        menuToggle:
            document.getElementById("menuToggle"),

        themeToggle:
            document.getElementById("themeToggle"),

        scrollProgress:
            document.getElementById("scrollProgress"),

        backToTop:
            document.getElementById("backToTop"),

        typingText:
            document.getElementById("typingText"),

        contactForm:
            document.getElementById("contactForm"),

        formStatus:
            document.getElementById("formStatus")

    };


    /* ---------------------------------------------------------
       APPLICATION STATE
    --------------------------------------------------------- */

    const state = {

        menuOpen: false,

        darkMode: true,

        currentSkillFilter: "all",

        currentProjectFilter: "all",

        typingIndex: 0,

        characterIndex: 0,

        deleting: false,

        typingTimer: null,

        initialized: false

    };


    /* =========================================================
       UTILITY FUNCTIONS
       ========================================================= */

    const utils = {

        selectAll(selector, parent = document) {

            return [...parent.querySelectorAll(selector)];

        },


        select(selector, parent = document) {

            return parent.querySelector(selector);

        },


        clamp(value, min, max) {

            return Math.min(Math.max(value, min), max);

        },


        prefersReducedMotion() {

            return window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        },


        isElementVisible(element) {

            if (!element) return false;

            const rect = element.getBoundingClientRect();

            return (
                rect.top < window.innerHeight &&
                rect.bottom > 0
            );

        },


        debounce(callback, delay = 150) {

            let timer;

            return (...args) => {

                clearTimeout(timer);

                timer = setTimeout(() => {

                    callback(...args);

                }, delay);

            };

        },


        throttle(callback, limit = 100) {

            let waiting = false;

            return (...args) => {

                if (waiting) return;

                callback(...args);

                waiting = true;

                setTimeout(() => {

                    waiting = false;

                }, limit);

            };

        },


        safeStorageGet(key) {

            try {

                return localStorage.getItem(key);

            } catch {

                return null;

            }

        },


        safeStorageSet(key, value) {

            try {

                localStorage.setItem(key, value);

            } catch {

                /* Storage may be unavailable */

            }

        }

    };


    /* =========================================================
       PAGE LOADER
    ========================================================= */

    function initLoader() {

        if (!DOM.loader) return;

        const hideLoader = () => {

            DOM.loader.classList.add("loaded");

            document.body.classList.remove(
                "loading"
            );

            setTimeout(() => {

                DOM.loader.remove();

            }, 700);

        };


        if (document.readyState === "complete") {

            setTimeout(hideLoader, 400);

        } else {

            window.addEventListener(
                "load",
                () => setTimeout(hideLoader, 400),
                { once: true }
            );

        }

    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    function initNavigation() {

        if (!DOM.navMenu || !DOM.menuToggle) return;


        const navLinks =
            utils.selectAll(".nav-link");


        /* Mobile menu */

        DOM.menuToggle.addEventListener(
            "click",
            toggleMobileMenu
        );


        /* Close menu when clicking links */

        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => closeMobileMenu()
            );

        });


        /* Close menu using Escape */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    state.menuOpen
                ) {

                    closeMobileMenu();

                }

            }
        );


        /* Navbar scroll state */

        window.addEventListener(
            "scroll",
            utils.throttle(
                updateNavbar,
                50
            ),
            { passive: true }
        );


        updateNavbar();

    }


    function toggleMobileMenu() {

        state.menuOpen = !state.menuOpen;

        DOM.navMenu.classList.toggle(
            "active",
            state.menuOpen
        );

        DOM.menuToggle.classList.toggle(
            "active",
            state.menuOpen
        );


        DOM.menuToggle.setAttribute(
            "aria-expanded",
            String(state.menuOpen)
        );


        document.body.classList.toggle(
            "menu-open",
            state.menuOpen
        );

    }


    function closeMobileMenu() {

        state.menuOpen = false;

        DOM.navMenu?.classList.remove(
            "active"
        );

        DOM.menuToggle?.classList.remove(
            "active"
        );

        DOM.menuToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );

    }


    function updateNavbar() {

        if (!DOM.header) return;

        const scrollY = window.scrollY;

        DOM.header.classList.toggle(
            "scrolled",
            scrollY > 50
        );

    }


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    function initActiveNavigation() {

        const sections =
            utils.selectAll("section[id]");

        const navLinks =
            utils.selectAll(".nav-link");


        if (!sections.length || !navLinks.length)
            return;


        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting)
                            return;


                        const id =
                            entry.target.id;


                        navLinks.forEach(link => {

                            const href =
                                link.getAttribute(
                                    "href"
                                );


                            link.classList.toggle(
                                "active",
                                href === `#${id}`
                            );

                        });

                    });

                },

                {
                    threshold: 0.25,
                    rootMargin: "-15% 0px -60% 0px"
                }

            );


        sections.forEach(section => {

            observer.observe(section);

        });

    }


    /* =========================================================
       SMOOTH SCROLL
    ========================================================= */

    function initSmoothScrolling() {

        const links =
            utils.selectAll(
                'a[href^="#"]'
            );


        links.forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    )
                        return;


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) return;


                    event.preventDefault();


                    const headerHeight =
                        DOM.header?.offsetHeight || 0;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight;


                    window.scrollTo({

                        top: targetPosition,

                        behavior:
                            utils.prefersReducedMotion()
                                ? "auto"
                                : "smooth"

                    });

                }
            );

        });

    }


    /* =========================================================
       SCROLL PROGRESS
    ========================================================= */

    function initScrollProgress() {

        if (!DOM.scrollProgress) return;


        const updateProgress =
            utils.throttle(() => {

                const scrollTop =
                    window.scrollY;


                const documentHeight =
                    document.documentElement
                        .scrollHeight -
                    window.innerHeight;


                if (documentHeight <= 0) {

                    DOM.scrollProgress.style.width =
                        "0%";

                    return;

                }


                const progress =
                    (scrollTop / documentHeight) *
                    100;


                DOM.scrollProgress.style.width =
                    `${utils.clamp(
                        progress,
                        0,
                        100
                    )}%`;

            }, 30);


        window.addEventListener(
            "scroll",
            updateProgress,
            { passive: true }
        );


        updateProgress();

    }


    /* =========================================================
       DARK / LIGHT MODE
    ========================================================= */

    function initTheme() {

        if (!DOM.themeToggle) return;


        const savedTheme =
            utils.safeStorageGet(
                "santhosh-theme"
            );


        const systemDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        const useDark =
            savedTheme
                ? savedTheme === "dark"
                : systemDark;


        applyTheme(useDark);


        DOM.themeToggle.addEventListener(
            "click",
            () => {

                applyTheme(
                    !state.darkMode
                );

            }
        );

    }


    function applyTheme(isDark) {

        state.darkMode = isDark;


        document.documentElement
            .classList.toggle(
                "dark-mode",
                isDark
            );


        document.body.classList.toggle(
            "dark-mode",
            isDark
        );


        const icon =
            DOM.themeToggle?.querySelector(
                "i"
            );


        if (icon) {

            icon.className = isDark
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";

        }


        DOM.themeToggle?.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );


        utils.safeStorageSet(
            "santhosh-theme",
            isDark
                ? "dark"
                : "light"
        );

    }


    /* =========================================================
       TYPING ANIMATION
    ========================================================= */

    function initTypingAnimation() {

        if (!DOM.typingText) return;


        const words = [

            "Data Scientist",

            "Data Analyst",

            "Machine Learning Enthusiast",

            "Python Developer",

            "BI Developer"

        ];


        if (utils.prefersReducedMotion()) {

            DOM.typingText.textContent =
                words[0];

            return;

        }


        const type = () => {

            const word =
                words[state.typingIndex];


            if (!state.deleting) {

                state.characterIndex++;


                DOM.typingText.textContent =
                    word.substring(
                        0,
                        state.characterIndex
                    );


                if (
                    state.characterIndex >=
                    word.length
                ) {

                    state.deleting = true;

                    state.typingTimer =
                        setTimeout(
                            type,
                            1800
                        );

                    return;

                }

            } else {

                state.characterIndex--;


                DOM.typingText.textContent =
                    word.substring(
                        0,
                        state.characterIndex
                    );


                if (
                    state.characterIndex <= 0
                ) {

                    state.deleting = false;

                    state.typingIndex =
                        (
                            state.typingIndex + 1
                        ) % words.length;

                }

            }


            const speed =
                state.deleting
                    ? 45
                    : 85;


            state.typingTimer =
                setTimeout(
                    type,
                    speed
                );

        };


        type();

    }


    /* =========================================================
       COUNTER ANIMATION
    ========================================================= */

    function initCounters() {

        const counters =
            utils.selectAll(".counter");


        if (!counters.length) return;


        const animateCounter =
            element => {

                if (
                    element.dataset.animated ===
                    "true"
                )
                    return;


                element.dataset.animated =
                    "true";


                const target =
                    parseFloat(
                        element.dataset.target
                    );


                if (!Number.isFinite(target))
                    return;


                const isDecimal =
                    !Number.isInteger(target);


                const duration =
                    utils.prefersReducedMotion()
                        ? 0
                        : 1400;


                if (duration === 0) {

                    element.textContent =
                        isDecimal
                            ? target.toFixed(2)
                            : target.toLocaleString();

                    return;

                }


                const startTime =
                    performance.now();


                const update =
                    currentTime => {

                        const elapsed =
                            currentTime -
                            startTime;


                        const progress =
                            utils.clamp(
                                elapsed /
                                duration,
                                0,
                                1
                            );


                        const eased =
                            1 -
                            Math.pow(
                                1 - progress,
                                4
                            );


                        const value =
                            target * eased;


                        element.textContent =
                            isDecimal
                                ? value.toFixed(2)
                                : Math.floor(
                                    value
                                ).toLocaleString();


                        if (progress < 1) {

                            requestAnimationFrame(
                                update
                            );

                        }

                    };


                requestAnimationFrame(
                    update
                );

            };


        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            animateCounter(
                                entry.target
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },

                {
                    threshold: 0.5
                }

            );


        counters.forEach(counter => {

            observer.observe(counter);

        });

    }


    /* =========================================================
       SKILL PROGRESS
    ========================================================= */

    function initSkillProgress() {

        const bars =
            utils.selectAll(
                ".skill-progress-bar"
            );


        if (!bars.length) return;


        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        )
                            return;


                        const bar =
                            entry.target;


                        const width =
                            bar.dataset.width ||
                            "0%";


                        requestAnimationFrame(
                            () => {

                                bar.style.width =
                                    width;

                            }
                        );


                        observer.unobserve(
                            bar
                        );

                    });

                },

                {
                    threshold: 0.4
                }

            );


        bars.forEach(bar => {

            bar.style.width = "0%";

            observer.observe(bar);

        });

    }


    /* =========================================================
       SKILL FILTER
    ========================================================= */

    function initSkillFilter() {

        const buttons =
            utils.selectAll(
                ".skill-filter"
            );


        const cards =
            utils.selectAll(
                ".skill-card"
            );


        if (!buttons.length || !cards.length)
            return;


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const filter =
                        button.dataset.filter ||
                        "all";


                    state.currentSkillFilter =
                        filter;


                    buttons.forEach(btn => {

                        btn.classList.toggle(
                            "active",
                            btn === button
                        );

                    });


                    cards.forEach(card => {

                        const category =
                            card.dataset.category;


                        const show =
                            filter === "all" ||
                            category === filter;


                        card.classList.toggle(
                            "hidden",
                            !show
                        );

                    });

                }
            );

        });

    }


    /* =========================================================
       PROJECT FILTER
    ========================================================= */

    function initProjectFilter() {

        const buttons =
            utils.selectAll(
                ".project-filter-btn"
            );


        const projects =
            utils.selectAll(
                ".project-card"
            );


        if (
            !buttons.length ||
            !projects.length
        )
            return;


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const filter =
                        button.dataset.filter ||
                        "all";


                    state.currentProjectFilter =
                        filter;


                    buttons.forEach(btn => {

                        btn.classList.toggle(
                            "active",
                            btn === button
                        );

                    });


                    projects.forEach(project => {

                        const category =
                            project.dataset.category;


                        const shouldShow =
                            filter === "all" ||
                            category === filter;


                        if (shouldShow) {

                            project.classList.remove(
                                "hidden"
                            );


                            if (
                                !utils.prefersReducedMotion()
                            ) {

                                project.animate(

                                    [
                                        {
                                            opacity: 0,
                                            transform:
                                                "translateY(20px)"
                                        },

                                        {
                                            opacity: 1,
                                            transform:
                                                "translateY(0)"
                                        }

                                    ],

                                    {
                                        duration: 350,
                                        easing:
                                            "cubic-bezier(.2,.8,.2,1)"
                                    }

                                );

                            }

                        } else {

                            project.classList.add(
                                "hidden"
                            );

                        }

                    });

                }
            );

        });

    }


    /* =========================================================
       AOS
    ========================================================= */

    function initAOS() {

        if (
            typeof AOS === "undefined"
        )
            return;


        AOS.init({

            duration:
                utils.prefersReducedMotion()
                    ? 0
                    : 750,

            easing:
                "ease-out-cubic",

            once: true,

            offset: 80,

            delay: 0,

            disable:
                utils.prefersReducedMotion()

        });

    }


    /* =========================================================
       BACK TO TOP
    ========================================================= */

    function initBackToTop() {

        if (!DOM.backToTop) return;


        const toggleButton =
            utils.throttle(() => {

                const visible =
                    window.scrollY > 600;


                DOM.backToTop.classList.toggle(
                    "visible",
                    visible
                );

            }, 100);


        window.addEventListener(
            "scroll",
            toggleButton,
            { passive: true }
        );


        DOM.backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({

                    top: 0,

                    behavior:
                        utils.prefersReducedMotion()
                            ? "auto"
                            : "smooth"

                });

            }
        );


        toggleButton();

    }


    /* =========================================================
       CONTACT FORM
    ========================================================= */

    function initContactForm() {

        if (!DOM.contactForm) return;


        DOM.contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "name"
                    )?.value.trim();


                const email =
                    document.getElementById(
                        "email"
                    )?.value.trim();


                const subject =
                    document.getElementById(
                        "subject"
                    )?.value.trim();


                const message =
                    document.getElementById(
                        "message"
                    )?.value.trim();


                if (
                    !name ||
                    !email ||
                    !subject ||
                    !message
                ) {

                    showFormStatus(
                        "Please complete all fields.",
                        "error"
                    );

                    return;

                }


                if (
                    !validateEmail(email)
                ) {

                    showFormStatus(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;

                }


                /*
                 * Front-end only:
                 * Open the user's email client.
                 *
                 * Replace this with Formspree,
                 * EmailJS, or your own backend
                 * when you want real submissions.
                 */

                const destination =
                    "your-email@example.com";


                const mailto =
                    `mailto:${destination}` +
                    `?subject=${encodeURIComponent(
                        subject
                    )}` +
                    `&body=${encodeURIComponent(
                        `Name: ${name}\n\n` +
                        `Email: ${email}\n\n` +
                        `Message:\n${message}`
                    )}`;


                showFormStatus(
                    "Opening your email client...",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        mailto;

                }, 500);

            }
        );

    }


    function validateEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    function showFormStatus(
        message,
        type
    ) {

        if (!DOM.formStatus) return;


        DOM.formStatus.textContent =
            message;


        DOM.formStatus.className =
            `form-status ${type}`;


        setTimeout(() => {

            if (DOM.formStatus) {

                DOM.formStatus.textContent =
                    "";

                DOM.formStatus.className =
                    "form-status";

            }

        }, 5000);

    }


    /* =========================================================
       LAZY REVEAL
    ========================================================= */

    function initRevealObserver() {

        const elements =
            utils.selectAll(
                "[data-reveal]"
            );


        if (!elements.length)
            return;


        if (
            utils.prefersReducedMotion()
        ) {

            elements.forEach(element => {

                element.classList.add(
                    "revealed"
                );

            });

            return;

        }


        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "revealed"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },

                {
                    threshold: 0.15
                }

            );


        elements.forEach(element => {

            observer.observe(element);

        });

    }


    /* =========================================================
       MAGNETIC BUTTON EFFECT
    ========================================================= */

    function initMagneticButtons() {

        if (
            utils.prefersReducedMotion()
        )
            return;


        const buttons =
            utils.selectAll(
                ".btn, .nav-connect"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    button.style.transform =
                        `translate(
                            ${x * 0.08}px,
                            ${y * 0.08}px
                        )`;

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "";

                }
            );

        });

    }


    /* =========================================================
       TILT EFFECT FOR CARDS
    ========================================================= */

    function initCardTilt() {

        if (
            utils.prefersReducedMotion()
        )
            return;


        const cards =
            utils.selectAll(
                ".project-card, .skill-card"
            );


        cards.forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    const rotateX =
                        (
                            y - centerY
                        ) / 25;


                    const rotateY =
                        (
                            centerX - x
                        ) / 25;


                    card.style.transform =
                        `perspective(1000px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-5px)`;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        });

    }


    /* =========================================================
       TERMINAL CURSOR EFFECT
    ========================================================= */

    function initTerminalEffect() {

        const terminal =
            utils.select(
                ".terminal-body"
            );


        if (!terminal) return;


        terminal.addEventListener(
            "click",
            () => {

                terminal.classList.toggle(
                    "focused"
                );

            }
        );

    }


    /* =========================================================
       PARALLAX HERO
    ========================================================= */

    function initHeroParallax() {

        if (
            utils.prefersReducedMotion()
        )
            return;


        const visual =
            utils.select(
                ".hero-visual"
            );


        if (!visual) return;


        window.addEventListener(

            "mousemove",

            utils.throttle(
                event => {

                    const x =
                        (
                            event.clientX /
                            window.innerWidth
                        ) - 0.5;


                    const y =
                        (
                            event.clientY /
                            window.innerHeight
                        ) - 0.5;


                    visual.style.transform =
                        `translate(
                            ${x * 12}px,
                            ${y * 12}px
                        )`;

                },
                30
            )

        );


        window.addEventListener(
            "mouseleave",
            () => {

                visual.style.transform =
                    "";

            }
        );

    }


    /* =========================================================
       YEAR
    ========================================================= */

    function initCurrentYear() {

        const yearElements =
            utils.selectAll(
                "[data-current-year]"
            );


        const currentYear =
            new Date().getFullYear();


        yearElements.forEach(element => {

            element.textContent =
                currentYear;

        });

    }


    /* =========================================================
       EXTERNAL LINK SECURITY
    ========================================================= */

    function secureExternalLinks() {

        const links =
            utils.selectAll(
                'a[target="_blank"]'
            );


        links.forEach(link => {

            const current =
                link.getAttribute(
                    "rel"
                ) || "";


            const values =
                new Set(
                    current
                        .split(" ")
                        .filter(Boolean)
                );


            values.add("noopener");
            values.add("noreferrer");


            link.setAttribute(
                "rel",
                [...values].join(" ")
            );

        });

    }


    /* =========================================================
       KEYBOARD ACCESSIBILITY
    ========================================================= */

    function initKeyboardSupport() {

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Tab"
                )
                    return;


                document.body.classList.add(
                    "keyboard-navigation"
                );

            }
        );


        document.addEventListener(
            "mousedown",
            () => {

                document.body.classList.remove(
                    "keyboard-navigation"
                );

            }
        );

    }


    /* =========================================================
       IMAGE ERROR HANDLING
    ========================================================= */

    function initImageFallbacks() {

        const images =
            utils.selectAll("img");


        images.forEach(image => {

            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "image-error"
                    );

                },
                { once: true }
            );

        });

    }


    /* =========================================================
       PERFORMANCE MONITORING
    ========================================================= */

    function initPerformanceOptimizations() {

        const heavyElements =
            utils.selectAll(
                ".hero-visual, .project-image"
            );


        if (
            utils.prefersReducedMotion()
        ) {

            heavyElements.forEach(
                element => {

                    element.style.animation =
                        "none";

                }
            );

        }

    }


    /* =========================================================
       INITIALIZE APPLICATION
    ========================================================= */

    function init() {

        if (state.initialized)
            return;


        state.initialized = true;


        document.body.classList.add(
            "loading"
        );


        initLoader();

        initNavigation();

        initActiveNavigation();

        initSmoothScrolling();

        initScrollProgress();

        initTheme();

        initTypingAnimation();

        initCounters();

        initSkillProgress();

        initSkillFilter();

        initProjectFilter();

        initAOS();

        initBackToTop();

        initContactForm();

        initRevealObserver();

        initMagneticButtons();

        initCardTilt();

        initTerminalEffect();

        initHeroParallax();

        initCurrentYear();

        secureExternalLinks();

        initKeyboardSupport();

        initImageFallbacks();

        initPerformanceOptimizations();

    }


    /* =========================================================
       PUBLIC API
    ========================================================= */

    return {

        init,

        toggleTheme: () => {

            applyTheme(
                !state.darkMode
            );

        },

        closeMenu: closeMobileMenu

    };

})();


/* =========================================================
   START APPLICATION
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        PortfolioApp.init,
        { once: true }
    );

} else {

    PortfolioApp.init();

}
