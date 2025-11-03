// main.js
(function() {
  // Определяем предпочтение темы
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let theme = 'night'; // по умолчанию — ночь
  if (savedTheme === 'day' || (!savedTheme && !systemPrefersDark)) {
    theme = 'day';
  }

  document.body.className = theme;

  // Переключатель темы (можно добавить кнопку позже)
  window.setTheme = function(newTheme) {
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  // Мобильное меню
  const menuToggle = document.getElementById('menuToggle');
  const navUl = document.querySelector('nav ul');
  if (menuToggle && navUl) {
    menuToggle.addEventListener('click', () => {
      navUl.classList.toggle('show');
    });
  }
})();

