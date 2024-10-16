
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

document.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const heroTitle = document.querySelector('.hero-content-title');
    const scrollY = window.scrollY;

    // Change this value to determine when to apply the scrolled class
    const scrollThreshold = 2;

    if (scrollY > scrollThreshold) {
        navbar.classList.add('scrolled');
        heroTitle.classList.add('larger'); // Make title larger when scrolled
    } else {
        navbar.classList.remove('scrolled');
        heroTitle.classList.remove('larger'); // Revert title size
    }
});



// Add scroll event listener for all pages
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    // Add or remove the 'fixed' class based on the scroll position
    if (window.scrollY > 100) { // Adjust the scroll position as needed
        navbar.classList.add('fixed');
    } else {
        navbar.classList.remove('fixed');
    }
});

// Select the navbar
var navbar = document.querySelector('.navbar');

// Detect scroll and toggle 'scrolled' class for all pages
window.onscroll = function() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};


document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

