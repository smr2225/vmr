// main.js - SPA роутинг и общая логика

let currentPage = 'rpbl';
let currentLang = 'ru';
let currentPageStyles = null;
let commonTranslations = {};
let pageTranslations = {};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThemeToggle();
    initLanguage();
    initLanguageSwitcher();
    initRouter();
    
    // Загружаем начальную страницу
    const hash = window.location.hash.slice(1) || 'rpbl';
    loadPage(hash);
});

// === РОУТИНГ ===

function initRouter() {
    // Навигация по ссылкам
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
        });
    });
    
    // Обработка кнопок браузера назад/вперёд
    window.addEventListener('hashchange', () => {
        const page = window.location.hash.slice(1) || 'rpbl';
        loadPage(page);
    });
}

function navigateTo(page) {
    window.location.hash = page;
}

async function loadPage(page) {
    currentPage = page;
    
    // Обновляем активную ссылку в меню
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    const contentContainer = document.getElementById('page-content');
    contentContainer.innerHTML = '<div class="loading">Загрузка...</div>';
    
    try {
        // Загружаем HTML контент
        const htmlResponse = await fetch(`${page}/${page}.html`);
        if (!htmlResponse.ok) throw new Error('Страница не найдена');
        const html = await htmlResponse.text();
        
        // Удаляем старые стили страницы
        cleanupPageStyles();
        
        // Вставляем контент
        contentContainer.innerHTML = html;
        
        // Загружаем CSS страницы
        await loadPageCSS(page);
        
        // Загружаем переводы страницы и применяем
        await loadPageTranslations(page);
        
        // Прокрутка вверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Ошибка загрузки страницы:', error);
        contentContainer.innerHTML = `
            <div class="error-page">
                <h2>Ошибка загрузки</h2>
                <p>Не удалось загрузить страницу "${page}"</p>
                <a href="#rpbl">Вернуться на главную</a>
            </div>
        `;
    }
}

function cleanupPageStyles() {
    if (currentPageStyles) {
        currentPageStyles.remove();
        currentPageStyles = null;
    }
}

async function loadPageCSS(page) {
    try {
        const response = await fetch(`/${page}/${page}.css`);
        if (response.ok) {
            const css = await response.text();
            const style = document.createElement('style');
            style.textContent = css;
            style.setAttribute('data-page-style', page);
            document.head.appendChild(style);
            currentPageStyles = style;
        }
    } catch (error) {
        console.log(`CSS для ${page} не найден`);
    }
}

async function loadPageTranslations(page) {
    try {
        const response = await fetch(`/${page}/${page}.json`);
        if (response.ok) {
            const allTranslations = await response.json();
            pageTranslations = allTranslations[currentLang] || allTranslations.ru;
            applyPageTranslations();
        }
    } catch (error) {
        console.log(`Переводы для ${page} не найдены`);
    }
}

function applyPageTranslations() {
    document.querySelectorAll('#page-content [data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (pageTranslations[key]) {
            element.textContent = pageTranslations[key];
        }
    });
}

// === УПРАВЛЕНИЕ ТЕМОЙ ===

function initTheme() {
    const savedTheme = localStorage.getItem('smr-theme') || 'auto';
    document.body.setAttribute('data-theme', savedTheme);
}

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        const themes = ['auto', 'day', 'night'];
        const currentTheme = document.body.getAttribute('data-theme');
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        document.body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('smr-theme', nextTheme);
        
        // Визуальный эффект
        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 400);
    });
}

// === УПРАВЛЕНИЕ ЯЗЫКАМИ ===

function initLanguage() {
    const savedLang = localStorage.getItem('smr-lang') || 'ru';
    currentLang = savedLang;
    document.documentElement.lang = savedLang;
    
    // Активируем кнопку языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });
    
    // Загружаем общие переводы (меню, подвал)
    loadCommonTranslations();
}

function initLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            
            // Убираем активный класс
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Меняем язык
            currentLang = lang;
            localStorage.setItem('smr-lang', lang);
            document.documentElement.lang = lang;
            
            // Перезагружаем переводы
            loadCommonTranslations();
            loadPageTranslations(currentPage); // ← ЭТА СТРОКА УЖЕ ЕСТЬ
        });
    });
}

async function loadCommonTranslations() {
    try {
        const response = await fetch('menu.json');
        if (response.ok) {
            const allTranslations = await response.json();
            commonTranslations = allTranslations[currentLang] || allTranslations.ru;
            applyCommonTranslations();
        }
    } catch (error) {
        console.log('Общие переводы не найдены');
    }
}

function applyCommonTranslations() {
    // Применяем к шапке и подвалу
    document.querySelectorAll('header [data-i18n], footer [data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (commonTranslations[key]) {
            element.textContent = commonTranslations[key];
        }
    });
}

// Экспорт для использования на страницах
window.smrApp = {
    navigateTo,
    currentLang,
    currentPage
};

// Мобильное меню
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.menu-overlay');
    
    if (menuToggle && nav && overlay) {
        // Открытие меню
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            overlay.classList.toggle('active');
            menuToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
        });
        
        // Закрытие по клику на затемнение
        overlay.addEventListener('click', () => {
            nav.classList.remove('open');
            overlay.classList.remove('active');
            menuToggle.textContent = '☰';
        });
        
        // Закрытие после выбора пункта
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                overlay.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }

});

