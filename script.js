// Состояние приложения
const state = {
    currentPage: 1,
    currentLang: 'ru',
    theme: 'auto', // 'day', 'night', 'auto'
    translations: {}
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initLanguageSwitcher();
    initThemeToggle();
    loadTranslations();
});

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('vmr-theme') || 'auto';
    state.theme = savedTheme;
    document.body.setAttribute('data-theme', savedTheme);
}

// Навигация между страницами
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const pageNum = parseInt(link.dataset.page);
            
            // Убираем активный класс со всех ссылок и страниц
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            // Добавляем активный класс
            link.classList.add('active');
            const targetPage = document.getElementById(`page${pageNum}`);
            if (targetPage) {
                targetPage.classList.add('active');
                state.currentPage = pageNum;
                
                // Плавная прокрутка вверх
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Переключатель языков
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            
            // Убираем активный класс со всех кнопок
            langButtons.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке
            btn.classList.add('active');
            
            state.currentLang = lang;
            applyTranslations(lang);
            
            // Сохраняем выбор
            localStorage.setItem('vmr-lang', lang);
        });
    });
    
    // Восстанавливаем сохраненный язык
    const savedLang = localStorage.getItem('vmr-lang') || 'ru';
    const savedLangBtn = document.querySelector(`[data-lang="${savedLang}"]`);
    if (savedLangBtn) {
        savedLangBtn.click();
    }
}

// Переключатель темы день/ночь
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    themeToggle.addEventListener('click', () => {
        const themes = ['auto', 'day', 'night'];
        const currentIndex = themes.indexOf(state.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        state.theme = nextTheme;
        document.body.setAttribute('data-theme', nextTheme);
        localStorage.setItem('vmr-theme', nextTheme);
        
        // Добавляем визуальный эффект
        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 400);
    });
}

// Загрузка переводов
function loadTranslations() {
    // Здесь будут храниться переводы
    state.translations = {
        ru: {
            siteTitle: 'Вторая Марсианская Республика',
            nav: {
                page1: 'Главная',
                page2: 'Конституция',
                page3: 'Теория',
                page4: 'Диалоги',
                page5: 'Рассказы',
                page6: 'Вступление',
                page7: 'О сайте',
                page8: 'Глоссарий'
            }
        },
        en: {
            siteTitle: 'Second Martian Republic',
            nav: {
                page1: 'Home',
                page2: 'Constitution',
                page3: 'Theory',
                page4: 'Dialogues',
                page5: 'Stories',
                page6: 'Admission',
                page7: 'About',
                page8: 'Glossary'
            }
        },
        es: {
            siteTitle: 'Segunda República Marciana',
            nav: {
                page1: 'Inicio',
                page2: 'Constitución',
                page3: 'Teoría',
                page4: 'Diálogos',
                page5: 'Historias',
                page6: 'Admisión',
                page7: 'Acerca de',
                page8: 'Glosario'
            }
        },
        fr: {
            siteTitle: 'Deuxième République Martienne',
            nav: {
                page1: 'Accueil',
                page2: 'Constitution',
                page3: 'Théorie',
                page4: 'Dialogues',
                page5: 'Histoires',
                page6: 'Adhésion',
                page7: 'À propos',
                page8: 'Glossaire'
            }
        }
    };
}

// Применение переводов
function applyTranslations(lang) {
    const translations = state.translations[lang];
    if (!translations) return;
    
    // Заголовок сайта
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle && translations.siteTitle) {
        siteTitle.textContent = translations.siteTitle;
    }
    
    // Навигация
    document.querySelectorAll('.nav-link').forEach(link => {
        const pageNum = link.dataset.page;
        const key = `page${pageNum}`;
        if (translations.nav && translations.nav[key]) {
            link.textContent = translations.nav[key];
        }
    });
    
    // Обновляем атрибут lang в HTML
    document.documentElement.lang = lang;
}

// Дополнительные функции для улучшения UX

// Плавное появление элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за колонками и статьями
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.column, .constitution-article, .theory-item, .story');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Подсказки для кнопок языков (всплывающие панели)
function initTooltips() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = btn.title;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                pointer-events: none;
                z-index: 10000;
                white-space: nowrap;
                animation: tooltipFadeIn 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = btn.getBoundingClientRect();
            tooltip.style.top = `${rect.bottom + 8}px`;
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            
            btn.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });
}

// Добавляем CSS для анимации подсказок
const style = document.createElement('style');
style.textContent = `
    @keyframes tooltipFadeIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Инициализируем подсказки после загрузки
document.addEventListener('DOMContentLoaded', initTooltips);

// Экспортируем состояние для возможной отладки
window.vmrState = state;