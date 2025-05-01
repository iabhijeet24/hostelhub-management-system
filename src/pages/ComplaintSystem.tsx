
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, AlertTriangle, Clock, CheckCircle2, Filter, Search, ChevronDown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

// Mock data
const initialComplaints = [
  {
    id: "C001",
    title: "Water Leakage",
    category: "Plumbing",
    description: "Water is leaking from the bathroom ceiling",
    status: "pending",
    location: "Room A-201",
    priority: "medium",
    date: "2025-04-28",
    assignedTo: null,
    updates: [],
  },
  {
    id: "C002",
    title: "Power Outage",
    category: "Electrical",
    description: "No electricity in the entire wing",
    status: "in-progress",
    location: "Block B, 2nd Floor",
    priority: "high",
    date: "2025-04-29",
    assignedTo: "Electrician Team",
    updates: [
      { 
        id: 1, 
        text: "Investigating the issue", 
        time: "2025-04-29T10:30:00", 
        by: "Maintenance Staff" 
      }
    ],
  },
  {
    id: "C003",
    title: "Broken Chair",
    category: "Furniture",
    description: "Chair in the room is broken",
    status: "resolved",
    location: "Room C-105",
    priority: "low",
    date: "2025-04-25",
    assignedTo: "Carpentry Team",
    updates: [
      { 
        id: 1, 
        text: "Assigned to carpentry team", 
        time: "2025-04-25T14:20:00", 
        by: "Admin" 
      },
      { 
        id: 2, 
        text: "Chair has been replaced with a new one", 
        time: "2025-04-27T11:15:00", 
        by: "Carpentry Team" 
      }
    ],
  }
];

// Server-side maintenance staff would be fetched from a database
const maintenanceStaff = [
  { id: "S001", name: "Rajesh Kumar", department: "Plumbing", status: "available" },
  { id: "S002", name: "Sunil Patil", department: "Electrical", status: "busy" },
  { id: "S003", name: "Vikram Singh", department: "Carpentry", status: "available" },
  { id: "S004", name: "Deepak Sharma", department: "IT Support", status: "available" },
];

