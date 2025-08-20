// ==========================
// Inicialização e Configuração
// ==========================
document.addEventListener("DOMContentLoaded", function () {
    // Marcar body como carregado
    document.body.classList.add('loaded');
    
    // Inicializar partículas
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#2e6cf6" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#2e6cf6",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 10,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }

    // Inicializar loader
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.classList.add("fade-out");
            setTimeout(() => loader.style.display = "none", 800);
        }, 2000);
    }

    // Inicializar contador de visitantes
    incrementVisitorCount();
    
    // Inicializar navegação por pontos
    initFloatingNav();
    
    // Inicializar animações de entrada
    initFadeInAnimations();
    
    // Inicializar efeitos de áudio
    initAudioEffects();
    
    // Inicializar modo claro/escuro baseado no horário
    initTimeBasedTheme();
    
    // Inicializar outros componentes
    initTypewriterEffect();
    initTimelineAnimation();
    initPortfolioInteractions();
    initSkillsInteractions();
    initVerMaisButton();
});

// ==========================
// Contador de Visitantes ATUALIZADO
// ==========================
// settings/js/script.js - Função incrementVisitorCount atualizada
async function incrementVisitorCount() {
    try {
        // Primeiro tenta buscar o contador atual
        const getResponse = await fetch('/api/visitors');
        let currentCount = 0;
        
        if (getResponse.ok) {
            const data = await getResponse.json();
            currentCount = data.count;
            document.getElementById('counter').textContent = currentCount.toLocaleString();
        }

        // Depois incrementa
        const postResponse = await fetch('/api/visitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (postResponse.ok) {
            const data = await postResponse.json();
            document.getElementById('counter').textContent = data.count.toLocaleString();
        }
    } catch (error) {
        console.error('Erro no contador:', error);
        fallbackCounter();
    }
}

function fallbackCounter() {
    const counter = document.getElementById('counter');
    if (counter && !sessionStorage.getItem('visitCounted')) {
        const baseCount = Math.floor(Math.random() * 100) + 1000;
        counter.textContent = baseCount.toLocaleString();
        sessionStorage.setItem('visitCounted', 'true');
    } else if (counter) {
        const currentCount = parseInt(counter.textContent.replace(/\D/g, '') || '0');
        counter.textContent = (currentCount + 1).toLocaleString();
    }
}

// ==========================
// Acessibilidade: Alto contraste e ajuste de fonte
// ==========================
function toggleContraste() {
    document.body.classList.toggle('alto-contraste');
    playSound('click');
}

function alterarFonte(delta) {
    const html = document.documentElement;
    let size = parseInt(window.getComputedStyle(html).fontSize);
    size = Math.max(12, Math.min(24, size + delta));
    html.style.fontSize = size + "px";
    playSound('click');
}

// ==========================
// Efeitos de Áudio
// ==========================
let audioEnabled = false;

function toggleAudio() {
    audioEnabled = !audioEnabled;
    const button = document.querySelector('[aria-label="Ativar/desativar efeitos sonoros"]');
    const icon = button.querySelector('i');
    
    if (audioEnabled) {
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
        playSound('enable');
    } else {
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
        playSound('disable');
    }
}

function initAudioEffects() {
    // Criar elementos de áudio
    const audioContainer = document.createElement('div');
    audioContainer.style.display = 'none';
    
    const clickSound = document.createElement('audio');
    clickSound.id = 'click-sound';
    clickSound.innerHTML = '<source src="https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3" type="audio/mpeg">';
    
    const hoverSound = document.createElement('audio');
    hoverSound.id = 'hover-sound';
    hoverSound.innerHTML = '<source src="https://assets.mixkit.co/sfx/preview/mixkit-hover-sound-1134.mp3" type="audio/mpeg">';
    
    const enableSound = document.createElement('audio');
    enableSound.id = 'enable-sound';
    enableSound.innerHTML = '<source src="https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3" type="audio/mpeg">';
    
    const disableSound = document.createElement('audio');
    disableSound.id = 'disable-sound';
    disableSound.innerHTML = '<source src="https://assets.mixkit.co/sfx/preview/mixkit-game-show-option-select-1165.mp3" type="audio/mpeg">';
    
    audioContainer.appendChild(clickSound);
    audioContainer.appendChild(hoverSound);
    audioContainer.appendChild(enableSound);
    audioContainer.appendChild(disableSound);
    document.body.appendChild(audioContainer);
    
    // Adicionar eventos de hover para elementos interativos
    const interactiveElements = document.querySelectorAll('button, a, .competencia-item, .portfolio-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
    });
}

function playSound(type) {
    if (!audioEnabled) return;
    
    const sound = document.getElementById(`${type}-sound`);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play failed:", e));
    }
}

