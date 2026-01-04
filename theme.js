// Dark mode toggle functionality
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button text
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        btn.textContent = newTheme === 'dark' ? '☀ light' : '🌙 dark';
    }
}

// Load saved theme or use system preference
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update button text after DOM loads
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        btn.textContent = theme === 'dark' ? '☀ light' : '🌙 dark';
    }
}

// Load theme immediately
loadTheme();
