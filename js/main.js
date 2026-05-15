function showPage(pageId) {
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    // Show the selected section
    document.getElementById(pageId).classList.add('active');
    
    // Scroll to top of content
    window.scrollTo({top: 400, behavior: 'smooth'});
}
