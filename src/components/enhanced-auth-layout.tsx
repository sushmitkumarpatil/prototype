'use client';

import Link from '@/components/ui/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { usePageTransition } from '@/hooks/use-page-transition';

interface EnhancedAuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
  isLoginPage?: boolean;
}

// 3D Icon Components
const ThreeDIcon = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <motion.div
    className={`relative ${className}`}
    whileHover={{ scale: 1.1, rotateY: 10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const FloatingIcon = ({ 
  icon, 
  delay = 0, 
  className = "" 
}: { 
  icon: React.ReactNode; 
  delay?: number; 
  className?: string; 
}) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ y: 20, opacity: 0 }}
    animate={{ 
      y: [0, -10, 0],
      opacity: [0.7, 1, 0.7]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {icon}
  </motion.div>
);

export default function EnhancedAuthLayout({
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLinkText,
  isLoginPage = false,
}: EnhancedAuthLayoutProps) {
  const { isTransitioning, navigateWithTransition } = usePageTransition();

  const handleNavigation = (href: string) => {
    navigateWithTransition(href, 400);
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 relative overflow-hidden">
      {/* Left Panel - Form */}
      <motion.div 
        className="flex items-center justify-center py-12 z-10 relative"
        initial={{ x: isLoginPage ? -100 : 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: isLoginPage ? 100 : -100, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLoginPage ? 'login' : 'signup'}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="mx-auto w-[400px] max-w-full p-6 shadow-2xl bg-white/95 backdrop-blur-sm border-0">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    {title}
                  </CardTitle>
                </motion.div>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <CardDescription className="text-slate-600">{description}</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {children}
                </motion.div>
                <motion.div 
                  className="mt-6 text-center text-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {footerText}{' '}
                  <button
                    onClick={() => handleNavigation(footerLink)}
                    className="font-semibold underline text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    disabled={isTransitioning}
                  >
                    {footerLinkText}
                  </button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Right Panel - 3D Icons and Background */}
      <div className="hidden lg:block relative bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {/* Animated Background Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #94a3b8 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, #94a3b8 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </motion.div>

        {/* 3D Icons */}
        <div className="relative h-full">
          {/* Floating Geometric Shapes */}
          <FloatingIcon delay={0} className="top-20 left-20" icon={
            <ThreeDIcon className="w-16 h-16">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-lg transform rotate-12 hover:rotate-45 transition-transform duration-300" />
            </ThreeDIcon>
          } />

          <FloatingIcon delay={0.5} className="top-32 right-24" icon={
            <ThreeDIcon className="w-12 h-12">
              <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 transform rotate-45 shadow-lg hover:scale-110 transition-transform duration-300" />
            </ThreeDIcon>
          } />

          <FloatingIcon delay={1} className="top-48 left-32" icon={
            <ThreeDIcon className="w-20 h-20">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-t-full shadow-lg hover:scale-110 transition-transform duration-300" />
            </ThreeDIcon>
          } />

          <FloatingIcon delay={1.5} className="top-64 right-16" icon={
            <ThreeDIcon className="w-14 h-14">
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-rose-500 rounded-full shadow-lg hover:scale-110 transition-transform duration-300" />
            </ThreeDIcon>
          } />

          <FloatingIcon delay={2} className="top-80 left-16" icon={
            <ThreeDIcon className="w-18 h-18">
              <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-blue-500 transform rotate-12 shadow-lg hover:scale-110 transition-transform duration-300" />
            </ThreeDIcon>
          } />

          {/* Central Large Icon */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotateY: 0 }}
            animate={{ 
              scale: 1,
              rotateY: [0, 360],
            }}
            transition={{
              scale: { duration: 0.8, delay: 0.3 },
              rotateY: { duration: 20, repeat: Infinity, ease: "linear", delay: 1 }
            }}
          >
            <ThreeDIcon className="w-32 h-32">
              <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500" />
            </ThreeDIcon>
          </motion.div>

          {/* Website Name */}
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <h1 className="text-6xl font-black text-slate-700/30 tracking-wider">
              Ion-Alumni
            </h1>
          </motion.div>
        </div>

        {/* Interactive Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-slate-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
                y: [0, -20, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2 + 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-r from-blue-600 to-purple-600 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-white text-4xl font-bold flex flex-col items-center space-y-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
              />
              <span>Loading...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
