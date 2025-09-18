// LOADER
class PortfolioLoader {
    constructor() {
        this.progress = 0;
        this.targetProgress = 0;
        this.isComplete = false;
        this.initElements();
        this.createFloatingParticles();
        this.startLoader();
    }

    initElements() {
        this.loader = document.getElementById('loader');
        this.loaderLogo = document.getElementById('loaderLogo');
        this.loaderText = document.getElementById('loaderText');
        this.loaderProgress = document.getElementById('loaderProgress');
        this.loaderPercentage = document.getElementById('loaderPercentage');
        this.loaderTransition = document.getElementById('loaderTransition');
        this.mainContent = document.getElementById('mainContent');
    }

    createFloatingParticles() {
        const container = document.getElementById('floatingParticles');
        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            container.appendChild(particle);
            // Posición inicial aleatoria al fondo
            gsap.set(particle, {
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + Math.random() * 100,
                opacity: 0
            });
            // Animación hacia arriba
            gsap.to(particle, {
                y: -100,
                opacity: 0.6,
                duration: Math.random() * 4 + 3,
                delay: Math.random() * 3,
                ease: 'none',
                repeat: -1,
                repeatDelay: Math.random() * 2,
                onRepeat: () => {
                    // Cambiar posición x en cada ciclo
                    gsap.set(particle, {
                        x: Math.random() * window.innerWidth
                    });
                }
            });
        }
        animateParticlesContainer();
    }

    startLoader() {
        // Animación inicial del logo
        gsap.to(this.loaderLogo, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.5
        });

        // Animación del texto
        gsap.to(this.loaderText, {
            opacity: 1,
            duration: 0.8,
            delay: 1
        });

        // Animación del porcentaje
        gsap.to(this.loaderPercentage, {
            opacity: 1,
            duration: 0.8,
            delay: 1.2
        });

        // Simulación de carga progresiva
        this.simulateLoading();
    }

    simulateLoading() {
        const loadingSteps = [
            { progress: 20, delay: 500, text: "Cargando assets..." },
            { progress: 45, delay: 800, text: "Inicializando componentes..." },
            { progress: 70, delay: 600, text: "Configurando animaciones..." },
            { progress: 90, delay: 400, text: "Optimizando experiencia..." },
            { progress: 100, delay: 300, text: "¡Listo para impresionar!" }
        ];

        let currentStep = 0;

        const executeStep = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];

                // Actualizar texto
                this.updateLoadingText(step.text);

                // Animar progreso
                this.animateProgress(step.progress);

                currentStep++;
                setTimeout(executeStep, step.delay);
            } else {
                // Completar carga
                setTimeout(() => this.startTransition(), 800);
            }
        };

        executeStep();
    }

    updateLoadingText(text) {
        gsap.to(this.loaderText, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                this.loaderText.innerHTML = `<span class="code-brackets">//</span> ${text}`;
                gsap.to(this.loaderText, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
    }

    animateProgress(targetProgress) {
        const tl = gsap.timeline();

        tl.to(this, {
            targetProgress: targetProgress,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
                this.progress = gsap.utils.interpolate(this.progress, this.targetProgress, 0.1);

                // Actualizar barra de progreso
                gsap.set(this.loaderProgress, {
                    transform: `translateX(${this.progress - 100}%)`
                });

                // Actualizar porcentaje
                this.loaderPercentage.textContent = Math.floor(this.progress) + '%';
            }
        });

        // Efecto de brillo en la barra
        tl.to(this.loaderProgress, {
            boxShadow: "0 0 20px rgba(251, 197, 35, 0.6)",
            duration: 0.3,
            yoyo: true,
            repeat: 1
        }, "-=0.4");
    }

    completeLoading() {
        this.isComplete = true;
        // Animación final del logo con movimiento hacia navbar
        const finalTl = gsap.timeline();
        finalTl.to(this.loaderLogo, {
            scale: 1.2,
            duration: 0.5,
            ease: "power2.out"
        })
            .to([this.loaderText, this.loaderPercentage], {
                opacity: 0,
                y: 20,
                duration: 0.4,
                stagger: 0.1
            }, "-=0.3")
            .to(this.loaderProgress.parentElement, {
                opacity: 0,
                scale: 0.8,
                duration: 0.4
            }, "-=0.2")
            // Mover el logo hacia la posición exacta del navbar
            // .to(this.loaderLogo, {
            //     x: () => {
            //         // Calcular posición exacta del navbar brand
            //         const viewportWidth = window.innerWidth;
            //         if (viewportWidth <= 768) {
            //             return viewportWidth * -0.35; // Móvil
            //         } else if (viewportWidth <= 1024) {
            //             return viewportWidth * -0.38; // Tablet
            //         }
            //         return viewportWidth * -0.42; // Desktop
            //     },
            //     y: () => {
            //         const viewportHeight = window.innerHeight;
            //         return viewportHeight * -0.47;
            //     },
            //     scale: 0.35,
            //     duration: 0.15,
            //     ease: "power3.inOut"
            // })
            // Desvanecimiento más rápido del logo
            .to(this.loaderLogo, {
                opacity: 0,
                duration: 0.15
            })
            // Iniciar transición inmediatamente después del desvanecimiento
            .call(() => this.startTransition(), null, "+=0");
    }

    startTransition() {
        // Preparar elementos de transición inmediatamente
        gsap.set('.slide-panel', { x: '-100%' });
        const transitionTl = gsap.timeline();
        // Staggered slide-in INMEDIATO sin delay
        transitionTl.to('.slide-panel', {
            x: '0%',
            duration: 0.6,
            stagger: 0.04,
            ease: "power2.inOut"
        }, 0) // Empezar al mismo tiempo que el timeline
            .to('.slide-panel', {
                x: '100%',
                duration: 0.6,
                stagger: 0.04,
                ease: "power2.inOut"
            }, 0.3); // Comenzar a salir antes de terminar la entrada

        // Ocultar loader y mostrar contenido durante la mitad de la transición
        transitionTl.call(() => {
            this.loader.style.display = 'none';
            this.showMainContent();
        }, null, 0.4);

        // Ocultar transición rápidamente
        transitionTl.to(this.loaderTransition, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                this.loaderTransition.style.display = 'none';
            }
        }, 0.8);
    }

    showMainContent() {
        // Animación de entrada del contenido principal con navbar apareciendo primero
        gsap.timeline()
            .set(this.mainContent, { opacity: 1 })
            // El navbar aparece primero con el logo en posición
            .from('.navbar', {
                y: -100,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            })
            // Efecto especial para el logo del navbar
            .from('.navbar-brand', {
                scale: 1.5,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.4")
            // El resto del contenido aparece después
            .from('.main-title .title-line', {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out"
            }, "-=0.2")
            // .from('.subtitle', {
            //     y: 30,
            //     opacity: 0,
            //     duration: 0.8,
            //     stagger: 0.1,
            //     ease: "power2.out"
            // }, "-=0.8")
            .from('.status-section', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6")
            .from('.social-icon', {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=0.4");
    }
}

// Inicializar loader cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioLoader();
});

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// FIN LOADER

// FOOTER
// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

// Animación de entrada del footer
gsap.timeline({
    scrollTrigger: {
        trigger: '.footer-section',
        start: 'top 80%',
        end: 'bottom 100%',
        toggleActions: 'play none none reverse'
    }
})
    .to('.footer-main', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    })
    .to('.footer-column', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out'
    }, '-=0.4')
    .to('.footer-bottom', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.2');

function createParticles(count = 100) {
    const container = document.getElementById('particles-container');

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        container.appendChild(particle);
    }

    animateParticlesContainer();
}

