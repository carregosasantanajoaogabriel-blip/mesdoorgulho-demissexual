// ================== DETECTAR DISPOSITIVO MÓVEL ==================
const isMobile = () => window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// ================== MODO ESCURO ==================
let themeToggle;
const htmlElement = document.documentElement;

// Verificar tema salvo
function initTheme() {
    if (!themeToggle) {
        themeToggle = document.querySelector('.theme-toggle');
    }
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    // Adicionar event listener ao tema toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });
}

function updateThemeButton(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ================== CURSOR CUSTOMIZADO ==================
let customCursor;

function initCustomCursor() {
    customCursor = document.querySelector('.custom-cursor');
    let mouseX = 0;
    let mouseY = 0;

    // Desabilitar cursor em mobile
    if (!isMobile()) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (customCursor) {
                customCursor.style.left = (mouseX - 10) + 'px';
                customCursor.style.top = (mouseY - 10) + 'px';
                customCursor.classList.add('active');
            }
        });

        document.addEventListener('mouseleave', () => {
            if (customCursor) customCursor.classList.remove('active');
        });

        document.addEventListener('mouseenter', () => {
            if (customCursor) customCursor.classList.add('active');
        });
    }
    
    // Efeito glassmorphism dinâmico
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.card-glass, .card-glass-demis');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height);

            if (distance < 300) {
                const intensity = (1 - distance / 300) * 10;
                card.style.boxShadow = `
                    0 8px 32px rgba(143, 74, 159, ${0.15 + intensity * 0.1}),
                    ${(x - rect.width / 2) * 0.1}px ${(y - rect.height / 2) * 0.1}px 20px rgba(217, 70, 166, ${intensity * 0.1})
                `;
            }
        });
    });
}

// ================== NAVEGAÇÃO MOBILE ==================
let navToggle;
let navMenu;
let navLinks; // Será inicializado no DOMContentLoaded

// Impedir scroll quando menu está aberto
function toggleBodyScroll(isOpen) {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function initializeNavMenu() {
    navToggle = navToggle || document.querySelector('.nav-toggle');
    navMenu = navMenu || document.querySelector('.nav-menu');
    navLinks = document.querySelectorAll('.nav-link');
    
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        toggleBodyScroll(isOpen);
        
        // Animar hamburger
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            toggleBodyScroll(false);
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            toggleBodyScroll(false);
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
}

// ================== PARTÍCULAS DE FUNDO ==================
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    // Reduzir partículas em mobile
    const particleCount = isMobile() ? 15 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `hsl(${Math.random() * 60 + 260}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particleFloat ${Math.random() * 20 + 20}s linear infinite`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;

        particlesContainer.appendChild(particle);
    }
}

// Adicionar animação de partículas ao CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ================== ANIMAÇÕES AO SCROLL ==================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar cards
document.querySelectorAll('.card-glass, .card-glass-demis').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ================== CONTADOR DE PRÊMIOS ==================
const quoteCards = document.querySelectorAll('.quote-card');
let currentQuote = 0;

function rotateQuotes() {
    quoteCards.forEach((quote, index) => {
        quote.style.opacity = index === currentQuote ? '1' : '0.3';
        quote.style.transform = index === currentQuote ? 'scale(1)' : 'scale(0.95)';
    });
    currentQuote = (currentQuote + 1) % quoteCards.length;
}

// Desabilitar rotação se houver menos de 2 quotes
if (quoteCards.length > 1) {
    setInterval(rotateQuotes, 5000);
    rotateQuotes(); // Inicializar
}

// ================== EFEITO GLASSMORPHISM DINÂMICO ==================
// Desabilitar em mobile por performance
if (!isMobile()) {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.card-glass, .card-glass-demis');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height);

            if (distance < 300) {
                const intensity = (1 - distance / 300) * 10;
                card.style.boxShadow = `
                    0 8px 32px rgba(143, 74, 159, ${0.15 + intensity * 0.1}),
                    ${(x - rect.width / 2) * 0.1}px ${(y - rect.height / 2) * 0.1}px 20px rgba(217, 70, 166, ${intensity * 0.1})
                `;
            }
        });
    });
}

// ================== SMOOTH SCROLL PARA LINKS ==================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================== ADICIONAR CLASSE ATIVA À NAV ==================
function initScrollNavigation() {
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ================== EFEITO DE DIGITAÇÃO EM TÍTULOS ==================
function typeWriter(element, speed = 50) {
    const text = element.textContent;
    element.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Ativar efeito ao entrar na viewport
const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('section-title')) {
            typeWriter(entry.target, 30);
            titleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.section-title').forEach(title => {
    titleObserver.observe(title);
});

// ================== ANIMAÇÃO DE BOTÕES ==================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ================== AÇÕES DE BOTÕES ESPECIAIS ==================
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.textContent.includes('Compartilhe')) {
            alert('Compartilhe sua história com a comunidade! 🏳️‍🌈');
        } else if (this.textContent.includes('Apoie')) {
            alert('Obrigado por apoiar a comunidade LGBTQIAPN+! 💜');
        }
    });
});

// ================== SCROLL SUAVE E PARALLAX ==================
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    // Efeito parallax no hero
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `0 ${scrollY * 0.5}px`;
    }
});

// ================== INICIALIZAÇÃO ==================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initializeNavMenu();
    createParticles();
    initScrollNavigation();
    
    // Adicionar classe active ao primeiro nav-link
    if (navLinks && navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }

    // Log de sucesso
    console.log('🏳️‍🌈 Celebração da Diversidade LGBTQIAPN+ carregado com sucesso!');
    console.log('💜 Demissexualidade - Conexão antes da atração');
});

// ================== PREVENÇÃO DE EFEITOS DE MOVIMENTO REDUZIDO ==================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}
