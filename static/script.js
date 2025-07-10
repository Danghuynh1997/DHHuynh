// Global variables to store image data
let currentImages = [];
let currentImageIndex = 0;

// Function to open the Facebook image viewer
function openImageViewer(index) {
    // Get images from each post separately to correctly identify their source post
    const june7Images = Array.from(document.querySelector('.post:nth-child(1)').querySelectorAll('.fb-image-item img')).map(img => img.src);
    const may31Images = Array.from(document.querySelector('.post:nth-child(2)').querySelectorAll('.post-full-image')).map(img => img.src);
    const may25Images = Array.from(document.querySelector('.post:nth-child(3)').querySelectorAll('.fb-image-item img')).map(img => img.src);
    
    // Combine all images
    currentImages = [...june7Images, ...may31Images, ...may25Images];
    
    // Map the clicked index to the correct position in the combined array
    if (index >= 0 && index <= 2) {
        // June 7 post images (indexes 0-2)
        currentImageIndex = index;
    } else if (index >= 3 && index <= 5) {
        // May 25 post images (indexes 4-6)
        currentImageIndex = june7Images.length + may31Images.length + (index - 3);
    }
    
    // Display the image viewer
    const viewer = document.getElementById('fbImageViewer');
    viewer.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Update the date based on which post's image is being viewed
    const postDate = document.getElementById('postDate');
    if (index >= 0 && index <= 2) {
        postDate.innerHTML = '7 tháng 6 · <i class="fas fa-globe-asia"></i>';
    } else if (index >= 3 && index <= 5) {
        postDate.innerHTML = '25 tháng 5 · <i class="fas fa-globe-asia"></i>';
    }
    
    // Load the selected image
    updateViewerImage();
    
    // Update navigation buttons visibility
    updateNavButtons();
}

// Function to close the image viewer
function closeImageViewer() {
    const viewer = document.getElementById('fbImageViewer');
    viewer.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Function to navigate to the previous image
function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateViewerImage();
        updateNavButtons();
    }
}

// Function to navigate to the next image
function nextImage() {
    if (currentImageIndex < currentImages.length - 1) {
        currentImageIndex++;
        updateViewerImage();
        updateNavButtons();
    }
}

// Function to change the image (navigate left or right)
function changeImage(direction) {
    currentImageIndex += direction;
    
    // Ensure index stays within bounds
    if (currentImageIndex < 0) currentImageIndex = 0;
    if (currentImageIndex >= currentImages.length) currentImageIndex = currentImages.length - 1;
    
    // Update the image
    updateViewerImage();
    
    // Update navigation buttons
    updateNavButtons();
    
    // Get counts of images from each post
    const june7Images = document.querySelector('.post:nth-child(1)').querySelectorAll('.fb-image-item img').length;
    const may31Images = document.querySelector('.post:nth-child(2)').querySelectorAll('.post-full-image').length;
    
    // Update the date based on current image index
    const postDate = document.getElementById('postDate');
    if (currentImageIndex < june7Images) {
        postDate.innerHTML = '7 tháng 6 · <i class="fas fa-globe-asia"></i>';
    } else {
        postDate.innerHTML = '25 tháng 5 · <i class="fas fa-globe-asia"></i>';
    }
}

// Function to update the current image in the viewer
function updateViewerImage() {
    const viewerImage = document.getElementById('viewerImage');
    viewerImage.src = currentImages[currentImageIndex];
    
    // Add fade effect
    viewerImage.style.opacity = '0';
    setTimeout(() => {
        viewerImage.style.opacity = '1';
    }, 100);
    
    // Update the current image counter
    const counter = document.getElementById('imageCounter');
    if (counter) {
        counter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    }
}

// Function to update the visibility of navigation buttons
function updateNavButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Hide/show previous button based on current index
    if (currentImageIndex === 0) {
        prevBtn.style.visibility = 'hidden';
    } else {
        prevBtn.style.visibility = 'visible';
    }
    
    // Hide/show next button based on current index
    if (currentImageIndex === currentImages.length - 1) {
        nextBtn.style.visibility = 'hidden';
    } else {
        nextBtn.style.visibility = 'visible';
    }
}

// Close the viewer when clicking outside the image (on the background)
document.addEventListener('DOMContentLoaded', () => {
    const imageViewer = document.getElementById('fbImageViewer');
    const imageContainer = document.querySelector('.viewer-image-container');
    const viewerImage = document.getElementById('viewerImage');
    
    // Close when clicking on the background (not on the image or controls)
    imageViewer.addEventListener('click', (event) => {
        // Check if the click was directly on the viewer (background) and not on its children
        if (event.target === imageViewer) {
            closeImageViewer();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (imageViewer.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeImageViewer();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });
    
    // Add touch swipe support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Setup touch event handlers for the image
    viewerImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    viewerImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    // Handle swipe gesture
    function handleSwipe() {
        // Calculate swipe distance
        const swipeDistance = touchEndX - touchStartX;
        
        // If significant horizontal swipe
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                // Right swipe - previous image
                prevImage();
            } else {
                // Left swipe - next image
                nextImage();
            }
        }
    }
    
    // Double tap to zoom (simple implementation)
    let lastTap = 0;
    let isZoomed = false;
    
    viewerImage.addEventListener('click', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        // Double tap detected
        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();
            
            if (!isZoomed) {
                // Zoom in
                viewerImage.style.maxHeight = '200%';
                viewerImage.style.maxWidth = '200%';
                viewerImage.style.cursor = 'zoom-out';
                isZoomed = true;
            } else {
                // Zoom out
                viewerImage.style.maxHeight = '100%';
                viewerImage.style.maxWidth = '40%';
                viewerImage.style.cursor = 'zoom-in';
                isZoomed = false;
            }
        }
        
        lastTap = currentTime;
    });
});
