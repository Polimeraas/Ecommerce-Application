// Main JavaScript file for FreshMart E-commerce Application


document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeCart();
    initializeProductFilters();
    initializeFormValidation();
    initializeAlerts();
    initializeResponsiveNavigation();
    initializeImageLazyLoading();
});

// Cart functionality
function initializeCart() {
    // Add to cart animations
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    addToCartForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            button.textContent = 'Adding...';
            button.disabled = true;
            
            // Re-enable after form submission
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        });
    });

    // Quantity input validation
    const quantityInputs = document.querySelectorAll('input[name="quantity"]');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const min = parseInt(this.min) || 1;
            const max = parseInt(this.max) || 999;
            let value = parseInt(this.value);
            
            if (value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    });

    // Cart item removal confirmation
    const removeButtons = document.querySelectorAll('form[action*="/cart/remove"] button');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to remove this item from your cart?')) {
                e.preventDefault();
            }
        });
    });
}

// Product filtering functionality
function initializeProductFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Add loading state
            const productsGrid = document.querySelector('.products-grid');
            if (productsGrid) {
                productsGrid.style.opacity = '0.5';
                setTimeout(() => {
                    productsGrid.style.opacity = '1';
                }, 300);
            }
        });
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Remove error class on input
                    field.addEventListener('input', function() {
                        this.classList.remove('error');
                    });
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !isValidEmail(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    showFieldError(field, 'Please enter a valid email address');
                }
            });
            
            // Password confirmation (if exists)
            const password = form.querySelector('input[name="password"]');
            const confirmPassword = form.querySelector('input[name="confirmPassword"]');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                isValid = false;
                confirmPassword.classList.add('error');
                showFieldError(confirmPassword, 'Passwords do not match');
            }
            
            if (!isValid) {
                e.preventDefault();
                showAlert('Please correct the errors in the form', 'error');
            }
        });
    });
}

// Helper function for email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field-specific error
function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error error-text';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

// Alert system
function initializeAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // Auto-hide success alerts after 5 seconds
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                hideAlert(alert);
            }, 5000);
        }
        
        // Add close button to alerts
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.className = 'alert-close';
        closeButton.onclick = () => hideAlert(alert);
        alert.appendChild(closeButton);
    });
}

// Hide alert with animation
function hideAlert(alert) {
    alert.style.opacity = '0';
    alert.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        alert.remove();
    }, 300);
}

