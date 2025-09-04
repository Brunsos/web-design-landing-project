# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite hot reload
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a React + Vite single-page application for a design agency website with the following structure:

### Tech Stack
- **Frontend**: React 19 with JSX
- **Build Tool**: Vite 7 with hot module replacement
- **Styling**: Tailwind CSS with custom theme configuration
- **Animations**: GSAP with ScrollTrigger, TextPlugin for advanced animations
- **Icons**: Lucide React for consistent iconography
- **Linting**: ESLint 9 with React hooks and refresh plugins

### Key Components
- Single-page application in `src/App.jsx` containing all sections
- Custom Tailwind theme with brand colors defined in `tailwind.config.js`
- GSAP animations for hero text cycling and scroll-triggered effects
- Mobile-responsive navigation with slide-out menu
- Contact form with controlled React state

### Styling System
- Custom color palette: `brand-dark`, `brand-medium`, `brand-light`, `brand-purple`, `cta-primary`, `neutral-*`
- Gradient backgrounds and glassmorphism effects throughout
- Custom animations including floating keyframes and GSAP transitions
- Responsive design with mobile-first approach

### Animation Patterns
- GSAP timeline animations for text reveals
- Word cycling animation in hero section using TextPlugin
- Scroll-triggered animations (ScrollTrigger registered)
- CSS animations for background elements and hover states

### Form Handling
- Controlled components with React useState
- Basic form validation (required fields)
- Currently logs to console (no backend integration)

## File Structure
- `src/App.jsx` - Main application component with all sections
- `src/main.jsx` - React root mounting
- `src/index.css` - Tailwind imports
- `tailwind.config.js` - Custom theme with brand colors and animations
- `vite.config.js` - Vite configuration with React plugin
- `eslint.config.js` - ESLint configuration for React best practices
