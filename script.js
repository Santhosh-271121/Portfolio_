/* =========================================================
   SANTHOSH C — DATA SCIENCE PORTFOLIO
   ADVANCED JAVASCRIPT
   ========================================================= */

"use strict";


/* ================= DOM ================= */

const body = document.body;

const loader =
    document.getElementById("loader");

const header =
    document.getElementById("header");

const scrollProgress =
    document.getElementById("scrollProgress");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

const themeToggle =
    document.getElementById("themeToggle");

const backToTop =
    document.getElementById("backToTop");

const typingText =
    document.getElementById("typingText");

const currentYear =
    document.getElementById("currentYear");


/* ================= PAGE LOADER ================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        loader?.classList.add("hidden");

    }, 500);

});


/* ================= CURRENT YEAR ================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* ================= HEADER SCROLL ================= */

function handleHeader() {

    if (window.scrollY > 40) {

        header?.classList.add("scrolled");

    } else {

        header?.classList.remove("scrolled");

    }

}

window.addEventListener(
    "scroll",
    handleHeader,
    { passive: true }
);

handleHeader();


/* ================= MOBILE MENU ================= */

menuToggle?.addEventListener(
    "click",
    () => {

        navMenu?.classList.toggle("open");

        const icon =
            menuToggle.querySelector("i");

        const isOpen =
            navMenu?.classList.contains("open");

        if (icon) {

            icon.className =
                isOpen
                    ? "fa-solid fa-xmark"
                    : "fa-solid fa-bars";

        }

    }
);


/* CLOSE MENU */

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navMenu?.classList.remove("open");

                const icon =
                    menuToggle?.querySelector("i");

                if (icon) {

                    icon.className =
                        "fa-solid fa-bars";

                }

            }
        );

    });


/* ================= ACTIVE NAVIGATION ================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");

const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const id =
                        entry.target.getAttribute("id");

                    navLinks.forEach(link => {

                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            `#${id}`
                        ) {

                            link.classList.add("active");

                        }

                    });

                }

            });

        },
        {
            rootMargin:
                "-35% 0px -55% 0px"
        }
    );

sections.forEach(section => {

    sectionObserver.observe(section);

});


/* ================= SCROLL PROGRESS ================= */

function updateScrollProgress() {

    const scrollTop =
        window.scrollY;

    const scrollHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const percentage =
        scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

    if (scrollProgress) {

        scrollProgress.style.width =
            `${percentage}%`;

    }

}

window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
);


/* ================= THEME ================= */

const savedTheme =
    localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {

    body.classList.add("light");

}


function updateThemeIcon() {

    const icon =
        themeToggle?.querySelector("i");

    if (!icon) return;

    const light =
        body.classList.contains("light");

    icon.className =
        light
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";

}

updateThemeIcon();


themeToggle?.addEventListener(
    "click",
    () => {

        body.classList.toggle("light");

        const theme =
            body.classList.contains("light")
                ? "light"
                : "dark";

        localStorage.setItem(
            "portfolio-theme",
            theme
        );

        updateThemeIcon();

    }
);


/* ================= TYPING EFFECT ================= */

const typingWords = [

    "Data Scientist",
    "Data Analyst",
    "Machine Learning Enthusiast",
    "Python Developer",
    "Power BI Developer"

];

let wordIndex = 0;
let characterIndex = 0;
let deleting = false;


function typeEffect() {

    if (!typingText) return;

    const word =
        typingWords[wordIndex];

    if (!deleting) {

        typingText.textContent =
            word.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;

        if (
            characterIndex ===
            word.length
        ) {

            deleting = true;

            setTimeout(
                typeEffect,
                1500
            );

            return;
        }

    } else {

        typingText.textContent =
            word.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;

        if (characterIndex === 0) {

            deleting = false;

            wordIndex =
                (wordIndex + 1) %
                typingWords.length;

        }

    }

    setTimeout(
        typeEffect,
        deleting ? 45 : 90
    );

}

typeEffect();


/* ================= COUNTERS ================= */

const counters =
    document.querySelectorAll(".counter");

const counterObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const counter =
                    entry.target;

                const target =
                    parseFloat(
                        counter.dataset.target
                    );

                const isYear =
                    target >= 2000;

                const duration =
                    1500;

                const start =
                    performance.now();

                function animate(now) {

                    const progress =
                        Math.min(
                            (now - start) /
                            duration,
                            1
                        );

                    const value =
                        target * progress;

                    if (isYear) {

                        counter.textContent =
                            Math.floor(value);

                    } else {

                        counter.textContent =
                            value.toFixed(2);

                    }

                    if (progress < 1) {

                        requestAnimationFrame(
                            animate
                        );

                    }

                }

                requestAnimationFrame(
                    animate
                );

                counterObserver.unobserve(
                    counter
                );

            });

        },
        {
            threshold: .6
        }
    );

counters.forEach(counter => {

    counterObserver.observe(counter);

});


/* ================= SKILL FILTER ================= */

const skillFilters =
    document.querySelectorAll(
        ".skill-filter"
    );

const skillCards =
    document.querySelectorAll(
        ".skill-card"
    );


skillFilters.forEach(filter => {

    filter.addEventListener(
        "click",
        () => {

            skillFilters.forEach(button =>
                button.classList.remove("active")
            );

            filter.classList.add("active");

            const selected =
                filter.dataset.filter;

            skillCards.forEach(card => {

                const category =
                    card.dataset.category;

                const show =
                    selected === "all" ||
                    category === selected;

                card.classList.toggle(
                    "hidden",
                    !show
                );

            });

        }
    );

});


/* ================= PROJECT FILTER ================= */

const projectFilters =
    document.querySelectorAll(
        ".project-filter"
    );

const projectCards =
    document.querySelectorAll(
        ".project-card"
    );


projectFilters.forEach(filter => {

    filter.addEventListener(
        "click",
        () => {

            projectFilters.forEach(button =>
                button.classList.remove("active")
            );

            filter.classList.add("active");

            const selected =
                filter.dataset.filter;

            projectCards.forEach(card => {

                const categories =
                    card.dataset.category
                        ?.split(" ") || [];

                const show =
                    selected === "all" ||
                    categories.includes(selected);

                card.classList.toggle(
                    "hidden",
                    !show
                );

            });

        }
    );

});


/* ================= AOS ================= */

if (typeof AOS !== "undefined") {

    AOS.init({

        duration: 800,

        easing:
            "ease-out-cubic",

        once: true,

        offset: 70,

        disable: () =>
            window.innerWidth < 600

    });

}


/* ================= BACK TO TOP ================= */

function updateBackToTop() {

    if (!backToTop) return;

    if (window.scrollY > 600) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

}

window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
);

backToTop?.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* ================= MAGNETIC BUTTONS ================= */

const magneticButtons =
    document.querySelectorAll(".magnetic");

magneticButtons.forEach(button => {

    button.addEventListener(
        "mousemove",
        event => {

            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) return;

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
                `translate(${x * .08}px, ${y * .08}px)`;

        }
    );

    button.addEventListener(
        "mouseleave",
        () => {

            button.style.transform = "";

        }
    );

});


/* ================= TERMINAL EFFECT ================= */

const terminal =
    document.querySelector(".terminal");

terminal?.addEventListener(
    "click",
    () => {

        terminal.classList.add(
            "terminal-active"
        );

        setTimeout(
            () => {
                terminal.classList.remove(
                    "terminal-active"
                );
            },
            400
        );

    }
);


/* ================= HERO PARALLAX ================= */

const heroVisual =
    document.querySelector(".hero-visual");

window.addEventListener(
    "mousemove",
    event => {

        if (!heroVisual) return;

        if (
            window.innerWidth < 900
        ) return;

        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) return;

        const x =
            (window.innerWidth / 2 -
                event.clientX) / 80;

        const y =
            (window.innerHeight / 2 -
                event.clientY) / 80;

        heroVisual.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


/* ================= KEYBOARD ACCESSIBILITY ================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            navMenu?.classList.remove(
                "open"
            );

            const icon =
                menuToggle?.querySelector("i");

            if (icon) {

                icon.className =
                    "fa-solid fa-bars";

            }

        }

    }
);


/* ================= EXTERNAL LINKS ================= */

document
    .querySelectorAll(
        'a[target="_blank"]'
    )
    .forEach(link => {

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    });


/* ================= IMAGE FALLBACK ================= */

document
    .querySelectorAll("img")
    .forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.style.display =
                    "none";

            }
        );

    });


/* ================= CONSOLE ================= */

console.log(
    "%cSanthosh C — Data Science Portfolio",
    "font-size:18px;font-weight:bold;"
);

console.log(
    "%cPython • SQL • Machine Learning • Power BI",
    "font-size:12px;"
);


/* ================= PERFORMANCE ================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);
