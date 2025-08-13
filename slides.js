document.addEventListener('DOMContentLoaded', function() {
    const mobileBreakpoint = 1024;
    if (window.innerWidth < mobileBreakpoint) { return; }

    const contentArea = document.querySelector('.content');
    const dbContentArea = contentArea.querySelector('db-content');
    if (!contentArea || !dbContentArea) return;


    const slideContainer = document.createElement('div');
    slideContainer.className = 'slide-container';
    document.body.insertBefore(slideContainer, contentArea);
    slideContainer.appendChild(contentArea);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'menu-toggle';
    toggleButton.innerHTML = '<span></span><span></span><span></span>';
    document.body.appendChild(toggleButton);

    toggleButton.onclick = () => {
        slideContainer.classList.toggle('menu-collapsed');
    };

    const h1 = dbContentArea.querySelector('h1');
    const allHeaders = Array.from(dbContentArea.querySelectorAll('h2'));
    let slides = [];
    let menuItems = [];


    if (h1) {
        const titleSlide = document.createElement('div');
        titleSlide.className = 'slide';
        const elementsToMove = [h1];
        let currentElement = h1.nextElementSibling;
        while (currentElement && currentElement.tagName !== 'H2') {
            elementsToMove.push(currentElement);
            currentElement = currentElement.nextElementSibling;
        }
        elementsToMove.forEach(el => titleSlide.appendChild(el));
        dbContentArea.appendChild(titleSlide);
        slides.push(titleSlide);
        menuItems.push(h1);
    }

    allHeaders.forEach(h2 => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        const elementsToMove = [h2];
        let currentElement = h2.nextElementSibling;
        while (currentElement && currentElement.tagName !== 'HR') {
            elementsToMove.push(currentElement);
            currentElement = currentElement.nextElementSibling;
        }
        if (currentElement && currentElement.tagName === 'HR') {
            elementsToMove.push(currentElement);
        }
        elementsToMove.forEach(el => slide.appendChild(el));
        dbContentArea.appendChild(slide);
        slides.push(slide);
        menuItems.push(h2);
    });

    if (slides.length === 0) return;


    const menu = document.createElement('nav');
    menu.id = 'slide-menu';
    menuItems.forEach((header, index) => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = header.textContent;
        link.dataset.index = index;
        link.onclick = (e) => { e.preventDefault(); showSlide(index); };
        menu.appendChild(link);
    });

    slideContainer.insertBefore(menu, contentArea);
    const menuLinks = menu.querySelectorAll('a');


    const navigation = document.createElement('div');
    navigation.id = 'slide-navigation';
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Back';
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    navigation.appendChild(prevButton);
    navigation.appendChild(nextButton);
    prevButton.onclick = () => showSlide(currentIndex - 1);
    nextButton.onclick = () => showSlide(currentIndex + 1);

    let currentIndex = 0;


    function showSlide(index) {
        if (index < 0 || index >= slides.length) return;

        if (slides[currentIndex]) {
            slides[currentIndex].classList.remove('active');
            menuLinks[currentIndex].classList.remove('active-link');
        }

        currentIndex = index;
        const currentSlide = slides[currentIndex];
        currentSlide.classList.add('active');
        menuLinks[currentIndex].classList.add('active-link');
        currentSlide.appendChild(navigation);

        prevButton.disabled = (currentIndex === 0);
        nextButton.disabled = (currentIndex === slides.length - 1);

        setTimeout(() => { if(window.mermaid) { mermaid.run(); } }, 0);
    }

    document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            e.preventDefault();
            showSlide(currentIndex + 1);
        }
        else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
            e.preventDefault();
            showSlide(currentIndex - 1);
        }
    });


    showSlide(1);

});