// ==========================
// Navegação Flutuante
// ==========================
function initFloatingNav() {
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section');
    
    // Rolagem suave para seções
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (sections[index]) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
                playSound('click');
            }
        });
    });
    
    // Atualizar navegação durante a rolagem
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navDots.forEach(dot => dot.classList.remove('active'));
                navDots[index].classList.add('active');
            }
        });
    });
}

// ==========================
// Animações de Entrada
// ==========================
function initFadeInAnimations() {
    const fadeEls = document.querySelectorAll('[fade-in-up]');
    
    function checkFadeIn() {
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.classList.add('visible');
            }
        });
    }
    
    checkFadeIn();
    window.addEventListener('scroll', checkFadeIn);
}

// ==========================
// Modo Claro/Escuro Baseado no Horário
// ==========================
function initTimeBasedTheme() {
    const hour = new Date().getHours();
    
    // Das 7h às 19h: modo claro,其余: modo escuro
    if (hour >= 7 && hour < 19) {
        document.body.classList.add('modo-claro');
    }
}

// ==========================
// Efeito de Digitação para Títulos
// ==========================
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        el.style.width = text.length + 'ch';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        };
        
        // Iniciar quando elemento estiver visível
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                type();
                observer.disconnect();
            }
        });
        
        observer.observe(el);
    });
}

// ==========================
// Timeline Interativa
// ==========================
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => observer.observe(item));
}

// ==========================
// Portfolio Interativo
// ==========================
function initPortfolioInteractions() {
    // Efeito de hover nos itens do portfolio
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
            playSound('hover');
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ==========================
// Botão Ver Mais Projetos
// ==========================
function initVerMaisButton() {
    const verMaisBtn = document.getElementById('ver-mais-projetos');
    const projetosAdicionais = document.getElementById('projetos-adicionais');
    
    if (verMaisBtn && projetosAdicionais) {
        verMaisBtn.addEventListener('click', () => {
            if (projetosAdicionais.style.display === 'none') {
                projetosAdicionais.style.display = 'grid';
                verMaisBtn.textContent = 'Ver Menos Projetos';
            } else {
                projetosAdicionais.style.display = 'none';
                verMaisBtn.textContent = 'Ver Mais Projetos';
            }
            playSound('click');
        });
    }
}

// ==========================
// Competências Interativas
// ==========================
function initSkillsInteractions() {
    document.querySelectorAll('.competencia-item').forEach(item => {
        item.addEventListener('click', function () {
            this.classList.add('clicked');
            playSound('click');
            setTimeout(() => this.classList.remove('clicked'), 350);
        });
    });
}

// ==========================
// Foco visível para acessibilidade
// ==========================
document.addEventListener('keydown', function(e) {
    if (e.key === "Tab") {
        document.body.classList.add('user-is-tabbing');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('user-is-tabbing');
});

// ==========================
// Mensagem de acessibilidade para leitores de tela
// ==========================
(function() {
    const srMessage = document.createElement('div');
    srMessage.setAttribute('aria-live', 'polite');
    srMessage.setAttribute('role', 'status');
    srMessage.style.position = 'absolute';
    srMessage.style.left = '-9999px';
    srMessage.textContent = "Bem-vindo ao currículo de Nilson Gomes. Use Tab para navegar.";
    document.body.appendChild(srMessage);
})();

// ==========================
// Mensagem de boas-vindas no console
// ==========================
console.log("%cBem-vindo ao currículo de Nilson Gomes! 🚀", "color: #2e6cf6; font-size: 1.2em; font-weight: bold;");
console.log("%cDesenvolvido com HTML5, CSS3, JavaScript e muito café! ☕", "color: #ff3864; font-size: 1em;");

// ==========================
// Funções utilitárias adicionais
// ==========================
function smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// ==========================
// Detecção de recursos do navegador
// ==========================
function checkBrowserCompatibility() {
    const features = {
        'ES6': typeof Symbol !== 'undefined' && typeof Map !== 'undefined',
        'Fetch': typeof fetch !== 'undefined',
        'IntersectionObserver': typeof IntersectionObserver !== 'undefined',
        'CSSVariables': window.CSS && window.CSS.supports && window.CSS.supports('--a', 0)
    };

    if (!features.ES6 || !features.Fetch || !features.IntersectionObserver || !features.CSSVariables) {
        console.warn('Alguns recursos modernos não são suportados neste navegador');
        // Adicionar fallbacks se necessário
    }
}

// Verificar compatibilidade ao carregar
checkBrowserCompatibility();

// ==========================
// Prevenção de comportamento padrão para links âncora
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            smoothScrollTo(target);
        }
    });
});

// ==========================
// Otimização de performance - Lazy loading para imagens
// ==========================
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================
// Prevenção de múltiplos cliques em botões
// ==========================
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.classList.contains('loading')) {
            e.preventDefault();
            return;
        }
        
        this.classList.add('loading');
        setTimeout(() => this.classList.remove('loading'), 1000);
    });
});