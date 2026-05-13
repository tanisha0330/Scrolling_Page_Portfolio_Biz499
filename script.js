// ==========================================
// 1. REGISTER PLUGINS
// ==========================================
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ==========================================
// 2. SCROLLSMOOTHER SETUP (Global)
// ==========================================
// NOTE: Make sure your HTML has <div id="smooth-wrapper"> and <div id="smooth-content"> wrapping your sections!
const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5, // 1.5 seconds ki silky smooth lag
    effects: true,
    smoothTouch: 0.1 // Mobile par bhi slight smooth scroll ke liye
});

// ==========================================
// 3. ANCHOR LINKS SMOOTH SCROLLING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Default jhatke wala jump band karein
        const targetId = this.getAttribute('href');
        
        // ScrollSmoother ka apna function use karke target tak slide karein
        smoother.scrollTo(targetId, true, "top top"); 
    });
});

// ==========================================
// 4. MAIN SECTIONS ANIMATIONS (Loop)
// ==========================================
const sections = gsap.utils.toArray('.section');

sections.forEach((section, i) => {
    // Current section colors
    const bgColor = section.getAttribute('data-bg-color');
    const textColor = section.getAttribute('data-text-color');

    // Previous section colors (Defaults to Hero colors if it's the first project)
    const prevBgColor = i > 0 ? sections[i - 1].getAttribute('data-bg-color') : '#121212';
    const prevTextColor = i > 0 ? sections[i - 1].getAttribute('data-text-color') : '#ffffff';

    // 1. BACKGROUND TRANSITION (Fixed for Reverse Scroll & ScrollSmoother Wrapper)
    // NAYA: "body" aur "#smooth-wrapper" dono ka color change karega taaki kuch chhupe nahi
    gsap.fromTo("body, #smooth-wrapper", 
        { backgroundColor: prevBgColor }, 
        {
            backgroundColor: bgColor,
            immediateRender: false,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom", 
                end: "center center", 
                scrub: 1 
            }
        }
    );

    // 2. GLOBAL TEXT COLOR TRANSITION
    gsap.fromTo(".logo, .subtitle, .global-contact span", 
        { color: prevTextColor }, 
        {
            color: textColor,
            immediateRender: false,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "center center",
                scrub: 1
            }
        }
    );

    // 3. SPECIFIC PROJECT TEXT COLORS 
    gsap.to(section.querySelectorAll(".project-num, .project-title, .project-desc, .see-live"), {
        color: textColor,
        scrollTrigger: {
            trigger: section,
            start: "top center",
            toggleActions: "play none none reverse"
        }
    });

    // 4. CONTINUOUS PATTERN MOVEMENT IN SHAPES
    const movingPattern = section.querySelector(".moving-pattern");
    if (movingPattern) {
        gsap.to(movingPattern, {
            xPercent: 10, 
            yPercent: 10, 
            ease: "sine.inOut",
            repeat: -1, // Infinite loop
            yoyo: true, // Pan back and forth smoothly
            duration: 10 // Slow, calm movement
        });
    }

    // 5. 3D MOUSE MOVE ANIMATION (DYNAMIC PARALLAX)
    const projectFlex = section.querySelector(".project-flex");
    const square = section.querySelector(".project-square");
    const details = section.querySelector(".project-details");
    const patternShape = section.querySelector(".project-pattern");
    
    const innerPattern = patternShape ? patternShape.querySelector(".moving-pattern") : null;

    if (projectFlex && square && details && innerPattern) {
        
        section.addEventListener("mousemove", (e) => {
            const rect = section.getBoundingClientRect();
            
            const xNorm = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const yNorm = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            gsap.to(square, {
                rotationY: xNorm * 10,   
                rotationX: -yNorm * 10,  
                x: xNorm * 20,           
                y: yNorm * 20,
                transformPerspective: 1000, 
                ease: "power2.out",      
                duration: 0.5
            });

            gsap.to(details, {
                x: -xNorm * 30,          
                y: -yNorm * 30,
                ease: "power2.out",
                duration: 0.5
            });

            gsap.to(innerPattern, {
                x: -xNorm * 50,          
                y: -yNorm * 50,
                ease: "power2.out",
                duration: 0.5
            });
        });

        section.addEventListener("mouseleave", () => {
            gsap.to([square, details, innerPattern], {
                rotationY: 0,
                rotationX: 0,
                x: 0,
                y: 0,
                ease: "power3.out", 
                duration: 0.8
            });
        });
    }

    // 6. SCROLL FADE-UP REVEAL
    gsap.from(section.querySelectorAll(".project-square, .project-details, .project-pattern"), {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    // 7. DYNAMIC SIDEBAR HIGHLIGHTING
    const numbersSidebar = document.querySelector('.numbers-sidebar');
    const navNumbers = document.querySelectorAll('.numbers-sidebar span');

    ScrollTrigger.create({
        trigger: section,
        start: "top center", 
        end: "bottom center",
        onEnter: () => updateSidebar(i),
        onEnterBack: () => updateSidebar(i) 
    });

    function updateSidebar(index) {
        if (index === 0) {
            numbersSidebar.style.opacity = "0";
        } else {
            numbersSidebar.style.opacity = "1";
            navNumbers.forEach(num => num.classList.remove('active'));
            
            if (navNumbers[index - 1]) {
                navNumbers[index - 1].classList.add('active');
            }
        }
    }
});

// ==========================================
// 5. FORM TOGGLE FUNCTION
// ==========================================
function toggleOtherField() {
    const selectBox = document.getElementById("bizTypeSelect");
    const otherInput = document.getElementById("otherBizInput");
    
    if (selectBox.value === "other") {
        otherInput.style.display = "block";
        otherInput.setAttribute("required", "true");
    } else {
        otherInput.style.display = "none";
        otherInput.removeAttribute("required");
        otherInput.value = ""; 
    }
}

// ==========================================
// 6. DYNAMIC SPOTLIGHT GLOW EFFECT
// ==========================================
const glowSections = document.querySelectorAll('.glow-effect');

glowSections.forEach(section => {
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Glow permanently ON
        section.style.setProperty('--glow-active', '1');
        
        section.style.setProperty('--mouse-x', `${x}px`);
        section.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ==========================================
// 7. POPUP MODAL LOGIC
// ==========================================
const dummyForm = document.getElementById('bizLeadForm');
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.querySelector('.modal-close-btn');

if (dummyForm && contactModal) {
    // 1. Dummy form ke kisi bhi hisse par click karne se Modal khulega
    dummyForm.addEventListener('click', (e) => {
        e.preventDefault(); 
        contactModal.classList.add('active');
    });

    // 2. Cross (X) button par click karne se Modal band hoga
    closeModalBtn.addEventListener('click', () => {
        contactModal.classList.remove('active');
    });

    // 3. Modal box ke bahar (dark area me) click karne se bhi band hoga
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
        }
    });
}


// ==========================================
// NAYA: EXTERNAL PAGE SE AANE WALE # LINKS KO HANDLE KARNA
// ==========================================
window.addEventListener("load", () => {
    // Check karega ki URL mein koi # hai ya nahi (jaise #section-1)
    if (window.location.hash) {
        // Halka sa delay taaki page poora load ho jaye, fir smooth scroll kare
        setTimeout(() => {
            smoother.scrollTo(window.location.hash, true, "top top");
        }, 200);
    }
});