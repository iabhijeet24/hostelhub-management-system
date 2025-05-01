
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Plus, Search, Calendar, Megaphone } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for notices
const categories = ["General", "Academic", "Event", "Mess", "Maintenance", "Emergency"];

const mockNotices = Array.from({ length: 15 }, (_, i) => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 14)); // 0-14 days ago
  
  // Generate expiry date (0-30 days from created date)
  const expiryDate = new Date(createdDate);
  expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 30) + 1);
  
  // Generate random title based on category
  let title = "";
  switch (category) {
    case "General": 
      title = ["Hostel Guidelines Update", "New Facilities Announcement", "Weekend Schedule", "Visitor Policy Update"][Math.floor(Math.random() * 4)];
      break;
    case "Academic": 
      title = ["Exam Schedule", "Library Timing Change", "Study Hall Notice", "Project Submission Reminder"][Math.floor(Math.random() * 4)];
      break;
    case "Event": 
      title = ["Cultural Night", "Sports Tournament", "Alumni Meet", "Tech Fest Announcement"][Math.floor(Math.random() * 4)];
      break;
    case "Mess": 
      title = ["Menu Change", "Mess Timing Update", "Special Dinner", "Feedback Collection"][Math.floor(Math.random() * 4)];
      break;
    case "Maintenance": 
      title = ["Water Supply Interruption", "Wi-Fi Maintenance", "Room Inspection", "Cleaning Schedule"][Math.floor(Math.random() * 4)];
      break;
    case "Emergency": 
      title = ["Fire Drill", "Weather Alert", "Security Advisory", "Health Advisory"][Math.floor(Math.random() * 4)];
      break;
    default: 
      title = `Notice ${i+1}`;
  }
  
  return {
    id: `N-${(1000 + i).toString()}`,
    title: title,
    description: `This is an important notice regarding ${title.toLowerCase()}. Please read carefully and follow all instructions.`,
    category: category,
    createdBy: ["Admin", "Warden", "Mess Committee", "Student Council"][Math.floor(Math.random() * 4)],
    createdAt: createdDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    important: Math.random() > 0.7,
    readCount: Math.floor(Math.random() * 400) + 50,
    attachments: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
  };
});

const NoticeBoard = () => {
  const { role } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  
  // Filter notices based on search and filters
  const filteredNotices = mockNotices.filter(notice => {
    const matchesSearch = 
      searchQuery === "" || 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || notice.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort notices
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    if (sortOrder === "latest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  // Calculate if notice is new (less than 3 days old)
  const isNew = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };
  
  // Check if notice is expired
  const isExpired = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const now = new Date();
    return expiryDate < now;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notice Board</h1>
        <p className="text-muted-foreground">
          View all important announcements and updates
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notices..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={setCategoryFilter} defaultValue={categoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-1 border rounded-md">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none rounded-l-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none rounded-r-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
            </Button>
          </div>
          
          {role === "admin" && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-hostel-purple hover:bg-hostel-purple-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Notice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Post New Notice</DialogTitle>
                  <DialogDescription>
                    Create a new announcement to publish on the notice board
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Notice Title</Label>
                    <Input id="title" placeholder="Enter a clear and specific title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" type="date" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Notice Content</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Enter the detailed content of the notice" 
                      rows={5}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="attachments">Attachments (Optional)</Label>
                      <Input id="attachments" type="file" multiple />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="important" className="flex items-center gap-2">
                        <Input id="important" type="checkbox" className="w-4 h-4" />
                        <span>Mark as Important</span>
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-hostel-purple hover:bg-hostel-purple-dark" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Post Notice
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotices.map((notice) => (
            <Card key={notice.id} className={`${
              notice.important ? "ring-2 ring-red-500 ring-offset-2" : ""
            } transition-all hover:shadow-md`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {notice.title}
                      {isNew(notice.createdAt) && (
                        <Badge className="bg-blue-500">New</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{notice.category}</CardDescription>
                  </div>
                  {notice.important && (
                    <Badge variant="destructive">Important</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{notice.description}</p>
                
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Posted: {formatDate(notice.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    <span>{notice.readCount} views</span>
                  </div>
                </div>
                
                {notice.attachments > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    <span>{notice.attachments} attachment{notice.attachments > 1 ? "s" : ""}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex items-center text-xs">
                  <span className={`${isExpired(notice.expiryDate) ? "text-red-500" : "text-muted-foreground"}`}>
                    Expires: {formatDate(notice.expiryDate)}
                  </span>
                </div>
                <Button variant="outline" size="sm">Read More</Button>
              </CardFooter>
            </Card>
          ))}

          {sortedNotices.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center p-8">
              <Bell className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notices found</h3>
              <p className="text-sm text-muted-foreground">
                There are no notices matching your search criteria
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-12 bg-muted/50 p-3 text-xs font-medium">
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Posted By</div>
            <div className="col-span-2">Posted Date</div>
            <div className="col-span-2">Expires</div>
          </div>
          
          <div className="divide-y">
            {sortedNotices.map((notice) => (
              <div key={notice.id} className={`grid grid-cols-12 p-3 hover:bg-muted/50 cursor-pointer`}>
                <div className="col-span-4 flex items-center space-x-2">
                  <div>
                    {notice.important ? (
                      <Megaphone className="h-4 w-4 text-red-500" />
                    ) : (
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm flex items-center">
                      {notice.title}
                      {isNew(notice.createdAt) && (
                        <Badge className="ml-2 text-xs bg-blue-500">New</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">
                      {notice.description.substring(0, 60)}...
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <Badge variant="outline">{notice.category}</Badge>
                </div>
                <div className="col-span-2 flex items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-muted">
                        {notice.createdBy.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{notice.createdBy}</span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center text-xs text-muted-foreground">
                  {formatDate(notice.createdAt)}
                </div>
                <div className="col-span-2 flex items-center text-xs">
                  <span className={isExpired(notice.expiryDate) ? "text-red-500" : "text-muted-foreground"}>
                    {formatDate(notice.expiryDate)}
                  </span>
                </div>
              </div>
            ))}
            
            {sortedNotices.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No notices found matching your search criteria
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {sortedNotices.length} of {mockNotices.length} notices
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
