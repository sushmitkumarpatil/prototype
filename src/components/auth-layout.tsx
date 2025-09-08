'use client';

import Link from '@/components/ui/link';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export default function AuthLayout({
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLinkText,
}: AuthLayoutProps) {
  const particlesInit = async (main: any) => {
    await loadSlim(main);
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="flex items-center justify-center py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mx-auto w-[400px] max-w-full p-8 shadow-2xl border-primary/20 bg-gradient-to-br from-card via-primary/5 to-accent/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {children}
              <div className="mt-8 text-center text-sm">
                {footerText}{' '}
                <Link href={footerLink} className="font-semibold text-primary hover:text-primary/80 underline underline-offset-4 hover:underline-offset-2 transition-all duration-300">
                  {footerLinkText}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="hidden lg:block relative bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 overflow-hidden">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: 'transparent',
              },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: 'repulse',
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: '#3B82F6', // Primary blue
              },
              links: {
                color: '#8B5CF6', // Accent purple
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              collisions: {
                enable: false,
              },
              move: {
                direction: 'none',
                enable: true,
                outModes: {
                  default: 'bounce',
                },
                random: true,
                speed: 1.5,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.4,
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: { min: 1, max: 4 },
              },
            },
            detectRetina: true,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-black bg-gradient-to-r from-primary/20 to-accent/20 bg-clip-text text-transparent mb-4">
              Ion-Alumni
            </h1>
            <p className="text-lg text-muted-foreground/60 max-w-md">
              Connect. Grow. Succeed. Join our exclusive alumni network and unlock endless opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}