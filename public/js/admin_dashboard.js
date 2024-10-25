function toggleSection(id) {
    const content = document.getElementById(id);
    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block";
    } else {
        content.style.display = "none";
    }
}

// Initially hide all content sections
document.querySelectorAll('.collapsible-content').forEach(content => {
    content.style.display = 'none';
});