// Show dynamic alert
function showAlert(message, type = 'success') {
    const alertHTML = `
        <div class="alert alert-${type}" style="opacity: 0; transform: translateY(-10px)">
            ${message}
            <button class="alert-close" onclick="hideAlert(this.parentNode)">×</button>
        </div>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertAdjacentHTML('afterbegin', alertHTML);
        const newAlert = container.querySelector('.alert');
        
        // Animate in
        setTimeout(() => {
            newAlert.style.opacity = '1';
            newAlert.style.transform = 'translateY(0)';
        }, 10);
        
        // Auto-hide success alerts
        if (type === 'success') {
            setTimeout(() => {
                hideAlert(newAlert);
            }, 5000);
        }
    }
}

// Responsive navigation
function initializeResponsiveNavigation() {
    // Mobile menu toggle (if needed in future)
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

// Image lazy loading and error handling
function initializeImageLazyLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Set placeholder while loading
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Handle image load errors
        img.addEventListener('error', function() {
            if (!this.dataset.errorHandled) {
                this.src = 'https://via.placeholder.com/200x200?text=No+Image';
                this.dataset.errorHandled = 'true';
            }
        });
    });
}

// Utility functions
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Product card interactions
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
// main.js (continued from the document)
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Advanced cart functionality
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.bindEvents();
        this.updateCartDisplay();
    }
    
    loadCart() {
        // In a real app, this would load from localStorage or server
        return {
            items: [],
            total: 0,
            itemCount: 0
        };
    }
    
    addItem(productId, quantity = 1) {
        const existingItem = this.cart.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.items.push({
                productId,
                quantity,
                addedAt: new Date()
            });
        }
        
        this.updateCartDisplay();
        this.showAddToCartAnimation();
    }
    
    removeItem(productId) {
        this.cart.items = this.cart.items.filter(item => item.productId !== productId);
        this.updateCartDisplay();
    }
    
    updateCartDisplay() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const itemCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            element.style.display = itemCount > 0 ? 'inline' : 'none';
        });
    }
    
    showAddToCartAnimation() {
        showAlert('Item added to cart!', 'success');
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart-btn')) {
                e.preventDefault();
                const productId = e.target.dataset.productId;
                const quantity = parseInt(e.target.closest('form').querySelector('input[name="quantity"]')?.value || 1);
                this.addItem(productId, quantity);
            }
        });
    }
}

// Search functionality
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.debounceTimeout = null;
        
        if (this.searchInput) {
            this.bindEvents();
        }
    }
    
    bindEvents() {
        this.searchInput.addEventListener('input', () => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.performSearch(this.searchInput.value);
            }, 300);
        });
        
        this.searchInput.addEventListener('focus', () => {
            this.showSearchResults();
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });
    }
    
    performSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }
        
        // Simulate search API call
        this.showSearchResults();
        this.displaySearchResults([
            { id: 1, name: 'Sample Product 1', price: '₹299' },
            { id: 2, name: 'Sample Product 2', price: '₹399' }
        ]);
    }
    
    showSearchResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'block';
        }
    }
    
    hideSearchResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
    }
    
    displaySearchResults(results) {
        if (!this.searchResults) return;
        
        const resultsHTML = results.map(product => `
            <div class="search-result-item">
                <a href="/product/${product.id}">
                    <span class="product-name">${product.name}</span>
                    <span class="product-price">${product.price}</span>
                </a>
            </div>
        `).join('');
        
        this.searchResults.innerHTML = resultsHTML;
    }
}

// Form enhancement
class FormEnhancer {
    constructor() {
        this.enhanceForms();
        this.addPasswordToggle();
        this.addRealTimeValidation();
    }
    
    enhanceForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add loading state to submit buttons
            form.addEventListener('submit', () => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
                    submitBtn.disabled = true;
                }
            });
        });
    }
    
    addPasswordToggle() {
        const passwordFields = document.querySelectorAll('input[type="password"]');
        
        passwordFields.forEach(field => {
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'password-toggle';
            toggleBtn.innerHTML = '👁️';
            toggleBtn.onclick = () => this.togglePassword(field, toggleBtn);
            
            field.parentNode.style.position = 'relative';
            field.parentNode.appendChild(toggleBtn);
        });
    }
    
    togglePassword(field, button) {
        const isPassword = field.type === 'password';
        field.type = isPassword ? 'text' : 'password';
        button.innerHTML = isPassword ? '🙈' : '👁️';
    }
    
    addRealTimeValidation() {
        const inputs = document.querySelectorAll('input[required], input[type="email"]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        // Password strength (for password fields)
        if (field.type === 'password' && value && value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters long';
        }
        
        this.showFieldValidation(field, isValid, errorMessage);
    }
    
    showFieldValidation(field, isValid, errorMessage) {
        field.classList.toggle('error', !isValid);
        field.classList.toggle('valid', isValid);
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message if invalid
        if (!isValid && errorMessage) {
            const errorElement = document.createElement('span');
            errorElement.className = 'field-error error-text';
            errorElement.textContent = errorMessage;
            field.parentNode.appendChild(errorElement);
        }
    }
}

// Notification system
class NotificationManager {
    constructor() {
        this.container = this.createContainer();
        this.notifications = [];
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 300px;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: white;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-left: 4px solid ${this.getTypeColor(type)};
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close" onclick="this.parentNode.remove()">×</button>
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        return notification;
    }
    
    getTypeColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    }
    
    remove(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// Image gallery/lightbox
class ImageGallery {
    constructor() {
        this.bindEvents();
        this.createLightbox();
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.product-image img, .gallery-image')) {
                e.preventDefault();
                this.openLightbox(e.target.src, e.target.alt);
            }
        });
    }
    
    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            z-index: 10001;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;
        
        lightbox.innerHTML = `
            <img class="lightbox-image" style="max-width: 90%; max-height: 90%; object-fit: contain;">
            <button class="lightbox-close" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 30px; cursor: pointer;">×</button>
        `;
        
        document.body.appendChild(lightbox);
        this.lightbox = lightbox;
        
        // Close on click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.className === 'lightbox-close') {
                this.closeLightbox();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
        });
    }
    
    openLightbox(src, alt) {
        const img = this.lightbox.querySelector('.lightbox-image');
        img.src = src;
        img.alt = alt;
        this.lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    window.cartManager = new CartManager();
    window.searchManager = new SearchManager();  
    window.formEnhancer = new FormEnhancer();
    window.notificationManager = new NotificationManager();
    window.imageGallery = new ImageGallery();
    
    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    // Initialize tooltips
    initializeTooltips();
});

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
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
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Tooltip functionality
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            showTooltip(this, this.dataset.tooltip);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    
    window.currentTooltip = tooltip;
}

function hideTooltip() {
    if (window.currentTooltip) {
        window.currentTooltip.remove();
        window.currentTooltip = null;
    }
}

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            // Handle scroll events here
            updateScrollIndicator();
        }, 16); // ~60fps
    });
    
    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.loading) {
            img.loading = 'lazy';
        }
    });
}

function updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const scrolled = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (scrolled / maxScroll) * 100;
        scrollIndicator.style.width = scrollProgress + '%';
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Additional CSS for JavaScript enhancements
const additionalStyles = `
<style>
.notification-container .notification {
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

.password-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

.form-group {
    position: relative;
}

.field-error {
    display: block;
    color: #dc3545;
    font-size: 12px;
    margin-top: 5px;
}

input.error {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

input.valid {
    border-color: #28a745;
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
}

.spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.tooltip {
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy.loaded {
    opacity: 1;
}

.scroll-indicator {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: #4a8c4f;
    z-index: 10000;
    transition: width 0.1s ease;
}
</style>;