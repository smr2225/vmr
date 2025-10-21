// clnd.js - Календарь ВМР
console.log('CLND.JS: File loaded!');

const CLND_DATA = {
    monthNames: {
        ru: ['Декабрь', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь'],
        en: ['December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'],
        es: ['Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre'],
        fr: ['Décembre', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre']
    },
    
    weekdayNames: {
        ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        es: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
        fr: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
    },
    
    daysLabel: {
        ru: 'дней',
        en: 'days',
        es: 'días',
        fr: 'jours'
    },
    
    shortLabel: {
        ru: '(короткий)',
        en: '(short)',
        es: '(corto)',
        fr: '(court)'
    },
    
    year0: {
        monthDays: [56, 55, 56, 56, 56, 55, 56, 56, 56, 56, 56, 55],
        holidays: {
            1: { 1: 'newyear' },
            3: { 44: 'equinox' },
            7: { 14: 'solstice' },
            10: { 24: 'equinox' }
        }
    },
    
    year1: {
        monthDays: [56, 55, 56, 56, 56, 55, 56, 56, 55, 56, 56, 55],
        holidays: {
            1: { 1: 'newyear' },
            3: { 44: 'equinox' },
            7: { 14: 'solstice' },
            10: { 24: 'equinox' }
        }
    }
};

function initClndCalendar() {
    console.log('CLND: initClndCalendar called');
    
    if (!document.querySelector('.clnd-container')) {
        console.log('CLND: Container not found');
        return;
    }
    
    console.log('CLND: Initializing tabs and calendars');
    initClndTabs();
    renderCalendars();
}

function initClndTabs() {
    const tabs = document.querySelectorAll('.clnd-tab');
    console.log('CLND: Found tabs:', tabs.length);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            console.log('CLND: Tab clicked:', targetTab);
            
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.clnd-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function renderCalendars() {
    console.log('CLND: renderCalendars called');
    
    let lang = 'ru';
    if (typeof currentLang !== 'undefined') {
        lang = currentLang;
    }
    
    console.log('CLND: Language:', lang);
    
    renderCalendar('year0', CLND_DATA.year0, lang);
    renderCalendar('year1', CLND_DATA.year1, lang);
}

function renderCalendar(yearId, yearConfig, lang) {
    const container = document.getElementById(`calendar-${yearId}`);
    if (!container) {
        console.error('CLND: Container not found:', yearId);
        return;
    }
    
    console.log('CLND: Rendering:', yearId);
    
    let html = '';
    
    for (let quarter = 0; quarter < 4; quarter++) {
        html += '<div class="clnd-quarter">';
        
        for (let monthInQuarter = 0; monthInQuarter < 3; monthInQuarter++) {
            const monthIndex = quarter * 3 + monthInQuarter;
            html += renderMonth(monthIndex, yearConfig, lang);
        }
        
        html += '</div>';
    }
    
    container.innerHTML = html;
    console.log('CLND: Rendered:', yearId);
}

function renderMonth(monthIndex, yearConfig, lang) {
    const monthName = CLND_DATA.monthNames[lang][monthIndex];
    const daysInMonth = yearConfig.monthDays[monthIndex];
    const isShort = daysInMonth === 55;
    
    return `
        <div class="clnd-month">
            <div class="clnd-month-header">
                <div class="clnd-month-name">${monthName}</div>
                <div class="clnd-month-days-count ${isShort ? 'short' : ''}">
                    ${daysInMonth} ${CLND_DATA.daysLabel[lang]}${isShort ? ' ' + CLND_DATA.shortLabel[lang] : ''}
                </div>
            </div>
            
            <div class="clnd-weekdays">
                ${CLND_DATA.weekdayNames[lang].map((day, i) => 
                    `<div class="clnd-weekday ${i >= 5 ? 'weekend' : ''}">${day}</div>`
                ).join('')}
            </div>
            
            <div class="clnd-days">
                ${renderDays(monthIndex, daysInMonth, yearConfig.holidays)}
            </div>
        </div>
    `;
}

function renderDays(monthIndex, daysInMonth, holidays) {
    let html = '';
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = (day - 1) % 7;
        const isWeekend = dayOfWeek >= 5;
        
        let holidayClass = '';
        if (holidays[monthIndex] && holidays[monthIndex][day]) {
            holidayClass = `holiday holiday-${holidays[monthIndex][day]}`;
        }
        
        html += `<div class="clnd-day ${isWeekend ? 'weekend' : ''} ${holidayClass}">${day}</div>`;
    }
    
    return html;
}

// Экспорт для вызова из main.js
if (typeof window !== 'undefined') {
    window.initClndCalendar = initClndCalendar;
}

// Экспорт
if (typeof window !== 'undefined') {
    window.initClndCalendar = initClndCalendar;
    window.renderClndCalendars = renderCalendars; // ← ДОБАВИТЬ
}