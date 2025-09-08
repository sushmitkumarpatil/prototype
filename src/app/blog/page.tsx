'use client';
import { useState, useEffect } from 'react';
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Calendar, User, Building, Tag } from "lucide-react";
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
    };
  };
}

interface BlogResponse {
  blogs: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
    fetchIndustries();
  }, [currentPage, searchTerm, selectedIndustry]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedIndustry && selectedIndustry !== 'all' && { industry: selectedIndustry }),
      });

      const response = await fetch(`/api/blog?${params}`);
      if (response.ok) {
        const data: BlogResponse = await response.json();
        setBlogs(data.blogs);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await fetch('/api/blog/industries/list');
      if (response.ok) {
        const data = await response.json();
        setIndustries(data);
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value === 'all' ? null : value);
    setCurrentPage(1);
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
                IonAlumni Blog
              </h1>
              <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                Insights, stories, and knowledge from our community of students, faculty, and alumni across various industries.
              </p>

            </motion.div>
          </div>
        </AnimatedSection>

        {/* Search and Filter Section */}
        <AnimatedSection className="w-full py-8 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedIndustry || 'all'} onValueChange={handleIndustryChange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{blogs.length} posts found</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Blog Posts Grid */}
        <AnimatedSection className="w-full py-12 bg-background">
          <div className="container px-4 md:px-6">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-muted" />
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || (selectedIndustry && selectedIndustry !== 'all')
                    ? 'Try adjusting your search criteria'
                    : 'Be the first to share your insights!'
                  }
                </p>

              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((blog, index) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                        <CardHeader className="p-0">
                          {blog.featured_image_url ? (
                            <img
                              src={blog.featured_image_url}
                              alt={blog.title}
                              className="aspect-video w-full object-cover"
                            />
                          ) : (
                            <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <Tag className="h-12 w-12 text-primary/40" />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            {blog.industry && (
                              <Badge variant="secondary" className="text-xs">
                                {blog.industry}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                              <Eye className="h-3 w-3" />
                              {blog.view_count}
                            </div>
                          </div>
                          
                          <CardTitle className="text-lg mb-2 line-clamp-2">
                            {blog.title}
                          </CardTitle>
                          
                          {blog.excerpt && (
                            <CardDescription className="text-sm mb-4 line-clamp-3 flex-1">
                              {blog.excerpt}
                            </CardDescription>
                          )}
                          
                          <div className="mt-auto space-y-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{blog.author.full_name}</span>
                              {blog.author.profile?.company && (
                                <>
                                  <span>•</span>
                                  <Building className="h-3 w-3" />
                                  <span>{blog.author.profile.company}</span>
                                </>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(blog.published_at || blog.created_at)}</span>
                            </div>
                            
                            {blog.tags && (
                              <div className="flex flex-wrap gap-1">
                                {formatTags(blog.tags).slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>

                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="px-3 py-2">...</span>;
                        }
                        return null;
                      })}
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="w-full py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center space-y-6"
            >
              <h2 className="font-headline text-3xl font-bold text-primary">Share Your Knowledge</h2>
              <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                Have insights to share? Join our community and contribute to the collective knowledge 
                of our alumni network. Your experiences could inspire and help others in their journey.
              </p>

            </motion.div>
          </div>
        </AnimatedSection>
      </main>
      <PublicFooter />
    </div>
  );
}
