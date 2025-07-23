// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links - Fixed version
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Handle special case for home link
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offsetTop = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background to navbar on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Form handling - Fixed version to prevent jumping
    const inquiryForm = document.getElementById('inquiryForm');
    const formMessage = document.getElementById('formMessage');
    
    if (inquiryForm) {
        // Prevent form from causing page jumps
        const formInputs = inquiryForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', function(e) {
                // Prevent any unwanted scrolling on focus
                e.preventDefault();
            });
            
            input.addEventListener('input', function(e) {
                // Prevent any unwanted scrolling on input
                e.stopPropagation();
            });
        });
        
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Show loading state
            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Prepare form data
            const formData = new FormData(inquiryForm);
            
            // Add additional information to the form data
            const timestamp = new Date().toLocaleString();
            formData.append('_subject', 'New Inquiry from Rajasthan Silica Quartz Website');
            formData.append('_cc', 'Chittora.learning@gmail.com');
            formData.append('_autoresponse', 'Thank you for your inquiry. We will contact you within 24 hours with a detailed quote and product information.');
            formData.append('timestamp', timestamp);
            formData.append('source', 'Website Contact Form');
            
            // Submit form using fetch
            fetch(inquiryForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .then(data => {
                // Show success message
                showFormMessage('Thank you for your inquiry! We will contact you within 24 hours with detailed information about our silica quartz products.', 'success');
                
                // Reset form
                inquiryForm.reset();
                
                // Track successful submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'engagement',
                        'event_label': 'inquiry_form'
                    });
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showFormMessage('Sorry, there was an error submitting your inquiry. Please try again or contact us directly via phone or WhatsApp.', 'error');
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            });
        });
    }
    
    // Form validation function
    function validateForm() {
        const requiredFields = inquiryForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            
            // Remove existing error styling
            field.classList.remove('is-invalid');
            
            if (!value) {
                field.classList.add('is-invalid');
                isValid = false;
            }
            
            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    field.classList.add('is-invalid');
                    isValid = false;
                }
            }
        });
        
        if (!isValid) {
            showFormMessage('Please fill in all required fields correctly.', 'error');
        }
        
        return isValid;
    }
    
    // Show form message function
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
        formMessage.style.display = 'block';
        
        // Don't scroll to message to prevent jumping
        
        // Hide message after 8 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 8000);
    }
    
    // Add invalid field styling
    const style = document.createElement('style');
    style.textContent = `
        .form-control.is-invalid {
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
        .form-control.is-invalid:focus {
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    // WhatsApp integration
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Open WhatsApp in new tab
            window.open(this.href, '_blank');
            
            // Track WhatsApp click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'contact',
                    'event_label': 'whatsapp'
                });
            }
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in animation to key elements
    const animatedElements = document.querySelectorAll('.product-card, .process-step, .export-card, .mining-card');
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
    
    // Add hover effects to cards - but don't interfere with scrolling
    const cards = document.querySelectorAll('.product-card, .process-step, .export-card, .mining-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Mobile navigation handling
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a nav link
        const mobileNavLinks = navbarCollapse.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    // Use Bootstrap's collapse method if available
                    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    } else {
                        navbarToggler.click();
                    }
                }
            });
        });
    }
    
    // Contact form auto-fill from URL parameters (if any)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('product')) {
        const productSelect = document.getElementById('product');
        if (productSelect) {
            const productParam = urlParams.get('product');
            const options = productSelect.querySelectorAll('option');
            options.forEach(option => {
                if (option.value.toLowerCase().includes(productParam.toLowerCase())) {
                    option.selected = true;
                }
            });
        }
    }
    
    // Initialize tooltips if Bootstrap tooltips are available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Add click tracking for product quote buttons
    const quoteButtons = document.querySelectorAll('a[href="#inquiry"]');
    quoteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Get the product grade from the card
            const productCard = this.closest('.product-card');
            if (productCard) {
                const productTitle = productCard.querySelector('h3').textContent;
                
                // Pre-fill the product field if we can determine it
                setTimeout(() => {
                    const productSelect = document.getElementById('product');
                    if (productSelect) {
                        const options = productSelect.querySelectorAll('option');
                        options.forEach(option => {
                            if (productTitle.includes('Grade A') && option.value.includes('Premium Grade A')) {
                                option.selected = true;
                            } else if (productTitle.includes('Grade B') && option.value.includes('Industrial Grade B')) {
                                option.selected = true;
                            } else if (productTitle.includes('Grade C') && option.value.includes('Commercial Grade C')) {
                                option.selected = true;
                            }
                        });
                    }
                }, 500);
            }
            
            // Track product interest
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'product_interest',
                    'event_label': productCard ? productCard.querySelector('h3').textContent : 'unknown'
                });
            }
        });
    });
    
    // Add loading states for external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]:not([href*="wa.me"])');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-external-link-alt me-2"></i>Opening...';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Performance optimization: Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close mobile menu
        if (e.key === 'Escape' && navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            } else {
                navbarToggler.click();
            }
        }
        
        // Enter key to submit form when focused on submit button
        if (e.key === 'Enter' && document.activeElement === document.querySelector('button[type="submit"]')) {
            e.preventDefault();
            document.activeElement.click();
        }
    });
    
    // Add error handling for failed image loads
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
    
    // Fix any potential scroll issues by ensuring smooth behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize the page
    console.log('Rajasthan Silica Quartz Suppliers website initialized successfully');
    
    // Add structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Rajasthan Silica Quartz Suppliers",
        "description": "Premium high-purity silica quartz supplier from Rajasthan, India",
        "url": window.location.origin,
        "logo": window.location.origin + "/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-98765-43210",
            "contactType": "sales",
            "email": "Chittora.learning@gmail.com"
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Industrial Area",
            "addressLocality": "Udaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "313001",
            "addressCountry": "IN"
        },
        "sameAs": [
            "https://wa.me/919876543210"
        ]
    };
    
    // Add structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
});