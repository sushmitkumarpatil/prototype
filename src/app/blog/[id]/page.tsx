'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Calendar, User, Building, Tag, Share2, BookOpen } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/animated-section";
import { motion } from "framer-motion";

interface BlogPost {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  tags?: string;
  industry?: string;
  view_count: number;
  created_at: string;
  published_at?: string;
  author: {
    id: number;
    full_name: string;
    profile?: {
      company?: string;
      job_title?: string;
      linkedin_url?: string;
    };
  };
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchBlogPost(params.id as string);
    }
  }, [params.id]);

  const fetchBlogPost = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/blog/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      } else if (response.status === 404) {
        setError('Blog post not found');
      } else {
        setError('Failed to load blog post');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTags = (tags?: string) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.content.substring(0, 100),
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PublicHeader />
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="aspect-video bg-muted rounded" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col min-h-screen">
        <PublicHeader />
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-12">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold mb-2">Blog Post Not Found</h3>
              <p className="text-muted-foreground mb-4">
                {error || 'The blog post you are looking for does not exist or has been removed.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/blog">Back to Blog</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">
        {/* Back Navigation */}
        <AnimatedSection className="w-full py-4 bg-muted/50">
          <div className="container px-4 md:px-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </AnimatedSection>

        {/* Blog Content */}
        <AnimatedSection className="w-full py-8 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  {blog.industry && (
                    <Badge variant="secondary">
                      {blog.industry}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {blog.view_count} views
                  </div>
                </div>
                
                <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                  {blog.title}
                </h1>
                
                {blog.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6">
                    {blog.excerpt}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{blog.author.full_name}</span>
                      {blog.author.profile?.company && (
                        <>
                          <span>•</span>
                          <Building className="h-4 w-4" />
                          <span>{blog.author.profile.company}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Published {formatDate(blog.published_at || blog.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Reading time: {Math.ceil(blog.content.split(' ').length / 200)} min</span>
                  </div>
                </div>
              </motion.div>

              {/* Featured Image */}
              {blog.featured_image_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-8"
                >
                  <img
                    src={blog.featured_image_url}
                    alt={blog.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="prose prose-lg max-w-none mb-8"
              >
                <div 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: blog.content.replace(/\n/g, '<br>') 
                  }}
                />
              </motion.div>

              {/* Tags */}
              {blog.tags && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-8"
                >
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {formatTags(blog.tags).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Author Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      About the Author
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{blog.author.full_name}</h4>
                        {blog.author.profile?.job_title && (
                          <p className="text-muted-foreground mb-2">
                            {blog.author.profile.job_title}
                          </p>
                        )}
                        {blog.author.profile?.company && (
                          <p className="text-muted-foreground mb-3">
                            {blog.author.profile.company}
                          </p>
                        )}
                        {blog.author.profile?.linkedin_url && (
                          <Button asChild variant="outline" size="sm">
                            <a 
                              href={blog.author.profile.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View LinkedIn Profile
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="text-center py-8 border-t"
              >
                <h3 className="text-xl font-semibold mb-4">Enjoyed this article?</h3>
                <p className="text-muted-foreground mb-6">
                  Share your thoughts and connect with the author. Have insights to share? 
                  Consider writing your own blog post for the community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-accent hover:bg-accent/90">
                    <Link href="/signup">Join IonAlumni</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/blog">Explore More Blogs</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </main>
      <PublicFooter />
    </div>
  );
}