const ComplaintSystem = () => {
  const { user, role } = useUser();
  const [complaints, setComplaints] = useState(initialComplaints);
  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Form states
  const [complaintForm, setComplaintForm] = useState({
    title: "",
    category: "plumbing",
    description: "",
    location: user?.roomAllocated ? `Room ${user.roomAllocated}` : "",
    priority: "medium",
  });
  
  // Filter complaints whenever filters change
  useEffect(() => {
    let result = complaints;
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(complaint => complaint.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(complaint => complaint.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    
    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(complaint => complaint.priority === priorityFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(complaint => 
        complaint.title.toLowerCase().includes(query) || 
        complaint.description.toLowerCase().includes(query) || 
        complaint.location.toLowerCase().includes(query) ||
        complaint.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredComplaints(result);
  }, [complaints, statusFilter, categoryFilter, priorityFilter, searchQuery]);
  
  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!complaintForm.title || !complaintForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Generate a new complaint ID
    const newId = `C${String(complaints.length + 1).padStart(3, '0')}`;
    
    // Create new complaint object
    const newComplaint = {
      id: newId,
      title: complaintForm.title,
      category: complaintForm.category,
      description: complaintForm.description,
      status: "pending",
      location: complaintForm.location,
      priority: complaintForm.priority,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      assignedTo: null,
      updates: [],
    };
    
    // Add to complaints list
    setComplaints([...complaints, newComplaint]);
    
    // Reset form
    setComplaintForm({
      title: "",
      category: "plumbing",
      description: "",
      location: user?.roomAllocated ? `Room ${user.roomAllocated}` : "",
      priority: "medium",
    });
    
    // Show success notification
    toast.success("Complaint submitted successfully");
    
    // Close dialog
    setIsDialogOpen(false);
  };
  
  const handleAssignStaff = (complaintId, staffId) => {
    // Find staff member
    const staff = maintenanceStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    // Update complaint with assignment
    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          status: "in-progress",
          assignedTo: staff.name,
          updates: [
            ...complaint.updates,
            {
              id: complaint.updates.length + 1,
              text: `Assigned to ${staff.name}`,
              time: new Date().toISOString(),
              by: "Admin"
            }
          ]
        };
      }
      return complaint;
    }));
    
    toast.success(`Complaint assigned to ${staff.name}`);
  };
  
  const handleUpdateStatus = (complaintId, newStatus) => {
    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        const statusText = newStatus === "resolved" 
          ? "Issue resolved" 
          : newStatus === "in-progress" 
            ? "Work in progress" 
            : "Status updated";
            
        return {
          ...complaint,
          status: newStatus,
          updates: [
            ...complaint.updates,
            {
              id: complaint.updates.length + 1,
              text: statusText,
              time: new Date().toISOString(),
              by: role === "admin" ? "Admin" : user?.name || "User"
            }
          ]
        };
      }
      return complaint;
    }));
    
    toast.success(`Complaint status updated to ${newStatus}`);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm({
      ...complaintForm,
      [name]: value
    });
  };
  
  // Handle select input changes
  const handleSelectChange = (name, value) => {
    setComplaintForm({
      ...complaintForm,
      [name]: value
    });
  };
  
  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
  };
  
  // For autofilling a room-related complaint
  const autofillRoomIssue = () => {
    if (user?.roomAllocated) {
      setComplaintForm({
        title: "Fan not working",
        category: "electrical",
        description: `The ceiling fan in my room ${user.roomAllocated} is not working properly. It makes a loud noise and rotates very slowly.`,
        location: `Room ${user.roomAllocated}`,
        priority: "high",
      });
      toast.info("Room issue details filled. Review and submit.");
    } else {
      toast.error("You need to have a room allocated first.");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Complaint Management System</h1>
          <p className="text-muted-foreground">
            Submit and track maintenance issues and requests
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-hostel-purple hover:bg-hostel-purple-dark">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submit New Complaint</DialogTitle>
              <DialogDescription>
                Fill in the details of your complaint or maintenance request.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleComplaintSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={complaintForm.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select 
                    name="category" 
                    value={complaintForm.category} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={complaintForm.location}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select 
                    name="priority" 
                    value={complaintForm.priority} 
                    onValueChange={(value) => handleSelectChange("priority", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={complaintForm.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="col-span-4 flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={autofillRoomIssue}
                      className="mr-2"
                    >
                      Auto-fill Room Issue
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-hostel-purple hover:bg-hostel-purple-dark">
                  Submit Complaint
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue={role === "admin" ? "all" : "my-complaints"}>
        <TabsList>
          {role === "admin" && <TabsTrigger value="all">All Complaints</TabsTrigger>}
          <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
          {role === "admin" && <TabsTrigger value="assignments">Staff Assignments</TabsTrigger>}
          {role === "admin" && <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Management</CardTitle>
              <CardDescription>
                View and manage all maintenance requests and complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                  <div className="relative">
                    <Search className="absolute left-2 h-4 w-4 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search complaints..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select onValueChange={setCategoryFilter} defaultValue={categoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select onValueChange={setPriorityFilter} defaultValue={priorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-3">Title</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                
                {filteredComplaints.length > 0 ? (
                  <div className="divide-y">
                    {filteredComplaints.map((complaint) => (
                      <div key={complaint.id} className="grid grid-cols-12 p-3 text-sm items-center">
                        <div className="col-span-1 font-medium">{complaint.id}</div>
                        <div className="col-span-3">{complaint.title}</div>
                        <div className="col-span-2">{complaint.category}</div>
                        <div className="col-span-2">{complaint.location}</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className={`${
                            complaint.status === "pending" 
                              ? "border-amber-500 text-amber-600 bg-amber-50" 
                              : complaint.status === "in-progress" 
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-green-500 text-green-600 bg-green-50"
                          }`}>
                            {complaint.status === "pending" 
                              ? "Pending" 
                              : complaint.status === "in-progress" 
                                ? "In Progress" 
                                : "Resolved"}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-right space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleViewComplaint(complaint)}>
                            View
                          </Button>
                          {role === "admin" && complaint.status !== "resolved" && (
                            <Select 
                              onValueChange={(value) => handleUpdateStatus(complaint.id, value)}
                            >
                              <SelectTrigger className="w-[110px] h-8">
                                <SelectValue placeholder="Update" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No complaints match your search criteria
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {selectedComplaint && (
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Complaint Details: {selectedComplaint.id}</CardTitle>
                    <CardDescription>{selectedComplaint.title}</CardDescription>
                  </div>
                  <Badge variant="outline" className={`${
                    selectedComplaint.status === "pending" 
                      ? "border-amber-500 text-amber-600 bg-amber-50" 
                      : selectedComplaint.status === "in-progress" 
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-green-500 text-green-600 bg-green-50"
                  }`}>
                    {selectedComplaint.status === "pending" 
                      ? "Pending" 
                      : selectedComplaint.status === "in-progress" 
                        ? "In Progress" 
                        : "Resolved"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-sm font-medium">Description</h3>
                      <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Category</h3>
                        <p className="text-sm text-muted-foreground">{selectedComplaint.category}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Priority</h3>
                        <p className="text-sm text-muted-foreground capitalize">{selectedComplaint.priority}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Location</h3>
                        <p className="text-sm text-muted-foreground">{selectedComplaint.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Submitted On</h3>
                        <p className="text-sm text-muted-foreground">{selectedComplaint.date}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Assigned To</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedComplaint.assignedTo || "Not yet assigned"}
                      </p>
                    </div>
                    
                    {role === "admin" && selectedComplaint.status !== "resolved" && (
                      <div className="pt-2">
                        <h3 className="text-sm font-medium mb-2">Assign To Staff</h3>
                        <div className="flex gap-2">
                          <Select 
                            onValueChange={(value) => handleAssignStaff(selectedComplaint.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select staff member" />
                            </SelectTrigger>
                            <SelectContent>
                              {maintenanceStaff
                                .filter(staff => staff.department.toLowerCase() === selectedComplaint.category.toLowerCase() || selectedComplaint.category.toLowerCase() === "other")
                                .map(staff => (
                                  <SelectItem key={staff.id} value={staff.id}>
                                    {staff.name} ({staff.status})
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Activity Log</h3>
                    
                    <div className="space-y-3">
                      {/* Initial submission entry */}
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400 mt-2"></div>
                        <div>
                          <p className="text-sm">Complaint submitted</p>
                          <p className="text-xs text-muted-foreground">{selectedComplaint.date}</p>
                        </div>
                      </div>
                      
                      {/* Activity updates */}
                      {selectedComplaint.updates.map(update => (
                        <div key={update.id} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                          <div>
                            <p className="text-sm">{update.text}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(update.time).toLocaleString()} by {update.by}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedComplaint.status !== "resolved" && (
                      <div className="pt-2">
                        <h3 className="text-sm font-medium mb-2">Update Status</h3>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={selectedComplaint.status === "pending" ? "default" : "outline"}
                            onClick={() => handleUpdateStatus(selectedComplaint.id, "pending")}
                            className={selectedComplaint.status === "pending" ? "bg-hostel-purple hover:bg-hostel-purple-dark" : ""}
                          >
                            Pending
                          </Button>
                          <Button 
                            size="sm" 
                            variant={selectedComplaint.status === "in-progress" ? "default" : "outline"}
                            onClick={() => handleUpdateStatus(selectedComplaint.id, "in-progress")}
                            className={selectedComplaint.status === "in-progress" ? "bg-hostel-purple hover:bg-hostel-purple-dark" : ""}
                          >
                            In Progress
                          </Button>
                          <Button 
                            size="sm" 
                            variant={selectedComplaint.status === "resolved" ? "default" : "outline"}
                            onClick={() => handleUpdateStatus(selectedComplaint.id, "resolved")}
                            className={selectedComplaint.status === "resolved" ? "bg-hostel-purple hover:bg-hostel-purple-dark" : ""}
                          >
                            Resolved
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="my-complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Complaints</CardTitle>
              <CardDescription>
                Track your submitted maintenance requests and complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter and search similar to all complaints */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div className="relative">
                    <Search className="absolute left-2 h-4 w-4 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search your complaints..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select onValueChange={setCategoryFilter} defaultValue={categoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Similar table display but filtered to my complaints */}
              <div className="rounded-md border">
                <div className="grid grid-cols-10 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-3">Title</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                
                {filteredComplaints.length > 0 ? (
                  <div className="divide-y">
                    {filteredComplaints.map((complaint) => (
                      <div key={complaint.id} className="grid grid-cols-10 p-3 text-sm items-center">
                        <div className="col-span-1 font-medium">{complaint.id}</div>
                        <div className="col-span-3">{complaint.title}</div>
                        <div className="col-span-2">{complaint.category}</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className={`${
                            complaint.status === "pending" 
                              ? "border-amber-500 text-amber-600 bg-amber-50" 
                              : complaint.status === "in-progress" 
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-green-500 text-green-600 bg-green-50"
                          }`}>
                            {complaint.status === "pending" 
                              ? "Pending" 
                              : complaint.status === "in-progress" 
                                ? "In Progress" 
                                : "Resolved"}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-right space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleViewComplaint(complaint)}>
                            View
                          </Button>
                          {complaint.status === "pending" && (
                            <Button size="sm" variant="outline" className="text-red-500">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    You haven't submitted any complaints yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Same detailed view as in All Complaints tab */}
          {selectedComplaint && (
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Complaint Details: {selectedComplaint.id}</CardTitle>
                    <CardDescription>{selectedComplaint.title}</CardDescription>
                  </div>
                  <Badge variant="outline" className={`${
                    selectedComplaint.status === "pending" 
                      ? "border-amber-500 text-amber-600 bg-amber-50" 
                      : selectedComplaint.status === "in-progress" 
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-green-500 text-green-600 bg-green-50"
                  }`}>
                    {selectedComplaint.status === "pending" 
                      ? "Pending" 
                      : selectedComplaint.status === "in-progress" 
                        ? "In Progress" 
                        : "Resolved"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-sm font-medium">Description</h3>
                      <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Category</h3>
                        <p className="text-sm text-muted-foreground">{selectedComplaint.category}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Priority</h3>
                        <p className="text-sm text-muted-foreground capitalize">{selectedComplaint.priority}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Location</h3>
                        <p className="text-sm text-muted-foreground">{selectedComplaint.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Submitted On</h3>
                        <p className="text-sm text-muted-foreground">{selectedComplaint.date}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Assigned To</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedComplaint.assignedTo || "Not yet assigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplaintSystem;
