'use client';
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, Briefcase, Globe, Heart, Target } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/animated-section";
import { motion } from "framer-motion";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Alumni Members", value: "10,000+" },
    { icon: GraduationCap, label: "Graduation Years", value: "25+" },
    { icon: Briefcase, label: "Industries", value: "50+" },
    { icon: Globe, label: "Countries", value: "30+" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "Building lasting connections that transcend graduation and create lifelong bonds."
    },
    {
      icon: Target,
      title: "Professional Growth",
      description: "Supporting career development through mentorship, networking, and opportunities."
    },
    {
      icon: GraduationCap,
      title: "Knowledge Sharing",
      description: "Fostering learning and innovation through collaborative knowledge exchange."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Creating positive change in communities worldwide through our collective expertise."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <AnimatedSection className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                About IonAlumni
              </h1>
              <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                Connecting generations of graduates, fostering professional growth, and building a stronger future together.
              </p>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Mission Section */}
        <AnimatedSection className="w-full py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="font-headline text-3xl font-bold text-primary">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  IonAlumni is dedicated to creating a vibrant, interconnected community where graduates can maintain 
                  meaningful relationships, share knowledge, and support each other's professional and personal growth. 
                  We believe in the power of alumni networks to drive innovation, mentorship, and collective success.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Through our platform, we facilitate connections across industries, generations, and geographical 
                  boundaries, ensuring that every member has access to the resources and relationships they need to thrive.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="font-headline text-3xl font-bold text-primary">Our Vision</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To become the most trusted and comprehensive alumni network platform, empowering graduates to 
                  create lasting impact in their communities and industries. We envision a world where every 
                  alumnus has access to a supportive network that accelerates their success.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  By leveraging technology and human connection, we're building bridges between past, present, 
                  and future generations of graduates, creating a legacy of collaboration and achievement.
                </p>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection className="w-full py-12 bg-background">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-headline text-3xl font-bold text-primary mb-4">Our Community in Numbers</h2>
              <p className="text-muted-foreground text-lg">The impact of our growing alumni network</p>
            </motion.div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        <stat.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Values Section */}
        <AnimatedSection className="w-full py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center mb-12"
            >
              <h2 className="font-headline text-3xl font-bold text-primary mb-4">Our Core Values</h2>
              <p className="text-muted-foreground text-lg">The principles that guide everything we do</p>
            </motion.div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <value.icon className="h-10 w-10 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-sm leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="w-full py-12 bg-background">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center space-y-6"
            >
              <h2 className="font-headline text-3xl font-bold text-primary">Join Our Community</h2>
              <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                Ready to connect with fellow alumni and be part of something bigger? Join IonAlumni today and 
                start building meaningful relationships that last a lifetime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog">Explore Our Blog</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>
      <PublicFooter />
    </div>
  );
}
