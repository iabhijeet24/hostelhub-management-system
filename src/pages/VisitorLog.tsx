
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, Plus, Search, Filter } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

// Mock data for visitors
const visitorTypes = ["Parent/Guardian", "Friend", "Relative", "Service Provider", "Other"];

const mockVisitors = Array.from({ length: 25 }, (_, i) => {
  const visitorType = visitorTypes[Math.floor(Math.random() * visitorTypes.length)];
  const hostelBlock = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
  const roomNumber = Math.floor(Math.random() * 400 + 100);
  const checkInDate = new Date();
  checkInDate.setHours(checkInDate.getHours() - Math.floor(Math.random() * 24));
  
  let checkOutDate = null;
  const hasLeft = Math.random() > 0.3;
  if (hasLeft) {
    checkOutDate = new Date(checkInDate);
    checkOutDate.setHours(checkOutDate.getHours() + Math.floor(Math.random() * 5) + 1);
  }
  
  return {
    id: `V-${(1000 + i).toString()}`,
    name: `Visitor ${i+1}`,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    type: visitorType,
    purpose: visitorType === "Service Provider" ? 
      ["Plumbing Work", "Electrical Repair", "Internet Setup", "Furniture Delivery"][Math.floor(Math.random() * 4)] : 
      "Visiting Student",
    hostName: `Student ${Math.floor(Math.random() * 100) + 1}`,
    hostelBlock: hostelBlock,
    roomNumber: roomNumber,
    checkInTime: checkInDate.toISOString(),
    checkOutTime: checkOutDate ? checkOutDate.toISOString() : null,
    status: checkOutDate ? "Checked Out" : "In Hostel"
  };
});

