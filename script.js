// Portfolio JavaScript - All buttons working
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded successfully');
    
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    // Helper function for smooth scrolling
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = document.querySelector('.header')?.offsetHeight || 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // 2. Smooth Scrolling for Navigation and Contact Button
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's a download button
            if (this.id === 'downloadResumeHero' || this.id === 'downloadResume') {
                return;
            }
            
            if (href === '#' || href === '#0') return;
            
            e.preventDefault();
            
            // Close mobile menu if open
            if (hamburger && navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
            
            // Scroll to target
            smoothScrollTo(href);
            
            // Update URL
            window.history.pushState({}, '', href);
        });
    });
    
    // 3.// Resume Download Functionality
    const downloadButtons = [
        document.getElementById('downloadResume'),
        document.getElementById('downloadResumeHero')
    ];
    const resumeStatus = document.getElementById('resumeStatus');
    
    async function handleResumeDownload(e) {
        if (e) e.preventDefault();
        
        const statusElement = document.getElementById('resumeStatus');
        const button = e?.currentTarget;
        
        // Show loading state
        if (button) {
            button.disabled = true;
            button.classList.add('downloading');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
        }
        
        if (statusElement) {
            statusElement.textContent = 'Preparing your resume...';
            statusElement.style.color = '#4CAF50';
            statusElement.style.opacity = '1';
        }
        
        try {
            // Add a small delay to show the loading state
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.href = 'resume/Resume.jpeg';
            link.download = 'Rahbar_Islam_Resume.jpg';
            
            // For mobile browsers, open in new tab
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                window.open(link.href, '_blank');
                if (statusElement) {
                    statusElement.textContent = 'Opening resume in new tab...';
                }
            } else {
                // For desktop, trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                if (statusElement) {
                    statusElement.textContent = 'Download started! Check your downloads folder.';
                }
            }
            
            // Log the download event
            console.log('Resume download triggered');
            
        } catch (error) {
            console.error('Error downloading resume:', error);
            
            if (statusElement) {
                statusElement.textContent = 'Error: Could not download resume. Trying alternative method...';
                statusElement.style.color = '#f4436d';
                
                // Fallback: Open in new tab if download fails
                try {
                    const fallbackLink = document.createElement('a');
                    fallbackLink.href = 'resume/Resume.jpeg';
                    fallbackLink.target = '_blank';
                    document.body.appendChild(fallbackLink);
                    fallbackLink.click();
                    document.body.removeChild(fallbackLink);
                    
                    statusElement.textContent = 'Opened resume in new tab.';
                } catch (fallbackError) {
                    console.error('Fallback download failed:', fallbackError);
                    statusElement.textContent = 'Error: Could not open resume. Please try again later.';
                }
            }
        } finally {
            // Reset button state
            if (button) {
                setTimeout(() => {
                    button.disabled = false;
                    button.classList.remove('downloading');
                    button.innerHTML = '<i class="fas fa-download"></i><span>Download Resume</span><div class="btn-hover-effect"></div>';
                    
                    // Fade out status message after delay
                    if (statusElement) {
                        setTimeout(() => {
                            statusElement.style.opacity = '0';
                            setTimeout(() => {
                                statusElement.textContent = '';
                                statusElement.style.opacity = '1';
                            }, 300);
                        }, 3000);
                    }
                }, 500);
            }
        }
    }
    
    // Add click events to all download buttons
    downloadButtons.forEach((button, index) => {
        if (button) {
            button.removeEventListener('click', handleResumeDownload); // Remove existing to prevent duplicates
            button.addEventListener('click', handleResumeDownload);
            console.log(`Added click handler to download button ${index + 1}`);
        } else {
            console.warn(`Download button ${index + 1} not found`);
        }
    });
    
    // 4. Sticky Header and Back to Top Button
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('backToTop');
    let lastScroll = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.scrollY;
            
            // Sticky header
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Show/hide back to top button
            if (backToTopBtn) {
                if (currentScroll > 500) {
                    backToTopBtn.classList.add('active');
                } else {
                    backToTopBtn.classList.remove('active');
                }
            }
            
            lastScroll = currentScroll;
            
            // Highlight active navigation link
            highlightNav();
        });
    }
    
    // Back to top button click handler
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    
    function highlightNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinkItems.forEach(link => {
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', formObject);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in-up');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in-up');
            }
        });
    };
    
    // Add animation class to elements
    const animateElements = document.querySelectorAll('.project-card, .certification-card, .skill-category, .timeline-item');
    
    animateElements.forEach((element, index) => {
        element.classList.add('fade-in-up');
        element.style.animationDelay = `${index * 0.1}s`;
    });
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize animations on page load
    animateOnScroll();
    
    // Project filter functionality (if needed)
    // You can add filtering for projects by category here
    
    // Initialize any tooltips or other UI elements
    initializeTooltips();
});

// Initialize tooltips
function initializeTooltips() {
    // You can add tooltip initialization code here if needed
    // For example, using a library like Tippy.js or similar
}

// Back to top button functionality
document.getElementById('backToTop')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add loading animation
window.addEventListener('load', function() {
    // You can add a loading animation here if needed
    // For example, fading in the entire page after everything is loaded
    document.body.classList.add('loaded');
});

// Handle form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Add event listeners for form validation
const formInputs = document.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('error');
        }
    });
});
