import React, { useState } from 'react';
import { User, Mail, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Account: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: API call to update user info
      // await api.put('/user/profile', formData);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please log in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </div>
              
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary mb-2">0</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-ecommerce-price mb-2">$0.00</div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning mb-2">0</div>
              <p className="text-sm text-muted-foreground">Wishlist Items</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-medium">Order History</div>
                  <div className="text-sm text-muted-foreground">View your past orders</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-medium">Wishlist</div>
                  <div className="text-sm text-muted-foreground">Manage saved items</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-medium">Addresses</div>
                  <div className="text-sm text-muted-foreground">Shipping & billing addresses</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto py-4">
                <div className="text-left">
                  <div className="font-medium">Payment Methods</div>
                  <div className="text-sm text-muted-foreground">Manage payment options</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;