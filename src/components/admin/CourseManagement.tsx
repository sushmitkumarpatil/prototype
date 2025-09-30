'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Users,
  RefreshCw,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse
} from '@/lib/api/admin';

interface Course {
  id: number;
  course_name: string;
  created_at: string;
  student_count: number;
}

export function CourseManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourseName, setNewCourseName] = useState('');
  const [editCourseName, setEditCourseName] = useState('');
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses();
      if (response.success) {
        setCourses(response.data.courses);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourseName.trim()) {
      toast({
        title: 'Error',
        description: 'Course name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, add: true }));
      const response = await addCourse(newCourseName.trim());
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Course added successfully',
        });
        
        // Add the new course to the list
        setCourses(prev => [...prev, {
          ...response.data.course,
          student_count: 0
        }]);
        
        setNewCourseName('');
        setIsAddDialogOpen(false);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add course',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, add: false }));
    }
  };

  const handleEditCourse = async () => {
    if (!editingCourse || !editCourseName.trim()) {
      toast({
        title: 'Error',
        description: 'Course name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [`edit-${editingCourse.id}`]: true }));
      const response = await updateCourse(editingCourse.id, editCourseName.trim());
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Course updated successfully',
        });
        
        // Update the course in the list
        setCourses(prev => prev.map(course => 
          course.id === editingCourse.id 
            ? { ...course, course_name: editCourseName.trim() }
            : course
        ));
        
        setEditingCourse(null);
        setEditCourseName('');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update course',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`edit-${editingCourse.id}`]: false }));
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [`delete-${courseId}`]: true }));
      const response = await deleteCourse(courseId);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Course deleted successfully',
        });
        
        // Remove the course from the list
        setCourses(prev => prev.filter(course => course.id !== courseId));
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete course',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${courseId}`]: false }));
    }
  };

  const startEdit = (course: Course) => {
    setEditingCourse(course);
    setEditCourseName(course.course_name);
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setEditCourseName('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Management</h2>
          <p className="text-muted-foreground">
            Manage courses for your institution
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Enter the name of the new course you want to add.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="e.g., Computer Science and Engineering"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewCourseName('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCourse}
                disabled={actionLoading.add}
              >
                {actionLoading.add && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Add Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((total, course) => total + course.student_count, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Students/Course</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.length > 0 
                ? Math.round(courses.reduce((total, course) => total + course.student_count, 0) / courses.length)
                : 0
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No courses found</p>
                <p className="text-sm text-muted-foreground">Add your first course to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editingCourse?.id === course.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editCourseName}
                          onChange={(e) => setEditCourseName(e.target.value)}
                          className="max-w-md"
                        />
                        <Button
                          size="sm"
                          onClick={handleEditCourse}
                          disabled={actionLoading[`edit-${course.id}`]}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold">{course.course_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created on {new Date(course.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">
                      {course.student_count} students
                    </Badge>
                    
                    {editingCourse?.id !== course.id && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading[`delete-${course.id}`]}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Course</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{course.course_name}"? 
                                This action cannot be undone and will affect {course.student_count} students.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCourse(course.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
