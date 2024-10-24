
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

// for responsive mode 
document.addEventListener("DOMContentLoaded", function() {
    const toggler = document.querySelector('.navbar-toggler');
    const navbar = document.querySelector('.navbar');

    toggler.addEventListener('click', function() {
      navbar.classList.toggle('active');
      this.querySelector('.navbar-toggler-icon').classList.toggle('open');
    });
  });

// scroll for events in home page
  function scrollLeft() {
    const container = document.querySelector('.events-container');
    container.scrollBy({ left: -320, behavior: 'smooth' }); // Adjusted for two card widths + margin
}

function scrollRight() {
    const container = document.querySelector('.events-container');
    container.scrollBy({ left: 320, behavior: 'smooth' }); // Adjusted for two card widths + margin
}

document.addEventListener('DOMContentLoaded', function() {
    const eventCards = document.querySelectorAll('.event-remaining-days');

    eventCards.forEach(function(card) {
        const eventDate = new Date(card.getAttribute('data-event-date'));
        const today = new Date();
        
        // Calculate the difference in time
        const timeDifference = eventDate - today;
        
        // Convert time difference from milliseconds to days
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        // Update the remaining days in the event card
        card.querySelector('.days-left').textContent = daysLeft > 0 ? daysLeft : 'Event is today';
    });
});



// for hotel page images photo slide
let currentSlides = [0, 0, 0]; // Initialize an array for multiple galleries

function showSlide(galleryIndex, index) {
    const slider = document.querySelectorAll('.photo-slider')[galleryIndex]; // Get the correct slider
    const slides = slider.querySelectorAll('.photo'); // Get slides specific to this gallery
    const totalSlides = slides.length;

    // Loop back to the first slide if index exceeds the total slides
    if (index >= totalSlides) {
        currentSlides[galleryIndex] = 0;
    } else if (index < 0) {
        currentSlides[galleryIndex] = totalSlides - 1;
    } else {
        currentSlides[galleryIndex] = index;
    }

    // Calculate the width to translate based on the current slide
    const slideWidth = slides[0].clientWidth;
    slider.style.transform = `translateX(-${currentSlides[galleryIndex] * slideWidth}px)`;
}

function nextSlide(galleryIndex) {
    showSlide(galleryIndex, currentSlides[galleryIndex] + 1);
}

function prevSlide(galleryIndex) {
    showSlide(galleryIndex, currentSlides[galleryIndex] - 1);
}

// Optional: Auto-slide every 3 seconds for each gallery
setInterval(() => {
    document.querySelectorAll('.photo-gallery').forEach((gallery, index) => {
        nextSlide(index); // Automatically slide through each gallery
    });
}, 3000);

// Initialize all galleries on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.photo-gallery').forEach((gallery, index) => {
        showSlide(index, currentSlides[index]); // Show the first slide for each gallery
    });
});

