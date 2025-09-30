'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
//
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Building, 
  Briefcase,
  Camera,
  Save,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/api/user';

// Helper function to get the correct image URL
const getImageUrl = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return undefined;
  // If it's already a full URL (external), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // If it's a relative path (upload), prepend the backend URL
  if (imageUrl.startsWith('/uploads/')) {
    return `http://localhost:8000${imageUrl}`;
  }
  return imageUrl;
};

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    current_location: '',
    linkedin_url: '',
    company: '',
    job_title: '',
    privacy_settings: {
      show_email: false,
      show_mobile: false,
      show_linkedin: true,
    },
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserProfile();
      if (response.success) {
        setProfile(response.user);
        setFormData({
          current_location: response.user.profile?.current_location || '',
          linkedin_url: response.user.profile?.linkedin_url || '',
          company: response.user.profile?.company || '',
          job_title: response.user.profile?.job_title || '',
          privacy_settings: response.user.profile?.privacy_settings || {
            show_email: false,
            show_mobile: false,
            show_linkedin: true,
          },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      console.log('Saving profile with data:', formData);
      const response = await updateUserProfile(formData);
      console.log('Profile update response:', response);

      if (response.success) {
        setProfile(response.user);
        setEditing(false);
        await refreshUser();
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
        });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      toast({
        title: 'Update Failed',
        description: err.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      const response = await uploadProfileImage(file);
      if (response.success) {
        await loadProfile();
        await refreshUser();
        toast({
          title: 'Image Updated',
          description: 'Your profile picture has been updated successfully.',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Upload Failed',
        description: err.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading profile..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Failed to load profile"
        onRetry={loadProfile}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Profile</h1>
              <p className="text-muted-foreground">
                Manage your profile information and preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture & Basic Info */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={getImageUrl(profile?.profile?.profile_picture_url)}
                          alt={user?.full_name}
                        />
                        <AvatarFallback className="text-2xl">
                          {user?.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold">{user?.full_name}</h3>
                        <p className="text-muted-foreground">{user?.email}</p>
                        <Badge variant="secondary" className="mt-2">
                          {user?.role}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-image"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('profile-image')?.click()}
                          disabled={saving}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {saving ? 'Uploading...' : 'Change Photo'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Status */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Status</span>
                        <Badge variant={user?.account_status === 'APPROVED' ? 'default' : 'secondary'}>
                          {user?.account_status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Email Verified</span>
                        <Badge variant={user?.email_verified ? 'default' : 'destructive'}>
                          {user?.email_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Member Since</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(user?.created_at || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your professional information and preferences.
                        </CardDescription>
                      </div>
                      <Button
                        variant={editing ? 'outline' : 'default'}
                        onClick={() => setEditing(!editing)}
                        disabled={saving}
                      >
                        {editing ? (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={user?.full_name || ''}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={user?.email || ''}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="usn">USN</Label>
                          <Input
                            id="usn"
                            value={user?.usn || ''}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mobile">Mobile Number</Label>
                          <Input
                            id="mobile"
                            value={user?.mobile_number || ''}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Professional Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Current Location</Label>
                          <Input
                            id="location"
                            value={formData.current_location}
                            onChange={(e) => setFormData(prev => ({ ...prev, current_location: e.target.value }))}
                            disabled={!editing}
                            placeholder="e.g., San Francisco, CA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn URL</Label>
                          <Input
                            id="linkedin"
                            value={formData.linkedin_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                            disabled={!editing}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            disabled={!editing}
                            placeholder="Your current company"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="job_title">Job Title</Label>
                          <Input
                            id="job_title"
                            value={formData.job_title}
                            onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                            disabled={!editing}
                            placeholder="Your current position"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Privacy Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Email</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow other members to see your email address
                            </p>
                          </div>
                          <Switch
                            checked={formData.privacy_settings.show_email}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({
                                ...prev,
                                privacy_settings: { ...prev.privacy_settings, show_email: checked }
                              }))
                            }
                            disabled={!editing}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Mobile Number</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow other members to see your mobile number
                            </p>
                          </div>
                          <Switch
                            checked={formData.privacy_settings.show_mobile}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({
                                ...prev,
                                privacy_settings: { ...prev.privacy_settings, show_mobile: checked }
                              }))
                            }
                            disabled={!editing}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show LinkedIn Profile</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow other members to see your LinkedIn profile
                            </p>
                          </div>
                          <Switch
                            checked={formData.privacy_settings.show_linkedin}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({
                                ...prev,
                                privacy_settings: { ...prev.privacy_settings, show_linkedin: checked }
                              }))
                            }
                            disabled={!editing}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    {editing && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditing(false)}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}