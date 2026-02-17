import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// ==================== STYLES ====================
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary-blue: #575fce;
    --primary-cyan: #5cd6c7;
    --primary-yellow: #fec047;
    --primary-coral: #ff5e56;
    --white: #ffffff;
    --dark: #1a1a1a;
    --gray: #666666;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    color: var(--dark);
    background: var(--white);
    overflow-x: hidden;
    line-height: 1.6;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1.5rem;
    }
  }

  /* Navigation */
  .navigation {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 1.5rem 0;
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.8);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-blue);
    letter-spacing: -0.5px;
  }

  .nav-links {
    display: flex;
    gap: 2.5rem;
    list-style: none;
  }

  .nav-links a {
    color: var(--dark);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.3s ease;
    position: relative;
  }

  .nav-links a:hover {
    color: var(--primary-blue);
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-blue);
    transition: width 0.3s ease;
  }

  .nav-links a:hover::after {
    width: 100%;
  }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--dark);
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
    
    .mobile-menu-btn {
      display: block;
    }
  }

  /* Hero Section */
  .hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
  }

  .particle-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
  }

  .hero-title {
    font-size: clamp(2.5rem, 8vw, 5.5rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-cyan) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    color: var(--gray);
    margin-bottom: 3rem;
    font-weight: 400;
  }

  .cta-button {
    display: inline-block;
    padding: 1.2rem 3rem;
    background: var(--primary-blue);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(87, 95, 206, 0.3);
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(87, 95, 206, 0.4);
  }

  .cta-button:active {
    transform: translateY(0);
  }

  /* Animated Shapes */
  .floating-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
  }

  .shape {
    position: absolute;
    opacity: 0.6;
  }

  /* Section Styles */
  .section {
    position: relative;
    padding: 8rem 0;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .section {
      padding: 4rem 0;
    }
  }

  .section-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .section-subtitle {
    font-size: clamp(1rem, 2vw, 1.3rem);
    color: var(--gray);
    margin-bottom: 4rem;
    max-width: 700px;
  }

  /* About Section */
  .about-section {
    background: var(--white);
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  @media (max-width: 968px) {
    .about-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .about-text {
    font-size: 1.15rem;
    line-height: 1.8;
    color: var(--dark);
  }

  .about-text p {
    margin-bottom: 1.5rem;
  }

  .highlight {
    color: var(--primary-blue);
    font-weight: 600;
  }

  .feature-list {
    list-style: none;
    margin: 2rem 0;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .feature-item:hover {
    background: #f8f9ff;
    transform: translateX(10px);
  }

  .feature-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
    font-size: 1.3rem;
  }

  .apply-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: var(--primary-cyan);
    color: var(--dark);
    text-decoration: none;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-top: 2rem;
  }

  .apply-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(92, 214, 199, 0.3);
  }

  /* SVG Graphics */
  .svg-graphic {
    width: 100%;
    height: 500px;
  }

  @media (max-width: 768px) {
    .svg-graphic {
      height: 300px;
    }
  }

  /* History Section */
  .history-section {
    background: linear-gradient(135deg, #f8f9ff 0%, #fff5f0 100%);
  }

  .timeline {
    position: relative;
    padding: 2rem 0;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--primary-blue), var(--primary-cyan));
    transform: translateX(-50%);
  }

  @media (max-width: 768px) {
    .timeline::before {
      left: 20px;
    }
  }

  .timeline-item {
    position: relative;
    margin-bottom: 4rem;
    display: flex;
    align-items: center;
  }

  .timeline-item:nth-child(odd) {
    flex-direction: row;
  }

  .timeline-item:nth-child(even) {
    flex-direction: row-reverse;
  }

  @media (max-width: 768px) {
    .timeline-item,
    .timeline-item:nth-child(even) {
      flex-direction: row;
      padding-left: 60px;
    }
  }

  .timeline-content {
    flex: 1;
    padding: 2rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    margin: 0 2rem;
    position: relative;
  }

  @media (max-width: 768px) {
    .timeline-content {
      margin: 0;
    }
  }

  .timeline-year {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-blue);
    margin-bottom: 0.5rem;
  }

  .timeline-title {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .timeline-description {
    color: var(--gray);
    line-height: 1.6;
  }

  .timeline-dot {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 4px solid var(--primary-blue);
    z-index: 2;
  }

  @media (max-width: 768px) {
    .timeline-dot {
      left: 20px;
    }
  }

  /* Presidium Section */
  .presidium-section {
    background: var(--white);
  }

  .presidium-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2.5rem;
    margin-top: 3rem;
  }

  .presidium-card {
    background: white;
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .presidium-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-cyan));
  }

  .presidium-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  }

  .presidium-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .presidium-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--dark);
  }

  .presidium-role {
    color: var(--primary-blue);
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .presidium-message {
    color: var(--gray);
    line-height: 1.7;
    font-size: 0.95rem;
  }

  /* Committee Section */
  .committee-section {
    background: linear-gradient(135deg, #fff5f0 0%, #f8f9ff 100%);
  }

  .committee-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .committee-card {
    background: white;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
  }

  .committee-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .committee-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .committee-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .committee-name {
    color: var(--gray);
    font-size: 0.95rem;
  }

  /* Footer */
  .footer {
    background: var(--dark);
    color: white;
    padding: 3rem 0 2rem;
    margin-top: 6rem;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-bottom: 2rem;
  }

  .footer-section h3 {
    margin-bottom: 1rem;
    color: var(--primary-cyan);
  }

  .footer-section p,
  .footer-section a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    display: block;
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;
  }

  .footer-section a:hover {
    color: white;
  }

  .footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
  }

  .social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .social-link {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .social-link:hover {
    background: var(--primary-blue);
    transform: translateY(-3px);
  }
`;

// ==================== PARTICLE SYSTEM ====================
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#575fce', '#5cd6c7', '#fec047', '#ff5e56'];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
        }

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Connect nearby particles
      particlesRef.current.forEach((a, i) => {
        particlesRef.current.slice(i + 1).forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = a.color;
            ctx.globalAlpha = 0.1 * (1 - distance / 100);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

// ==================== ANIMATED SVG GRAPHICS ====================
const AnimatedSVG = () => {
  return (
    <svg className="svg-graphic" viewBox="0 0 600 500" fill="none">
      <motion.circle
        cx="150"
        cy="150"
        r="80"
        fill="#575fce"
        opacity="0.3"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.rect
        x="350"
        y="100"
        width="150"
        height="150"
        fill="#5cd6c7"
        opacity="0.3"
        rx="20"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.path
        d="M 300 350 Q 400 250, 500 350 T 700 350"
        stroke="#fec047"
        strokeWidth="4"
        fill="none"
        opacity="0.5"
        animate={{
          d: [
            "M 300 350 Q 400 250, 500 350 T 700 350",
            "M 300 350 Q 400 450, 500 350 T 700 350",
            "M 300 350 Q 400 250, 500 350 T 700 350",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.polygon
        points="100,400 150,350 200,400 175,450 125,450"
        fill="#ff5e56"
        opacity="0.3"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </svg>
  );
};


// ==================== GRID SVG GRAPHICS ====================
const GridGraphic = () => {
  return (
    <svg className="grid-graphic" viewBox="0 0 600 500" fill="none">
      {/* Animated Grid Lines */}
      {[...Array(8)].map((_, i) => (
        <motion.line
          key={`h-${i}`}
          x1="0"
          y1={50 + i * 60}
          x2="600"
          y2={50 + i * 60}
          stroke="#575fce"
          strokeWidth="1.5"
          opacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
      
      {[...Array(10)].map((_, i) => (
        <motion.line
          key={`v-${i}`}
          x1={50 + i * 60}
          y1="0"
          x2={50 + i * 60}
          y2="500"
          stroke="#5cd6c7"
          strokeWidth="1.5"
          opacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Animated Nodes */}
      {[[150, 150], [450, 150], [300, 300], [150, 450], [450, 450]].map(([cx, cy], i) => (
        <motion.circle
          key={`node-${i}`}
          cx={cx}
          cy={cy}
          r="6"
          fill="#575fce"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Connecting Lines */}
      <motion.path
        d="M 150 150 L 450 150 L 300 300 Z"
        stroke="#fec047"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </svg>
  );
};

// ==================== MAIN APP COMPONENT ====================
const SCOModelWebsite = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  // Smooth scroll progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      
      {/* Progress Bar */}
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #575fce, #5cd6c7)',
          transformOrigin: '0%',
          zIndex: 9999
        }}
      />

      {/* Navigation */}
      <nav className="navigation">
        <div className="container">
          <div className="nav-content">
            <motion.div 
              className="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Модель ШОС
            </motion.div>
            <ul className="nav-links">
              <motion.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                  Главная
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
                  О проекте
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <a href="#history" onClick={(e) => { e.preventDefault(); scrollToSection('history'); }}>
                  История
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <a href="#presidium" onClick={(e) => { e.preventDefault(); scrollToSection('presidium'); }}>
                  Президиум
                </a>
              </motion.li>
            </ul>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <ParticleCanvas />
        
        <div className="floating-shapes">
          <motion.div
            className="shape"
            style={{
              top: '10%',
              left: '10%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #575fce, #5cd6c7)',
            }}
            animate={{
              y: [0, 30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="shape"
            style={{
              top: '60%',
              right: '15%',
              width: '80px',
              height: '80px',
              background: '#fec047',
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Модель ШОС 2026
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Международная образовательная платформа для студентов и школьников.
            <br />
            Развивайте дипломатические навыки, участвуйте в содержательных дискуссиях.
          </motion.p>
          <motion.a
            href="#about"
            className="cta-button"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
          >
            Принять участие
          </motion.a>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* History Section */}
      <HistorySection />

      {/* Presidium Section */}
      <PresidiumSection />

      {/* Committee Section */}
      <CommitteeSection />

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Модель ШОС</h3>
              <p>Международная образовательная платформа, объединяющая студентов для обсуждения актуальных вопросов взаимодействия стран-участниц ШОС.</p>
            </div>
            <div className="footer-section">
              <h3>Контакты</h3>
              <a href="mailto:sco.scpm@mail.ru">sco.scpm@mail.ru</a>
            </div>
            <div className="footer-section">
              <h3>Следите за нами</h3>
              <div className="social-links">
                <a href="#" className="social-link">VK</a>
                <a href="#" className="social-link">TG</a>
                <a href="#" className="social-link">IG</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Модель ШОС ШЦПМ. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

// ==================== ABOUT SECTION ====================
const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section about-section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">О проекте</h2>
          <p className="section-subtitle">
            Площадка для развития дипломатических навыков и международного диалога
          </p>
        </motion.div>

        <div className="about-grid">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              <span className="highlight">Модель ШОС</span> — это уникальная образовательная платформа, где студенты и школьники могут погрузиться в мир международной дипломатии, представляя интересы стран-участниц Шанхайской организации сотрудничества.
            </p>
            <p>
              Это не просто конференция — это живой диалог между государствами, где важны не заученные речи, а умение слышать друг друга, отстаивать позицию своей страны и находить компромиссные решения.
            </p>

            <ul className="feature-list">
              <FeatureItem 
                color="#575fce"
                text="Развитие навыков публичных выступлений и аргументации"
                delay={0.3}
                isInView={isInView}
              />
              <FeatureItem 
                color="#5cd6c7"
                text="Погружение в международную политику и дипломатию"
                delay={0.4}
                isInView={isInView}
              />
              <FeatureItem 
                color="#fec047"
                text="Нетворкинг с единомышленниками из разных регионов"
                delay={0.5}
                isInView={isInView}
              />
              <FeatureItem  
                color="#ff5e56"
                text="Практический опыт работы с документами и резолюциями"
                delay={0.6}
                isInView={isInView}
              />
            </ul>

            <motion.a
              href="https://forms.gle/2ctscQKcnjEAFWsD9"
              target="_blank"
              rel="noopener noreferrer"
              className="apply-button"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Подать заявку
              <span>→</span>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <AnimatedSVG />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon, color, text, delay, isInView }) => (
  <motion.li
    className="feature-item"
    initial={{ opacity: 0, x: -20 }}
    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="feature-icon" style={{ background: `${color}20` }}>
      {icon}
    </div>
    <span>{text}</span>
  </motion.li>
);

// ==================== HISTORY SECTION ====================
const HistorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const timelineData = [
    {
      year: "2001",
      title: "Основание ШОС",
      description: "Шанхайская организация сотрудничества была создана в Шанхае главами шести государств: Китая, России, Казахстана, Кыргызстана, Таджикистана и Узбекистана."
    },
    {
      year: "2015",
      title: "Первые модели в мире",
      description: "По аналогии с моделями ООН, в образовательных учреждениях начинают проводиться симуляции работы органов ШОС для студентов."
    },
    {
      year: "2024",
      title: "Развитие движения в России",
      description: "Модели ШОС становятся популярными в российских университетах, давая студентам возможность изучать евразийскую интеграцию изнутри."
    },
    {
      year: "2026",
      title: "Модель ШОС ШЦПМ",
      description: "Запуск новой образовательной платформы, объединяющей школьников и студентов для изучения международного сотрудничества в формате ШОС."
    }
  ];

  return (
    <section id="history" className="section history-section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">История</h2>
          <p className="section-subtitle">
            От создания ШОС до современных образовательных моделей
          </p>
        </motion.div>

        <div className="timeline">
          {timelineData.map((item, index) => (
            <TimelineItem
              key={index}
              item={item}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ item, index, isInView }) => (
  <motion.div
    className="timeline-item"
    initial={{ opacity: 0, y: 50 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
  >
    <div className="timeline-dot" />
    <motion.div
      className="timeline-content"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="timeline-year">{item.year}</div>
      <h3 className="timeline-title">{item.title}</h3>
      <p className="timeline-description">{item.description}</p>
    </motion.div>
  </motion.div>
);

// ==================== PRESIDIUM SECTION ====================
const PresidiumSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const presidiumMembers = [
    {
      name: "Создатель модели",
      role: "Основатель",
      message: "Уважаемые участники и делегаты Модели ШОС! Как создатель модели, рада приветствовать вас от лица Президиума! Наша команда надеется на продуктивную работу, составление содержательных и взвешенных проектов резолюций, конструктивные дебаты и поиск эффективных решений по вопросам повестки. Мы уверены, что каждый из вас продемонстрирует высокий уровень подготовки и умение аргументированно отстаивать позицию своей страны. Желаю всем плодотворной работы и успешных выступлений!",
      initials: "СО"
    },
    {
      name: "Гаджимурадов Абдулла",
      role: "Член президиума",
      message: "Дорогие делегаты! От лица Президиума рад приветствовать вас на модели ШОС ШЦПМ 2026. Мы надеемся, что вы получите удовольствие и сможете реализовать свои умения на модели ШОС. Ваши смелые идеи и оригинальные подходы — ключ к успеху. Желаю успехов!",
      initials: "ГА"
    },
    {
      name: "Сергеева Фёкла",
      role: "Создатель и член президиума",
      message: "Дорогие делегаты! От лица Президиума и создателя рада приветствовать вас на модели ШОС ШЦПМ 2026. Модель ШОС — это площадка для реального диалога между государствами, где важны не заученные речи, а умение слышать друг друга, отстаивать позицию и находить общие решения. Здесь сталкиваются разные интересы и подходы, и именно это делает дискуссии живыми и по-настоящему содержательными. От вас мы ожидаем активности, инициативы и уважения к регламенту и коллегам. Не бойтесь предлагать идеи, задавать вопросы и брать на себя ответственность за ход обсуждений — модель создавалась именно для этого. Желаю вам яркой, продуктивной работы и опыта, который вы получите!",
      initials: "СФ"
    }
  ];

  return (
    <section id="presidium" className="section presidium-section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Президиум</h2>
          <p className="section-subtitle">
            Команда, которая делает модель возможной
          </p>
        </motion.div>

        <div className="presidium-grid">
          {presidiumMembers.map((member, index) => (
            <PresidiumCard
              key={index}
              member={member}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const PresidiumCard = ({ member, index, isInView }) => {
  const colors = ['#575fce', '#5cd6c7', '#fec047'];
  
  return (
    <motion.div
      className="presidium-card"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -10 }}
    >
      <motion.div
        className="presidium-avatar"
        style={{ background: colors[index % colors.length] }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        {member.initials}
      </motion.div>
      <h3 className="presidium-name">{member.name}</h3>
      <div className="presidium-role">{member.role}</div>
      <p className="presidium-message">{member.message}</p>
    </motion.div>
  );
};

// ==================== COMMITTEE SECTION ====================
const CommitteeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const committeeMembers = [
    { title: "Генеральный секретарь", name: "Координация работы модели" },
    { title: "Заместитель генерального секретарь", name: "Организационные вопросы" },
    { title: "Эксперты", name: "Консультационная поддержка" },
  ];

  return (
    <section id="committee" className="section committee-section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Организационный комитет</h2>
          <p className="section-subtitle">
            Структура и роли участников модели
          </p>
        </motion.div>

        <div className="committee-grid">
          {committeeMembers.map((member, index) => (
            <motion.div
              key={index}
              className="committee-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="committee-title">{member.title}</h3>
              <p className="committee-name">{member.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SCOModelWebsite;