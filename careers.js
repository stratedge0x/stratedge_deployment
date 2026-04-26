/*
  STRATEGE ADVISORY — Careers Page Interactions
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Typewriter Effect
    const texts = [
        "Join the Team.",
        "Architect the Future.",
        "Elevate the Gulf."
    ];
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    const typeWriterElement = document.getElementById('careersTypewriterText');
    
    function type() {
        if (!typeWriterElement) return;

        const currentText = texts[currentTextIndex];
        
        if (isDeleting) {
            typeWriterElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50; // delete faster
        } else {
            typeWriterElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100; // type slower
        }

        if (!isDeleting && currentCharIndex === currentText.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;

            // Trigger subtitle & actions visibility when the first word finishes typing
            if (currentTextIndex === 0) {
                careersSubtitle?.classList.add('visible');
                careersActions?.classList.add('visible');
            }

        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            // Move to next word
            currentTextIndex = (currentTextIndex + 1) % texts.length;
            // Pause before typing next word
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }
    
    
    const careersLabel = document.getElementById('heroLabel');
    const careersSubtitle = document.getElementById('heroSubtitle');
    const careersActions = document.getElementById('heroActions');

    // Show label shortly after load
    setTimeout(() => careersLabel?.classList.add('visible'), 400);

    // Start typewriter a bit after the label
    setTimeout(type, 1000);


    // 2. Scroll-Synced Border Animation for Culture Pillars
    const observePillars = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class to trigger CSS border fill animation
                entry.target.classList.add('scrolled');
                // Optional: stop observing once animated
                // observePillars.unobserve(entry.target);
            } else {
                // Reset if you want it to animate again when scrolling up
                entry.target.classList.remove('scrolled');
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% of the box is visible
    });

    const pillars = document.querySelectorAll('.pillar-box');
    pillars.forEach(pillar => observePillars.observe(pillar));

});