function animateParticlesContainer() {
    const particles = document.querySelectorAll('#particles-container .particle');

    particles.forEach((particle) => {
        // Posición inicial aleatoria al fondo
        gsap.set(particle, {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + Math.random() * 100,
            opacity: 0
        });

        // Animación hacia arriba
        gsap.to(particle, {
            y: -100,
            opacity: 0.6,
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 3,
            ease: 'none',
            repeat: -1,
            repeatDelay: Math.random() * 2,
            onRepeat: () => {
                // Cambiar posición x en cada ciclo
                gsap.set(particle, {
                    x: Math.random() * window.innerWidth
                });
            }
        });
    });
}

// Iniciar
createParticles(10); // Puedes ajustar el número según lo denso que quieras


// Animación de línea flotante
function animateFloatingLine() {
    const line = document.querySelector('.floating-line');

    gsap.timeline({ repeat: -1, repeatDelay: 3 })
        .to(line, {
            left: '100%',
            duration: 2,
            ease: 'power2.inOut'
        })
        .set(line, { left: '-100%' });
}

// Efecto de hover en el logo
document.getElementById('footerLogo').addEventListener('mouseenter', function () {
    gsap.timeline()
        .to(this, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
        })
        .to(this, {
            rotationY: 360,
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.1');
});

document.getElementById('footerLogo').addEventListener('mouseleave', function () {
    gsap.to(this, {
        scale: 1,
        rotationY: 0,
        duration: 0.3,
        ease: 'power2.out'
    });
});

// Efecto en links sociales
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
        gsap.to(this, {
            scale: 1.2,
            rotation: 10,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });

    link.addEventListener('mouseleave', function () {
        gsap.to(this, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    link.addEventListener('click', function (e) {
        // e.preventDefault();
        gsap.timeline()
            .to(this, {
                scale: 0.9,
                duration: 0.1
            })
            .to(this, {
                scale: 1.3,
                duration: 0.2
            })
            .to(this, {
                scale: 1,
                duration: 0.2
            });
    });
});

// Efecto en links del footer
document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
        gsap.to(this, {
            x: 5,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    link.addEventListener('mouseleave', function () {
        gsap.to(this, {
            x: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Funcionalidad del botón "Volver arriba"
gsap.registerPlugin(ScrollToPlugin);
document.getElementById('backToTop').addEventListener('click', function (e) {
    e.preventDefault();
    gsap.to(window, {
        scrollTo: {
            y: "#top" // posición en píxeles
        },
        // duration: 1.5,
        ease: 'power3.inOut'
    });

    // Efecto visual en el botón
    gsap.timeline()
        .to(this.querySelector('svg'), {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
        })
        .to(this.querySelector('svg'), {
            y: 0,
            duration: 0.4,
            ease: 'bounce.out'
        });
});

// Animación del orb de brillo
gsap.to('.glow-orb', {
    x: '200px',
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
});

gsap.to('.glow-orb', {
    opacity: 0.2,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
});

// Efecto de escritura en el código
function typewriterEffect() {
    const codeLines = document.querySelectorAll('.code-snippet div');

    gsap.set(codeLines, { opacity: 0 });

    gsap.to(codeLines, {
        opacity: 0.3,
        duration: 0.5,
        stagger: 0.3,
        ease: 'none'
    });
}

// Inicializar animaciones
animateFloatingLine();

// Efecto de escritura con delay
setTimeout(typewriterEffect, 2000);

// Detectar hover en toda la sección footer
document.querySelector('.footer-section').addEventListener('mouseenter', function () {
    gsap.to('.particle', {
        opacity: 0.8,
        duration: 0.5,
        stagger: 0.1
    });
});

document.querySelector('.footer-section').addEventListener('mouseleave', function () {
    gsap.to('.particle', {
        opacity: 0.6,
        duration: 0.5,
        stagger: 0.1
    });
});


// FIN FOOTER

// CONTACTO
// Inicializar GSAP
gsap.registerPlugin();

// Animaciones de entrada
gsap.timeline()
    .to('.contact-content', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .to('.contact-form', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5');

// Animación de formas flotantes
gsap.to('.shape-4', {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none'
});

gsap.to('.shape-5', {
    rotation: -360,
    duration: 25,
    repeat: -1,
    ease: 'none'
});

gsap.to('.shape-6', {
    rotation: 360,
    duration: 15,
    repeat: -1,
    ease: 'none'
});

// Efecto de movimiento suave para las formas
gsap.to('.shape', {
    y: '20px',
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
    stagger: 0.5
});

// Función para crear efecto ripple
function createRipple(e, color = 'var(--primary-yellow)') {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.left = (e.clientX - 150) + 'px';
    ripple.style.top = (e.clientY - 150) + 'px';
    ripple.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;

    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Función para crear flash de color
function createFlash(color) {
    const flashOverlay = document.getElementsByClassName('flash-overlay');
    // flashOverlay.style.background = `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${color} 0%, transparent 50%)`;

    gsap.timeline()
        .to(flashOverlay, {
            opacity: 0.3,
            duration: 0.1,
            ease: 'power2.out'
        })
        .to(flashOverlay, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
}

// Seguimiento del mouse para efectos
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', mouseX + '%');
    document.documentElement.style.setProperty('--mouse-y', mouseY + '%');
});

// Efectos para botones sociales
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const social = this.getAttribute('data-social');
        let color;

        switch (social) {
            case 'linkedin':
                color = '#286cb5';
                break;
            case 'github':
                color = 'var(--secondary-orange)';
                break;
            case 'tiktok':
                color = 'var(--primary-yellow)';
                break;
            case 'email':
                color = '#ea4436';
                break;
            default:
                color = 'var(--primary-yellow)';
        }

        createRipple(e, color);
        createFlash(color);

        // Animación del botón
        gsap.timeline()
            .to(this, {
                scale: 0.9,
                duration: 0.1
            })
            .to(this, {
                scale: 1.1,
                duration: 0.2
            })
            .to(this, {
                scale: 1,
                duration: 0.2
            });
    });

    // Efecto hover
    btn.addEventListener('mouseenter', function () {
        gsap.to(this, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', function () {
        gsap.to(this, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Efectos para el formulario
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Crear efecto especial de envío
    createFlash('var(--primary-pink)');

    // Animación del botón de envío
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    gsap.timeline()
        .to(submitBtn, {
            scale: 0.95,
            duration: 0.1
        })
        .to(submitBtn, {
            scale: 1.05,
            duration: 0.2
        })
        .to(submitBtn, {
            scale: 1,
            duration: 0.2
        });

    // Cambiar texto temporalmente
    submitBtn.textContent = '¡Enviado!';
    setTimeout(() => {
        submitBtn.textContent = originalText;
    }, 2000);

    // Reset del formulario con animación
    setTimeout(() => {
        gsap.to(this.querySelectorAll('.form-input'), {
            scale: 0.98,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            stagger: 0.05,
            onComplete: () => {
                this.reset();
            }
        });
    }, 1000);
});

// Efectos en inputs del formulario
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function () {
        gsap.to(this, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    input.addEventListener('blur', function () {
        gsap.to(this, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});
// FIN CONTACTO

// PORTAFOLIO
function initPortfolioAnimations() {
    // Animación de entrada para los items del portfolio
    gsap.fromTo('.portfolio-item',
        {
            y: 100,
            opacity: 1,
            scale: 0.8,
            rotation: 5
        },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: ".portfolio-grid",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );



    // Hover animations para las cards
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        const tl = gsap.timeline({ paused: true });

        tl.to(card, {
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out"
        })
            .to(card.querySelector('.project-placeholder'), {
                scale: 1.1,
                duration: 0.4,
                ease: "power2.out"
            }, 0)
            .to(card.querySelector('.portfolio-content'), {
                y: -5,
                duration: 0.4,
                ease: "power2.out"
            }, 0);

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
    });

    // Animación de filtros
    gsap.fromTo('.portfolio-filters',
        {
            y: 50,
            opacity: 1
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".portfolio-filters",
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        }
    );
}

// Filter functionality with animations
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            // Animate out all items
            gsap.to(portfolioItems, {
                scale: 0.8,
                opacity: 1,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.in",
                onComplete: () => {
                    // Filter items
                    portfolioItems.forEach(item => {
                        const category = item.getAttribute('data-category');
                        const shouldShow = filterValue === '*' || category === filterValue;

                        item.style.display = shouldShow ? 'block' : 'none';
                    });

                    // Animate in visible items
                    const visibleItems = Array.from(portfolioItems).filter(item =>
                        item.style.display !== 'none'
                    );

                    gsap.fromTo(visibleItems,
                        {
                            scale: 0.8,
                            opacity: 1,
                            y: 30
                        },
                        {
                            scale: 1,
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.08,
                            ease: "back.out(1.7)"
                        }
                    );
                }
            });
        });
    });
}

// Parallax effect for portfolio background text
function initPortfolioParallax() {

}

// Initialize portfolio animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    // initPortfolioAnimations();
    initPortfolioFilter();
    initPortfolioParallax();
});
// FIN PORTAFOLIO

// POR QUE ELEGIRME
// gsap.registerPlugin(ScrollTrigger);

// function initWhyChooseCards() {
//     const cards = gsap.utils.toArray('.why-choose-card');
//     const totalCards = cards.length;
//     const isMobile = window.innerWidth < 992;

//     // Limpia animaciones previas
//     ScrollTrigger.getAll().forEach(st => st.kill());
//     gsap.killTweensOf(cards);

//     if (isMobile) {
//         // En móvil: apila y centra las tarjetas, sin stacking ni transform
//         cards.forEach(card => {
//             gsap.set(card, {
//                 clearProps: "all",
//                 opacity: 1,
//                 scale: 1,
//                 y: 0,
//                 rotation: 0,
//                 zIndex: 1
//             });
//         });
//     } else {
//         // Desktop: stacking y animación original
//         cards.forEach((card, index) => {
//             gsap.set(card, {
//                 zIndex: totalCards - index,
//                 scale: 1 - (index * 0.05),
//                 y: index * 20,
//                 rotation: index * 2,
//                 transformOrigin: "center center"
//             });
//         });

//         cards.forEach((card, index) => {
//             if (index < totalCards - 1) {
//                 const tl = gsap.timeline({
//                     scrollTrigger: {
//                         trigger: '.why-choose-section',
//                         start: () => `${index * 25}% top`,
//                         end: () => `${(index + 1) * 25}% top`,
//                         scrub: 1,
//                         invalidateOnRefresh: true
//                     }
//                 });

//                 tl.to(card, {
//                     scale: 0.8,
//                     y: -100,
//                     rotation: index % 2 === 0 ? 20 : -20,
//                     opacity: 0,
//                     duration: 1,
//                     ease: "power2.inOut"
//                 });
//             }
//         });

//         gsap.from('.why-choose-cards-container', {
//             opacity: 0,
//             x: 100,
//             duration: 1,
//             ease: "power3.out",
//             delay: 0.6
//         });
//     }
// }

// // Inicializa al cargar y al redimensionar
// window.addEventListener('DOMContentLoaded', initWhyChooseCards);
// window.addEventListener('resize', () => {
//     setTimeout(initWhyChooseCards, 100);
// });
// FIN POR QUE ELEGIRME

//SERVICIOS
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function () {
        if (this.classList.contains('active')) return;
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
    });
});

// Ajustar max-height dinámicamente para contenido variable
function setCardContentMaxHeight() {
    document.querySelectorAll('.service-card').forEach(card => {
        const content = card.querySelector('.service-card-content');
        if (card.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = "0";
        }
    });
}
window.addEventListener('DOMContentLoaded', setCardContentMaxHeight);
window.addEventListener('resize', setCardContentMaxHeight);
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', setCardContentMaxHeight);
});
// FIN SERVICIOS


 // Intersection Observer para animaciones en scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const delay = element.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
                element.classList.add('animated');
                
                // Animar barras de progreso
                const progressBars = element.querySelectorAll('.progress-bar');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                });
            }, delay);
            
            observer.unobserve(element);
        }
    });
}, observerOptions);
// Observar elementos animados
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});
// Efecto hover adicional para las tarjetas
document.querySelectorAll('.expertise-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});


// // Función para manejar el envío del formulario con reCAPTCHA
// function onSubmit(token) {
//     document.getElementById("contact-form").submit();
// }
