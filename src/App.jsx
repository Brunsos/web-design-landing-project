import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { 
  ArrowRight, 
  Zap, 
  Palette, 
  Code, 
  ShoppingCart,
  Brain,
  X,
  Menu,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function App() {
  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State for navbar visibility on scroll
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const animatedWordRef = useRef(null);
  const staticTextRefs = useRef([]);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaButtonsRef = useRef(null);
  const menuRef = useRef(null);
  
  // Refs for interactive background
  const backgroundRef = useRef(null);
  const circle1Ref = useRef(null);
  const circle2Ref = useRef(null);
  const circle3Ref = useRef(null);
  
  // State for cursor tracking
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });

  // Words to cycle through
  const words = ["Dreams", "Value", "Solutions", "Experiences", "Innovation", "Success"];

  useEffect(() => {
    let currentWordIndex = 0;
    let animationLoop;

    // Initial setup
    gsap.set(animatedWordRef.current, { opacity: 0, y: -30 });
    gsap.set([subtitleRef.current, descriptionRef.current], { 
      opacity: 0, 
      y: 30 
    });
    gsap.set(ctaButtonsRef.current, {
      opacity: 0,
      y: 40
    });
    
    // Animate in the static text first
    const staticTextTimeline = gsap.timeline();
    staticTextTimeline
      .to(staticTextRefs.current, {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.3
      })
;

    // Function to animate word changes seamlessly
    const animateWordCycle = () => {
      // Set the initial word
      animatedWordRef.current.textContent = words[currentWordIndex];
      
      // Animate in the first word
      gsap.to(animatedWordRef.current, {
        duration: 0.6,
        y: 0,
        opacity: 1,
        ease: "power2.out",
        onComplete: () => {
          // Animate in paragraph text and CTA buttons with staggered timing
          gsap.to([subtitleRef.current, descriptionRef.current, ctaButtonsRef.current], {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            stagger: 0.2
          });
        }
      });

      // Create the infinite loop
      const createWordLoop = () => {
        const tl = gsap.timeline({ repeat: -1 });
        
        words.forEach((word, index) => {
          tl.to({}, { duration: 2.5 }) // Hold current word
            .to(animatedWordRef.current, {
              duration: 0.4,
              y: 30,
              opacity: 0,
              ease: "power2.in",
              onComplete: () => {
                currentWordIndex = (currentWordIndex + 1) % words.length;
                animatedWordRef.current.textContent = words[currentWordIndex];
                gsap.set(animatedWordRef.current, { y: -30 });
              }
            })
            .to(animatedWordRef.current, {
              duration: 0.6,
              y: 0,
              opacity: 1,
              ease: "power2.out"
            });
        });

        return tl;
      };

      // Start the word loop after initial animation
      gsap.delayedCall(1, () => {
        animationLoop = createWordLoop();
      });
    };

    // Start the word animation after static text is done
    staticTextTimeline.call(animateWordCycle, null, "+=0.5");

    // Cleanup function
    return () => {
      if (animationLoop) {
        animationLoop.kill();
      }
    };

  }, []);

  // Scroll tracking for navbar hide/show
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only show/hide navbar if we've scrolled more than 10px to avoid jitter
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past initial section - hide navbar
          setIsNavbarVisible(false);
        } else {
          // Scrolling up or at top - show navbar
          setIsNavbarVisible(true);
        }
        lastScrollY = currentScrollY;
      }
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
    
    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }, []);

  // Close menu on click outside or scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  // Interactive background cursor tracking
  useEffect(() => {
    let animationFrameId;
    let lastUpdateTime = 0;
    
    const updateCursorPosition = (e) => {
      if (!backgroundRef.current) return;
      
      const now = Date.now();
      if (now - lastUpdateTime < 16) return; // Throttle to ~60fps
      
      const rect = backgroundRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Clamp values between 0 and 1
      const clampedX = Math.max(0, Math.min(1, x));
      const clampedY = Math.max(0, Math.min(1, y));
      
      lastUpdateTime = now;
      setCursorPos({ x: clampedX, y: clampedY });
    };

    const updateElementPositions = () => {
      const attraction = 0.4; // Increased from 15% to 40% for more noticeable movement
      
      if (circle1Ref.current) {
        const deltaX = (cursorPos.x - 0.25) * attraction * 150;
        const deltaY = (cursorPos.y - 0.25) * attraction * 150;
        circle1Ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        circle1Ref.current.style.willChange = 'transform';
      }
      
      if (circle2Ref.current) {
        const deltaX = (cursorPos.x - 0.75) * attraction * 150;
        const deltaY = (cursorPos.y - 0.75) * attraction * 150;
        circle2Ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        circle2Ref.current.style.willChange = 'transform';
      }
      
      if (circle3Ref.current) {
        const deltaX = (cursorPos.x - 0.5) * attraction * 150;
        const deltaY = (cursorPos.y - 0.5) * attraction * 150;
        circle3Ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        circle3Ref.current.style.willChange = 'transform';
      }
    };

    if (headerRef.current) {
      headerRef.current.addEventListener('mousemove', updateCursorPosition);
    }

    animationFrameId = requestAnimationFrame(updateElementPositions);

    return () => {
      if (headerRef.current) {
        headerRef.current.removeEventListener('mousemove', updateCursorPosition);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [cursorPos]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formspree.io/f/mpwlngqv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Smooth scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-medium to-brand-dark overflow-x-hidden">
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-transform duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="YOR Software" 
                className="h-12 w-auto" 
              />
            </div>
            
            {/* CTA Button and Menu - Right Side */}
            <div className="flex items-center gap-4">
              {/* CTA Button - Desktop */}
              <div className="hidden md:block">
                <button 
                  onClick={scrollToContact}
                  className="bg-gradient-to-r from-cta-primary to-cta-hover text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-cta-primary/25 transition-all duration-300"
                >
                  Get Started
                </button>
              </div>

              {/* Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white transition-colors"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>

      </nav>

      {/* Side Menu - Independent of navbar */}
      <div ref={menuRef} className={`fixed top-0 right-0 h-screen w-full md:w-[480px] bg-brand-dark border-l border-brand-purple/20 transform transition-transform duration-500 ease-in-out z-[9999] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{backgroundColor: '#0f0f23', opacity: 1}}>
        {/* Close Button */}
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 text-white hover:text-brand-purple transition-colors z-50"
        >
          <X size={32} />
        </button>
        
        <div className="p-12 pt-28">
          {/* Menu Sections */}
          <div className="space-y-8">
            <a href="#services" className="block text-2xl text-white hover:text-brand-purple transition-colors" onClick={() => setIsMenuOpen(false)}>
              Services
            </a>
            <a href="#portfolio" className="block text-2xl text-white hover:text-brand-purple transition-colors" onClick={() => setIsMenuOpen(false)}>
              Portfolio
            </a>
            <a href="#about" className="block text-2xl text-white hover:text-brand-purple transition-colors" onClick={() => setIsMenuOpen(false)}>
              About
            </a>
            <a href="#contact" className="block text-2xl text-white hover:text-brand-purple transition-colors" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
          </div>

          {/* CTA Button - Mobile Only */}
          <div className="mt-16 md:hidden">
            <button 
              onClick={scrollToContact}
              className="w-full bg-gradient-to-r from-cta-primary to-cta-hover text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-cta-primary/25 transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-16 space-y-5">
            <h3 className="text-xl font-semibold text-white mb-6">Get in Touch</h3>
            <div className="flex items-center space-x-4 text-neutral-medium">
              <Mail className="w-6 h-6 flex-shrink-0" />
              <span>hello@designco.com</span>
            </div>
            <div className="flex items-center space-x-4 text-neutral-medium">
              <Phone className="w-6 h-6 flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>

          {/* Socials */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-white mb-6">Follow Us</h3>
            <div className="flex space-x-5">
              <Twitter className="text-neutral-medium hover:text-brand-purple cursor-pointer transition-colors" size={24} />
              <Instagram className="text-neutral-medium hover:text-brand-purple cursor-pointer transition-colors" size={24} />
              <Linkedin className="text-neutral-medium hover:text-brand-purple cursor-pointer transition-colors" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Header - Fixed GSAP Animation */}
      <header ref={headerRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div ref={backgroundRef} className="absolute inset-0">
          
          <div 
            ref={circle1Ref}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-purple/30 rounded-full blur-3xl animate-pulse transition-transform duration-500 ease-out"
          ></div>
          <div 
            ref={circle2Ref}
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-pink/25 rounded-full blur-3xl animate-pulse transition-transform duration-500 ease-out" 
            style={{animationDelay: '1s'}}
          ></div>
          <div 
            ref={circle3Ref}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cta-primary/20 rounded-full blur-3xl animate-pulse transition-transform duration-500 ease-out" 
            style={{animationDelay: '2s'}}
          ></div>
        </div>

        <div className="relative text-center z-10 max-w-5xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
            <span 
              ref={el => staticTextRefs.current[0] = el}
              className="block opacity-0"
              style={{ transform: 'translateY(30px)' }}
            >
              We
            </span>
            <span 
              ref={el => staticTextRefs.current[1] = el}
              className="block opacity-0"
              style={{ transform: 'translateY(30px)' }}
            >
              Create
            </span>
            <span 
              ref={animatedWordRef}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-cta-primary min-h-[1.2em]"
            >
              Dreams
            </span>
          </h1>
          
          {/* Subtitle */}
          <div className="overflow-hidden">
            <p ref={subtitleRef} className="text-xl sm:text-2xl md:text-3xl text-neutral-medium font-medium mb-8 max-w-3xl mx-auto leading-relaxed">
              Beautiful websites that work
            </p>
          </div>
          
          {/* Description */}
          <div className="overflow-hidden">
            <p ref={descriptionRef} className="text-lg sm:text-xl text-neutral-medium/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Web design, online stores, and digital tools that help your business grow.
            </p>
          </div>
          
          {/* Call to Action */}
          <div ref={ctaButtonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToContact}
              className="bg-gradient-to-r from-cta-primary to-cta-hover text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-cta-primary/25 hover:scale-105 transition-all duration-300 group"
            >
              Start Your Project
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="border-2 border-brand-purple text-brand-purple px-10 py-4 rounded-full text-lg font-semibold hover:bg-brand-purple hover:text-white transition-all duration-300">
              View Our Work
            </button>
          </div>
        </div>
      </header>

      {/* Rest of your sections remain the same... */}
      {/* Section 1 - What We Do */}
      <section className="py-20 px-6 bg-brand-medium/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-cta-primary">Value</span>
            </h1>
            <p className="text-xl text-neutral-medium max-w-3xl mx-auto mb-12">
              We transform businesses through innovative digital solutions that drive growth, 
              enhance user experiences, and deliver measurable results that matter to your bottom line.
            </p>
          </div>

          {/* Value Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-brand-light/50 backdrop-blur-sm border border-brand-purple/20 rounded-2xl p-8 hover:border-brand-purple/40 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-pink rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-neutral-medium">Optimized performance that keeps users engaged and search engines happy.</p>
            </div>

            <div className="bg-brand-light/50 backdrop-blur-sm border border-brand-purple/20 rounded-2xl p-8 hover:border-brand-purple/40 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cta-primary to-cta-hover rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Palette className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Stunning Design</h3>
              <p className="text-neutral-medium">Beautiful interfaces that convert visitors into loyal customers.</p>
            </div>

            <div className="bg-brand-light/50 backdrop-blur-sm border border-brand-purple/20 rounded-2xl p-8 hover:border-brand-purple/40 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-brand-purple rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Future-Proof</h3>
              <p className="text-neutral-medium">Built with cutting-edge technology that scales with your business.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToContact}
                className="bg-gradient-to-r from-cta-primary to-cta-hover text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:shadow-cta-primary/25 transition-all duration-300 flex items-center justify-center group"
              >
                Start Your Project
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              
              <button className="border-2 border-brand-purple text-brand-purple px-8 py-4 rounded-full font-semibold hover:bg-brand-purple hover:text-white transition-all duration-300">
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Types of Services */}
      <section id="services" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Services
            </h2>
            <p className="text-xl text-neutral-medium max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Web Design */}
            <div className="bg-gradient-to-br from-brand-light/50 to-brand-medium/30 backdrop-blur-sm border border-brand-purple/20 rounded-3xl p-8 hover:border-brand-purple/40 hover:scale-105 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-purple to-brand-pink rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <Palette className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Web Design</h3>
              <p className="text-neutral-medium mb-6 leading-relaxed">
                Custom websites that captivate your audience and drive conversions. From landing pages to complex web applications.
              </p>
              <ul className="text-neutral-medium space-y-2 text-sm">
                <li>• Responsive Design</li>
                <li>• UI/UX Optimization</li>
                <li>• Brand Integration</li>
                <li>• Performance Focused</li>
              </ul>
            </div>

            {/* E-commerce */}
            <div className="bg-gradient-to-br from-brand-light/50 to-brand-medium/30 backdrop-blur-sm border border-brand-purple/20 rounded-3xl p-8 hover:border-brand-purple/40 hover:scale-105 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-br from-cta-primary to-cta-hover rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <ShoppingCart className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">E-commerce</h3>
              <p className="text-neutral-medium mb-6 leading-relaxed">
                Powerful online stores that maximize sales and provide seamless shopping experiences for your customers.
              </p>
              <ul className="text-neutral-medium space-y-2 text-sm">
                <li>• Custom Store Development</li>
                <li>• Payment Integration</li>
                <li>• Inventory Management</li>
                <li>• Marketing Tools</li>
              </ul>
            </div>

            {/* AI Solutions */}
            <div className="bg-gradient-to-br from-brand-light/50 to-brand-medium/30 backdrop-blur-sm border border-brand-purple/20 rounded-3xl p-8 hover:border-brand-purple/40 hover:scale-105 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <Brain className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Solutions</h3>
              <p className="text-neutral-medium mb-6 leading-relaxed">
                Cutting-edge AI integration to automate processes, enhance user experience, and drive intelligent insights.
              </p>
              <ul className="text-neutral-medium space-y-2 text-sm">
                <li>• Chatbot Development</li>
                <li>• Process Automation</li>
                <li>• Data Analytics</li>
                <li>• Custom AI Models</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Ready to Create? Contact Form */}
      <section id="contact" className="py-20 px-6 bg-brand-medium/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-cta-primary">Create?</span>
            </h1>
            <p className="text-xl text-neutral-medium max-w-2xl mx-auto">
              Let's bring your vision to life. Tell us about your project and we'll get back to you within 24 hours.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-brand-light/50 backdrop-blur-sm border border-brand-purple/20 rounded-3xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-brand-dark/50 border border-brand-purple/30 text-white placeholder-neutral-medium focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-brand-dark/50 border border-brand-purple/30 text-white placeholder-neutral-medium focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white font-semibold mb-2">Project Details</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-3 rounded-xl bg-brand-dark/50 border border-brand-purple/30 text-white placeholder-neutral-medium focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all resize-none"
                  placeholder="Tell us about your project, goals, and timeline..."
                  required
                ></textarea>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-xl mb-6">
                  <p className="text-green-400 font-semibold">✓ Message sent successfully! We'll get back to you within 24 hours.</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="text-center p-4 bg-red-500/20 border border-red-500/30 rounded-xl mb-6">
                  <p className="text-red-400 font-semibold">✗ Sorry, there was an error sending your message. Please try again.</p>
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-cta-primary to-cta-hover text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cta-primary/25 hover:scale-105 transition-all duration-300 group ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && (
                    <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-brand-dark border-t border-brand-purple/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Newsletter */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-neutral-medium mb-6">
                Get the latest web design trends, tips, and exclusive offers delivered to your inbox.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-brand-medium/50 border border-brand-purple/30 text-white placeholder-neutral-medium focus:outline-none focus:border-brand-purple"
                />
                <button className="bg-gradient-to-r from-cta-primary to-cta-hover text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cta-primary/25 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Sections */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Web Design</a></li>
                <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">E-commerce</a></li>
                <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">AI Solutions</a></li>
                <li><a href="#" className="text-neutral-medium hover:text-white transition-colors">Consulting</a></li>
              </ul>
            </div>

            {/* Contact & Socials */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-neutral-medium">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>hello@designco.com</span>
                </div>
                <div className="flex items-center space-x-3 text-neutral-medium">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Twitter className="text-neutral-medium hover:text-brand-purple cursor-pointer transition-colors" size={20} />
                <Instagram className="text-neutral-medium hover:text-brand-purple cursor-pointer transition-colors" size={20} />
                <Linkedin className="text-neutral-medium hover:text-brand-purple cursor-pointer transition-colors" size={20} />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-brand-purple/20">
            <div className="mb-4 md:mb-0">
              <img 
                src="/logo.svg" 
                alt="YOR Software" 
                className="h-12 w-auto" 
              />
            </div>
            <div className="text-neutral-medium text-center md:text-right">
              © 2025 YOR Software. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;