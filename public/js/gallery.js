// Function to open the image in a modal
function openImage(imageUrl) {
    // Get the modal element
    const modal = document.getElementById('imageModal');

    // Get the image element inside the modal
    const fullImage = document.getElementById('fullImage');

    // Set the source of the modal image to the clicked image's URL
    fullImage.src = imageUrl;

    // Display the modal by changing its display to 'flex'
    modal.style.display = 'flex';
}

// Function to close the modal
function closeImage() {
    // Hide the modal by setting its display to 'none'
    document.getElementById('imageModal').style.display = 'none';
}
