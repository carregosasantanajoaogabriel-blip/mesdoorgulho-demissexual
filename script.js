// ================== DETECTAR DISPOSITIVO MÓVEL ==================
const isMobile = () => window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// ================== MODO ESCURO ==================
let themeToggle;
const htmlElement = document.documentElement;

function initTheme() {
    if (!themeToggle) {
        themeToggle = document.querySelector('.theme-toggle');
    }
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

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

    // CORREÇÃO 1 e 3: todo o bloco abaixo (cursor + glassmorphism)
    // só é registrado em desktop, evitando listeners desnecessários em mobile
    if (!isMobile()) {
        document.addEventListener('mousemove', (e) => {
            if (customCursor) {
                customCursor.style.left = (e.clientX - 10) + 'px';
                customCursor.style.top  = (e.clientY - 10) + 'px';
                customCursor.classList.add('active');
            }
        });

        document.addEventListener('mouseleave', () => {
            if (customCursor) customCursor.classList.remove('active');
        });

        document.addEventListener('mouseenter', () => {
            if (customCursor) customCursor.classList.add('active');
        });

        // Efeito glassmorphism dinâmico — registrado UMA única vez aqui
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.card-glass, .card-glass-demis');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const distance = Math.sqrt(x * x + y * y);

                if (distance < 300) {
                    const intensity = (1 - distance / 300) * 10;
                    card.style.boxShadow = `
                        0 8px 32px rgba(143, 74, 159, ${0.15 + intensity * 0.1}),
                        ${(x - rect.width  / 2) * 0.1}px
                        ${(y - rect.height / 2) * 0.1}px
                        20px rgba(217, 70, 166, ${intensity * 0.1})
                    `;
                }
            });
        });
    }
}

// ================== NAVEGAÇÃO MOBILE ==================
let navToggle;
let navMenu;
let navLinks;

function toggleBodyScroll(isOpen) {
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function initializeNavMenu() {
    navToggle = navToggle || document.querySelector('.nav-toggle');
    navMenu   = navMenu   || document.querySelector('.nav-menu');
    navLinks  = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        toggleBodyScroll(isOpen);

        const spans = navToggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity   = '1';
            spans[2].style.transform = '';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            toggleBodyScroll(false);
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity   = '1';
            spans[2].style.transform = '';
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            toggleBodyScroll(false);
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity   = '1';
            spans[2].style.transform = '';
        }
    });
}

// ================== PARTÍCULAS DE FUNDO ==================
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = isMobile() ? 15 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position     = 'absolute';
        particle.style.width        = Math.random() * 4 + 2 + 'px';
        particle.style.height       = particle.style.width;
        particle.style.background   = `hsl(${Math.random() * 60 + 260}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.left         = Math.random() * 100 + '%';
        particle.style.top          = Math.random() * 100 + '%';
        particle.style.animation    = `particleFloat ${Math.random() * 20 + 20}s linear infinite`;
        particle.style.opacity      = Math.random() * 0.5 + 0.1;
        particlesContainer.appendChild(particle);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%   { transform: translateY(0) translateX(0); opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
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

document.querySelectorAll('.card-glass, .card-glass-demis').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ================== ROTAÇÃO DE CITAÇÕES ==================
const quoteCards  = document.querySelectorAll('.quote-card');
let   currentQuote = 0;

function rotateQuotes() {
    quoteCards.forEach((quote, index) => {
        quote.style.opacity   = index === currentQuote ? '1'    : '0.3';
        quote.style.transform = index === currentQuote ? 'scale(1)' : 'scale(0.95)';
    });
    currentQuote = (currentQuote + 1) % quoteCards.length;
}

if (quoteCards.length > 1) {
    rotateQuotes();                    // inicializa imediatamente
    setInterval(rotateQuotes, 5000);
}

// ================== SMOOTH SCROLL ==================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ================== NAV ATIVA AO SCROLL ==================
function initScrollNavigation() {
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // CORREÇÃO 2: usar window.scrollY diretamente, sem variável global conflitante
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
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

// ================== EFEITO DE DIGITAÇÃO ==================
function typeWriter(element, speed = 50) {
    const text = element.textContent;
    element.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i++);
            setTimeout(type, speed);
        }
    }
    type();
}

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('section-title')) {
            typeWriter(entry.target, 30);
            titleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.section-title').forEach(title => titleObserver.observe(title));

// ================== ANIMAÇÃO DE BOTÕES ==================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-4px)'; });
    button.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0)'; });
});

// ================== AÇÕES DOS BOTÕES CTA ==================
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.textContent.includes('Compartilhe')) {
            alert('Compartilhe sua história com a comunidade! 🏳️‍🌈');
        } else if (this.textContent.includes('Apoie')) {
            alert('Obrigado por apoiar a comunidade LGBTQIAPN+! 💜');
        }
    });
});

// ================== PARALLAX NO HERO ==================
// CORREÇÃO 2: removido "let scrollY = 0" — usa window.scrollY diretamente
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `0 ${window.scrollY * 0.5}px`;
    }
});

// ================== INICIALIZAÇÃO ==================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCustomCursor();
    initializeNavMenu();
    createParticles();
    initScrollNavigation();

    if (navLinks && navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }

    console.log('🏳️‍🌈 Celebração da Diversidade LGBTQIAPN+ carregado com sucesso!');
    console.log('💜 Demissexualidade - Conexão antes da atração');
});

// ================== MOVIMENTO REDUZIDO ==================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}
