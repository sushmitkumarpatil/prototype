'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/components/auth-layout';
import { registerUser } from '@/lib/api/auth';

const formSchema = z.object({
  userType: z.enum(['student', 'alumnus'], {
    required_error: 'You need to select a user type.',
  }),
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
  mobileNumber: z
    .string()
    .min(10, { message: 'Please enter a valid mobile number.' }),
  course: z.string().min(2, { message: 'Course details are required.' }),
  batch: z.string().min(4, { message: 'Please enter a valid year.' }),
  usn: z.string().min(5, { message: 'USN is required for verification.' }),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      mobileNumber: '',
      course: '',
      batch: '',
      usn: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await registerUser(values);
      if (response.success) {
        toast({
          title: 'Registration Successful!',
          description: 'Your registration is successful and pending approval by the admin.',
          variant: 'warning',
        });
        // Clear form fields
        form.reset();
        // Redirect to login page after successful registration
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast({
          title: 'Registration Failed',
          description: response.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Registration Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  }

  return (
    <AuthLayout
      title="Create an Account"
      description="Enter your information to get started."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-card-foreground font-medium">You are a...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-6"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="student" className="text-primary border-primary/30 focus:border-primary focus:ring-primary/20" />
                      </FormControl>
                      <FormLabel className="font-normal text-card-foreground cursor-pointer">Student</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="alumnus" className="text-primary border-primary/30 focus:border-primary focus:ring-primary/20" />
                      </FormControl>
                      <FormLabel className="font-normal text-card-foreground cursor-pointer">Alumnus</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-card-foreground font-medium">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-card-foreground font-medium">Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-card-foreground font-medium">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-card-foreground font-medium">Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground font-medium">Course</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CompSci" {...field} className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="batch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-card-foreground font-medium">Batch</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2025" {...field} className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="usn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-card-foreground font-medium">University Seat Number (USN)</FormLabel>
                <FormControl>
                  <Input placeholder="Required for verification" {...field} className="border-primary/20 focus:border-primary hover:border-primary/40 transition-colors duration-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
          >
            Create Account
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}