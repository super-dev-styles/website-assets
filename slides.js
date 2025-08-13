document.addEventListener('DOMContentLoaded', function() {
    const mobileBreakpoint = 1024;
    if (window.innerWidth < mobileBreakpoint) { return; }

    const contentArea = document.querySelector('.content');
    const dbContentArea = contentArea.querySelector('db-content');
    if (!contentArea || !dbContentArea) return;

    // --- 1. Создание главного контейнера и кнопки ---
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

    // --- 2. Создание слайдов ---
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

    // --- 3. Создание бокового меню ---
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
    // Добавляем меню в НАЧАЛО контейнера, перед контентом
    slideContainer.insertBefore(menu, contentArea);
    const menuLinks = menu.querySelectorAll('a');

    // --- 4. Создание кнопок навигации ---
    const navigation = document.createElement('div');
    navigation.id = 'slide-navigation';
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Назад';
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Вперед';
    navigation.appendChild(prevButton);
    navigation.appendChild(nextButton);
    prevButton.onclick = () => showSlide(currentIndex - 1);
    nextButton.onclick = () => showSlide(currentIndex + 1);

    let currentIndex = 0;

    // --- 5. Функция показа слайдов ---
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

    // --- 6. Навигация с клавиатуры ---
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'ArrowRight') { e.preventDefault(); showSlide(currentIndex + 1); }
        if (e.ctrlKey && e.key === 'ArrowLeft') { e.preventDefault(); showSlide(currentIndex - 1); }
    });

    // --- Инициализация ---
    showSlide(1);
});