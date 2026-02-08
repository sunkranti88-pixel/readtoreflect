/* ============================================
   READ TO REFLECT - PROFESSIONAL JAVASCRIPT
   ============================================ */

'use strict';

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFormHandling();
    initializeScrollEffects();
    initializeAccessibility();
    console.log('Read to Reflect loaded successfully ✨');
});

// ============================================
// NAVIGATION
// ============================================
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const ctaButton = document.querySelector('.cta-button');
    const logo = document.querySelector('.logo');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu?.classList.toggle('active');
        });
    }

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId, sections, navLinks);
            
            // Close mobile menu
            if (navMenu?.classList.contains('active')) {
                navToggle?.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    });

    // Logo click
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection('home', sections, navLinks);
        });
    }

    // CTA button
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const sectionId = ctaButton.getAttribute('data-section');
            navigateToSection(sectionId, sections, navLinks);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Set initial active section
    const homeLink = document.querySelector('[data-section="home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
}

function navigateToSection(sectionId, sections, navLinks) {
    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`[data-section="${sectionId}"]`);

    if (!targetSection) return;

    // Update sections
    sections.forEach(section => section.classList.remove('active'));
    targetSection.classList.add('active');

    // Update nav links
    navLinks.forEach(link => link.classList.remove('active'));
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Announce for screen readers
    announceNavigation(sectionId);
}

// ============================================
// FORM HANDLING
// ============================================
function initializeFormHandling() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors();

        // Collect form data
        const formData = {
            childName: document.getElementById('name').value.trim(),
            parentName: document.getElementById('parent-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            age: document.getElementById('age').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toLocaleString()
        };

        // Validate
        if (!validateForm(formData)) return;

        // Save and show success
        saveFormData(formData);
        displayFormSuccess();
        form.reset();
    });
}

function validateForm(data) {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.childName) {
        errors.name = 'Child\'s name is required';
    }
    if (!data.parentName) {
        errors.parentName = 'Parent/guardian name is required';
    }
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(data.email)) {
        errors.email = 'Please enter a valid email';
    }
    if (!data.age) {
        errors.age = 'Age is required';
    } else if (data.age < 4 || data.age > 18) {
        errors.age = 'Age must be between 4 and 18';
    }
    if (!data.message) {
        errors.message = 'Please tell us about your child';
    }

    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return false;
    }

    return true;
}

function displayFormErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
        const input = document.getElementById(fieldName === 'parentName' ? 'parent-name' : fieldName);
        const errorElement = document.getElementById(`${fieldName === 'parentName' ? 'parent-name' : fieldName}-error`);

        if (input) {
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
        }
        if (errorElement) {
            errorElement.textContent = errors[fieldName];
            errorElement.classList.add('show');
        }
    });
}

function clearFormErrors() {
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    const errors = document.querySelectorAll('.error-message');

    inputs.forEach(input => {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
    });
    errors.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
}

function displayFormSuccess() {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = '✨ Thank you! We\'ll be in touch soon to welcome your child to our reading family.';
        formMessage.className = 'form-message success';
        formMessage.setAttribute('role', 'alert');

        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 6000);
    }
}

function saveFormData(data) {
    try {
        let submissions = JSON.parse(localStorage.getItem('readToReflectSubmissions')) || [];
        submissions.push(data);
        // Keep last 100 submissions
        submissions = submissions.slice(-100);
        localStorage.setItem('readToReflectSubmissions', JSON.stringify(submissions));
        console.log('Form submission saved ✓');
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    const elements = document.querySelectorAll(
        '.about-card, .timeline-item, .highlight-item, .founder-card, .contact-form-container, .contact-info'
    );

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// ACCESSIBILITY
// ============================================
function initializeAccessibility() {
    // Keyboard navigation (Alt + number for sections)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && /[1-5]/.test(e.key)) {
            const sectionMap = {
                '1': 'home',
                '2': 'about',
                '3': 'sessions',
                '4': 'founder',
                '5': 'contact'
            };
            navigateToSection(sectionMap[e.key], document.querySelectorAll('.section'), document.querySelectorAll('.nav-link'));
        }
    });

    // Focus management
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.addEventListener('focus', () => {
            console.log('Main content focused');
        }, true);
    }
}

function announceNavigation(sectionName) {
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    
    const sectionTitles = {
        'home': 'Home - Read to Reflect',
        'about': 'About section',
        'sessions': 'How sessions work',
        'founder': 'Meet the founder',
        'contact': 'Get in touch'
    };

    announcement.textContent = `Navigated to ${sectionTitles[sectionName] || sectionName}`;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1500);
}

// ============================================
// UTILITY: Admin Functions
// ============================================

/**
 * Get all form submissions from localStorage
 */
function getFormSubmissions() {
    try {
        return JSON.parse(localStorage.getItem('readToReflectSubmissions')) || [];
    } catch {
        return [];
    }
}

/**
 * Export submissions as JSON file
 */
function exportFormSubmissions() {
    const submissions = getFormSubmissions();
    const dataStr = JSON.stringify(submissions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `read-to-reflect-submissions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Clear all form submissions
 */
function clearFormSubmissions() {
    if (confirm('Are you sure? This cannot be undone.')) {
        localStorage.removeItem('readToReflectSubmissions');
        console.log('✓ All submissions cleared');
    }
}

// ============================================
// UTILITY: Visual Effects
// ============================================

/**
 * Detect dark mode preference
 */
function prefersDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Performance optimization: lazy load images (if any added in future)
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Make admin functions accessible in console if needed
window.readToReflect = {
    getSubmissions: getFormSubmissions,
    exportSubmissions: exportFormSubmissions,
    clearSubmissions: clearFormSubmissions
};

// Development helper
console.log('Admin functions available: window.readToReflect.getSubmissions(), .exportSubmissions(), .clearSubmissions()');
