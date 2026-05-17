function showPage(pageId) {
    const page = document.getElementById(pageId);

    if (!page) {
        return;
    }

    document.querySelectorAll('.page-section').forEach((section) => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
        const isActive = link.dataset.page === pageId;
        link.classList.toggle('active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-page]').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const pageId = link.dataset.page;
        history.replaceState(null, '', `#${pageId}`);
        showPage(pageId);
    });
});

const initialPage = window.location.hash.replace('#', '') || 'home';
showPage(initialPage);
