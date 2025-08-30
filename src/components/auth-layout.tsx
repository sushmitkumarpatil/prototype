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
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mx-auto w-[400px] max-w-full p-6 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold tracking-tight">
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {children}
              <div className="mt-6 text-center text-sm">
                {footerText}{' '}
                <Link href={footerLink} className="font-semibold underline">
                  {footerLinkText}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="hidden lg:block relative bg-muted overflow-hidden">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: '#f1f5f9', // A light slate color
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
                value: '#64748b', // A darker slate color
              },
              links: {
                color: '#94a3b8', // A lighter slate color
                distance: 150,
                enable: true,
                opacity: 0.2,
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
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* You can add a logo or an illustration here */}
          <h1 className="text-5xl font-black text-slate-700/20">
            Ion-Alumni
          </h1>
        </div>
      </div>
    </div>
  );
}