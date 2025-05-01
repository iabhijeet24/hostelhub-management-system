
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const { user, updateUserProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [generalForm, setGeneralForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    language: "english",
    timezone: "ist",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    emailComplaints: true,
    emailVisitors: true,
    emailAnnouncements: true,
    emailRoomChanges: true,
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showContactInfo: true,
    allowMessaging: true,
    showRoomInfo: false,
  });
  
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largerText: false,
    reduceMotion: false,
  });
  
  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUserProfile({
        name: generalForm.name,
        email: generalForm.email,
      });
      
      toast.success("Profile updated successfully");
      setIsLoading(false);
    }, 1000);
  };
  
  const handleToggleChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };
  
  const handlePrivacyToggle = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };
  
  const handleAccessibilityToggle = (setting, value) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
    
    if (setting === 'highContrast' && value) {
      document.documentElement.classList.add('high-contrast');
    } else if (setting === 'highContrast' && !value) {
      document.documentElement.classList.remove('high-contrast');
    }
    
    if (setting === 'largerText' && value) {
      document.documentElement.classList.add('larger-text');
    } else if (setting === 'largerText' && !value) {
      document.documentElement.classList.remove('larger-text');
    }
    
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Update your basic profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGeneralSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={generalForm.name}
                    onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={generalForm.email}
                    onChange={(e) => setGeneralForm({...generalForm, email: e.target.value})}
                    placeholder="Your email address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={generalForm.language}
                      onValueChange={(value) => setGeneralForm({...generalForm, language: value})}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="telugu">Telugu</SelectItem>
                        <SelectItem value="marathi">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={generalForm.timezone}
                      onValueChange={(value) => setGeneralForm({...generalForm, timezone: value})}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ist">Indian Standard Time (IST)</SelectItem>
                        <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-medium">General Notifications</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleToggleChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleToggleChange('pushNotifications', checked)}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-medium">Email Alerts</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailComplaints">Complaint Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get emails about your complaint status
                    </p>
                  </div>
                  <Switch
                    id="emailComplaints"
                    checked={notificationSettings.emailComplaints}
                    onCheckedChange={(checked) => handleToggleChange('emailComplaints', checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailVisitors">Visitor Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerts when a visitor checks in for you
                    </p>
                  </div>
                  <Switch
                    id="emailVisitors"
                    checked={notificationSettings.emailVisitors}
                    onCheckedChange={(checked) => handleToggleChange('emailVisitors', checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailAnnouncements">Announcements</Label>
                    <p className="text-sm text-muted-foreground">
                      Get important announcements via email
                    </p>
                  </div>
                  <Switch
                    id="emailAnnouncements"
                    checked={notificationSettings.emailAnnouncements}
                    onCheckedChange={(checked) => handleToggleChange('emailAnnouncements', checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailRoomChanges">Room Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notifications about room allocation changes
                    </p>
                  </div>
                  <Switch
                    id="emailRoomChanges"
                    checked={notificationSettings.emailRoomChanges}
                    onCheckedChange={(checked) => handleToggleChange('emailRoomChanges', checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Save Notification Preferences
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>
              Control who can see your information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showContactInfo">Show Contact Information</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow other residents to see your contact details
                  </p>
                </div>
                <Switch
                  id="showContactInfo"
                  checked={privacySettings.showContactInfo}
                  onCheckedChange={(checked) => handlePrivacyToggle('showContactInfo', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowMessaging">Allow Direct Messaging</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable other residents to send you messages
                  </p>
                </div>
                <Switch
                  id="allowMessaging"
                  checked={privacySettings.allowMessaging}
                  onCheckedChange={(checked) => handlePrivacyToggle('allowMessaging', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showRoomInfo">Share Room Details</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your room number in the resident directory
                  </p>
                </div>
                <Switch
                  id="showRoomInfo"
                  checked={privacySettings.showRoomInfo}
                  onCheckedChange={(checked) => handlePrivacyToggle('showRoomInfo', checked)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Update Privacy Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
            <CardDescription>
              Customize your experience to suit your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="highContrast">High Contrast Mode</Label>
                    <Badge variant="outline" className="text-xs">Beta</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Improve visibility with higher contrast colors
                  </p>
                </div>
                <Switch
                  id="highContrast"
                  checked={accessibilitySettings.highContrast}
                  onCheckedChange={(checked) => handleAccessibilityToggle('highContrast', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="largerText">Larger Text</Label>
                    <Badge variant="outline" className="text-xs">Beta</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Increase text size throughout the application
                  </p>
                </div>
                <Switch
                  id="largerText"
                  checked={accessibilitySettings.largerText}
                  onCheckedChange={(checked) => handleAccessibilityToggle('largerText', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduceMotion">Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations throughout the application
                  </p>
                </div>
                <Switch
                  id="reduceMotion"
                  checked={accessibilitySettings.reduceMotion}
                  onCheckedChange={(checked) => handleAccessibilityToggle('reduceMotion', checked)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Save Accessibility Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
