let currentImageIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');

// Function to open the image in a modal
function openImage(index) {
    currentImageIndex = index;
    const modal = document.getElementById('imageModal');
    updateModalContent();

    // Display the modal
    modal.style.display = 'flex';

    // Add keydown event listener when the modal is open
    document.addEventListener('keydown', handleKeydown);
}

// Function to close the modal
function closeImage() {
    document.getElementById('imageModal').style.display = 'none';

    // Remove the keydown event listener when the modal is closed
    document.removeEventListener('keydown', handleKeydown);
}

// Function to update modal content based on the current image index
// Function to update modal content based on the current image index
function updateModalContent() {
    const fullImage = document.getElementById('fullImage');
    const caption = document.getElementById('imageCaption');
    const photographer = document.getElementById('photographerName');
    
    const galleryItem = galleryItems[currentImageIndex];

    // Update the image, caption, and photographer details
    fullImage.src = galleryItem.dataset.imageurl;
    caption.textContent = galleryItem.dataset.content;
    photographer.textContent = "Photo by: " + galleryItem.dataset.photoby;
}


// Function to handle keyboard navigation
function handleKeydown(event) {
    if (event.key === 'ArrowLeft') {
        changeImage(-1);  // Move to the previous image
    } else if (event.key === 'ArrowRight') {
        changeImage(1);  // Move to the next image
    }
}

// Function to change image
function changeImage(direction) {
    currentImageIndex += direction;

    // Wrap around if we go out of bounds
    if (currentImageIndex < 0) {
        currentImageIndex = galleryItems.length - 1;
    } else if (currentImageIndex >= galleryItems.length) {
        currentImageIndex = 0;
    }

    // Update modal with new image
    updateModalContent();
}