const VisitorLog = () => {
  const { role } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [visitorTypeFilter, setVisitorTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter visitors based on search and filters
  const filteredVisitors = mockVisitors.filter(visitor => {
    const matchesSearch = 
      searchQuery === "" || 
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${visitor.hostelBlock}-${visitor.roomNumber}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = visitorTypeFilter === "all" || visitor.type.toLowerCase() === visitorTypeFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || visitor.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Format date function
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Count totals
  const totalVisitors = mockVisitors.length;
  const currentVisitors = mockVisitors.filter(v => v.status === "In Hostel").length;
  const todayVisitors = mockVisitors.filter(v => {
    const visitDate = new Date(v.checkInTime).toDateString();
    const today = new Date().toDateString();
    return visitDate === today;
  }).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visitor Management</h1>
        <p className="text-muted-foreground">
          Track and manage visitor entries and exits in the hostel
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors}</div>
            <p className="text-xs text-muted-foreground">
              All time visitor entries
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Visitors</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Currently in hostel
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Check-ins today
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col">
        <Tabs defaultValue="all-visitors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <TabsList>
              <TabsTrigger value="all-visitors">All Visitors</TabsTrigger>
              <TabsTrigger value="current-visitors">Current Visitors</TabsTrigger>
              {role === "student" && <TabsTrigger value="my-visitors">My Visitors</TabsTrigger>}
            </TabsList>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-2 sm:mt-0 bg-hostel-purple hover:bg-hostel-purple-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Register Visitor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Register New Visitor</DialogTitle>
                  <DialogDescription>
                    Enter visitor details to generate a visitor pass
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Visitor Name</Label>
                    <Input id="name" placeholder="Full name of the visitor" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Visitor's contact number" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="visitor-type">Visitor Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {visitorTypes.map(type => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purpose">Purpose of Visit</Label>
                    <Input id="purpose" placeholder="Reason for visiting" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="block">Hostel Block</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select block" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Block A</SelectItem>
                          <SelectItem value="b">Block B</SelectItem>
                          <SelectItem value="c">Block C</SelectItem>
                          <SelectItem value="d">Block D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="room">Room Number</Label>
                      <Input id="room" placeholder="Room number" />
                    </div>
                  </div>
                  {role === "admin" && (
                    <div className="grid gap-2">
                      <Label htmlFor="host">Host Name</Label>
                      <Input id="host" placeholder="Student being visited" />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="id-proof">ID Proof (Optional)</Label>
                    <Input id="id-proof" type="file" />
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
                    Register & Generate Pass
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b bg-muted/30">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search visitors..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select onValueChange={setVisitorTypeFilter} defaultValue={visitorTypeFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Visitor Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {visitorTypes.map(type => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="in hostel">In Hostel</SelectItem>
                        <SelectItem value="checked out">Checked Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <TabsContent value="all-visitors" className="m-0">
                <div className="rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Visitor ID</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Host</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Room</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Check In</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                        <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredVisitors.map((visitor) => (
                        <tr key={visitor.id} className="hover:bg-muted/50">
                          <td className="p-3 text-sm">{visitor.id}</td>
                          <td className="p-3 text-sm font-medium">{visitor.name}</td>
                          <td className="p-3 text-sm">
                            <Badge variant="outline">{visitor.type}</Badge>
                          </td>
                          <td className="p-3 text-sm">{visitor.hostName}</td>
                          <td className="p-3 text-sm">{visitor.hostelBlock}-{visitor.roomNumber}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {formatDateTime(visitor.checkInTime)}
                          </td>
                          <td className="p-3 text-sm">
                            <Badge variant={visitor.status === "In Hostel" ? "secondary" : "outline"} className={`${
                              visitor.status === "In Hostel" ? "bg-blue-100 text-blue-800" :
                              "border-green-500 text-green-600 bg-green-50"
                            }`}>
                              {visitor.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="outline" size="sm">View</Button>
                              {visitor.status === "In Hostel" && (
                                <Button variant="outline" size="sm">Check Out</Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {filteredVisitors.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-muted-foreground">
                            No visitors found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredVisitors.length} of {mockVisitors.length} visitors
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
              </TabsContent>
              
              <TabsContent value="current-visitors" className="m-0">
                <div className="rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Visitor ID</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Host</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Room</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Check In</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Duration</th>
                        <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredVisitors.filter(v => v.status === "In Hostel").map((visitor) => {
                        // Calculate duration
                        const checkIn = new Date(visitor.checkInTime);
                        const now = new Date();
                        const diffMs = now.getTime() - checkIn.getTime();
                        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        const duration = diffHrs > 0 ? `${diffHrs}h ${diffMins}m` : `${diffMins}m`;
                        
                        return (
                          <tr key={visitor.id} className="hover:bg-muted/50">
                            <td className="p-3 text-sm">{visitor.id}</td>
                            <td className="p-3 text-sm font-medium">{visitor.name}</td>
                            <td className="p-3 text-sm">
                              <Badge variant="outline">{visitor.type}</Badge>
                            </td>
                            <td className="p-3 text-sm">{visitor.hostName}</td>
                            <td className="p-3 text-sm">{visitor.hostelBlock}-{visitor.roomNumber}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {formatDateTime(visitor.checkInTime)}
                            </td>
                            <td className="p-3 text-sm">
                              {duration}
                            </td>
                            <td className="p-3 text-sm text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="outline" size="sm">View</Button>
                                <Button variant="outline" size="sm">Check Out</Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      
                      {filteredVisitors.filter(v => v.status === "In Hostel").length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-muted-foreground">
                            No current visitors in hostel
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              {role === "student" && (
                <TabsContent value="my-visitors" className="m-0">
                  <div className="rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Visitor ID</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Purpose</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Check In</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Check Out</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredVisitors.slice(0, 5).map((visitor) => (
                          <tr key={visitor.id} className="hover:bg-muted/50">
                            <td className="p-3 text-sm">{visitor.id}</td>
                            <td className="p-3 text-sm font-medium">{visitor.name}</td>
                            <td className="p-3 text-sm">
                              <Badge variant="outline">{visitor.type}</Badge>
                            </td>
                            <td className="p-3 text-sm">{visitor.purpose}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {formatDateTime(visitor.checkInTime)}
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {visitor.checkOutTime ? formatDateTime(visitor.checkOutTime) : "—"}
                            </td>
                            <td className="p-3 text-sm">
                              <Badge variant={visitor.status === "In Hostel" ? "secondary" : "outline"} className={`${
                                visitor.status === "In Hostel" ? "bg-blue-100 text-blue-800" :
                                "border-green-500 text-green-600 bg-green-50"
                              }`}>
                                {visitor.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                        
                        {filteredVisitors.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                              No visitors found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default VisitorLog;
