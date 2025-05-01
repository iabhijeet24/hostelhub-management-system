
import React, { useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BedDouble, 
  MessageSquare, 
  Users, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, role, allocateRoom } = useUser();
  const navigate = useNavigate();
  
  // Check if room needs to be allocated
  useEffect(() => {
    if (role === "student" && user && !user.roomAllocated) {
      toast.info("Your room hasn't been allocated yet. Please check your profile.");
    }
  }, [user, role]);
  
  const handleAllocateRoom = () => {
    const roomId = allocateRoom();
    if (roomId) {
      toast.success(`Room ${roomId} has been allocated to you.`);
    } else {
      toast.error("Failed to allocate room. Please try again later.");
    }
  };
  
  const handleFileComplaint = () => {
    navigate("/complaints");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your hostel system.
        </p>
      </div>

      {/* Only show the student view tab for students, admin view tab for admins */}
      {role === "student" ? (
        <div className="animate-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Student Profile</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{user?.name || "Not Available"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Roll Number:</span>
                    <span className="font-medium">{user?.rollNumber || "Not Available"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Branch:</span>
                    <span className="font-medium">{user?.branch || "Not Available"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Year:</span>
                    <span className="font-medium">{user?.year ? `${user.year}${user.year === 1 ? 'st' : user.year === 2 ? 'nd' : user.year === 3 ? 'rd' : 'th'} Year` : "Not Available"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-xs" size="sm">
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Room</CardTitle>
                <BedDouble className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {user?.roomAllocated ? (
                  <>
                    <div className="text-2xl font-bold">Room {user.roomAllocated}</div>
                    <p className="text-sm text-muted-foreground mt-1">Block {user.roomAllocated.split('-')[0]}, {user.roomAllocated.charAt(2)}rd Floor</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Room Type:</span>
                        <span className="font-medium">Double Sharing</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Roommate:</span>
                        <span className="font-medium">Rajesh Kumar</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Check-in Date:</span>
                        <span className="font-medium">Aug 15, 2024</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32">
                    <p className="text-center text-muted-foreground mb-4">No room allocated yet</p>
                    <Button onClick={handleAllocateRoom} className="bg-hostel-purple hover:bg-hostel-purple-dark">
                      Allocate Room
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {user?.roomAllocated && (
                  <Button variant="outline" className="w-full text-xs" size="sm" onClick={handleFileComplaint}>
                    Report Room Issue
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Complaints</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Active Complaints</span>
                    <span className="text-sm text-muted-foreground">2</span>
                  </div>
                  <Progress value={40} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Bathroom Tap Leakage</p>
                      <p className="text-muted-foreground text-xs">Submitted 2 days ago - In Progress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Wi-Fi Connectivity Issue</p>
                      <p className="text-muted-foreground text-xs">Submitted today - Pending</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Room Light Not Working</p>
                      <p className="text-muted-foreground text-xs">Resolved yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-xs" size="sm" onClick={handleFileComplaint}>
                  File New Complaint
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notices</CardTitle>
                <CardDescription>Latest announcements from administration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Weekend Campus Cleanup Drive",
                    date: "May 1, 2025",
                    description: "All students are requested to participate in the campus cleanup drive on Saturday from 9 AM to 12 PM."
                  },
                  {
                    title: "Hostel Maintenance Schedule",
                    date: "Apr 28, 2025",
                    description: "Plumbing maintenance work will be carried out in Block B & C on Sunday. Water supply may be interrupted."
                  },
                  {
                    title: "Mess Committee Elections",
                    date: "Apr 25, 2025",
                    description: "Nominations for mess committee representatives are now open. Last date to apply is May 5th."
                  }
                ].map((notice, index) => (
                  <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notice.title}</h3>
                      <span className="text-xs text-muted-foreground">{notice.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notice.description}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Notices</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Hostel and campus activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Cultural Night",
                    date: "May 5, 2025 • 7:00 PM",
                    location: "Main Auditorium",
                    description: "Annual cultural showcase featuring performances from all hostels."
                  },
                  {
                    title: "Career Workshop",
                    date: "May 8, 2025 • 10:00 AM",
                    location: "Seminar Hall",
                    description: "Resume building and interview preparation workshop by alumni."
                  },
                  {
                    title: "Inter-Hostel Sports Tournament",
                    date: "May 10-12, 2025",
                    location: "Campus Grounds",
                    description: "Annual sports competition between hostel blocks."
                  }
                ].map((event, index) => (
                  <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex flex-col space-y-1 mt-1">
                      <div className="flex items-center text-xs">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{event.date}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-muted-foreground"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                        <span className="text-muted-foreground">{event.location}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Calendar</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        // Admin Dashboard content
        <div className="animate-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Occupancy</CardTitle>
                <BedDouble className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">86.5%</div>
                <p className="text-xs text-muted-foreground">432/500 rooms occupied</p>
                <div className="mt-4">
                  <Progress value={86.5} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Complaints</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-muted-foreground">8 high priority</span>
                  <span className="text-red-500 font-medium">+4 today</span>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Plumbing</span>
                    <span>38%</span>
                  </div>
                  <Progress value={38} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span>Electrical</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span>Wi-Fi</span>
                    <span>18%</span>
                  </div>
                  <Progress value={18} className="h-1" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitor Log</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">Visitors today</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Currently in hostel</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Parents/Guardians</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Other visitors</span>
                    <span className="font-medium">19</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Active notices</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Read rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Updated 35m ago</span>
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                      <span className="sr-only">Refresh</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Recent Complaints</CardTitle>
                <CardDescription>Latest maintenance requests from students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                <div className="space-y-2">
                  {[
                    {
                      id: "COM-2345",
                      title: "Bathroom Tap Leakage",
                      student: "Rahul Singh",
                      room: "B-203",
                      priority: "Medium",
                      status: "In Progress",
                      date: "May 1, 2025"
                    },
                    {
                      id: "COM-2344",
                      title: "Wi-Fi Connectivity Issue",
                      student: "Priya Sharma",
                      room: "G-112",
                      priority: "High",
                      status: "Pending",
                      date: "May 1, 2025"
                    },
                    {
                      id: "COM-2343",
                      title: "Fan Not Working",
                      student: "Amit Kumar",
                      room: "A-405",
                      priority: "High",
                      status: "Assigned",
                      date: "Apr 30, 2025"
                    },
                    {
                      id: "COM-2342",
                      title: "Window Lock Broken",
                      student: "Sneha Patel",
                      room: "C-301",
                      priority: "Low",
                      status: "Pending",
                      date: "Apr 30, 2025"
                    }
                  ].map((complaint, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-8 rounded-full ${
                          complaint.priority === "High" 
                            ? "bg-red-500" 
                            : complaint.priority === "Medium" 
                              ? "bg-amber-500" 
                              : "bg-green-500"
                        }`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{complaint.title}</span>
                            <span className="text-xs text-muted-foreground">{complaint.id}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground">{complaint.student} • {complaint.room}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          complaint.status === "Pending" 
                            ? "bg-amber-100 text-amber-800" 
                            : complaint.status === "In Progress" 
                              ? "bg-blue-100 text-blue-800" 
                              : complaint.status === "Assigned"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Complaints</Button>
              </CardFooter>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Staff on Duty</CardTitle>
                <CardDescription>Maintenance staff currently available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "Ramesh Kumar",
                    role: "Electrician",
                    status: "Available",
                    tasks: 2,
                    initials: "RK"
                  },
                  {
                    name: "Sunil Patil",
                    role: "Plumber",
                    status: "On Task",
                    tasks: 3,
                    initials: "SP"
                  },
                  {
                    name: "Dinesh Sharma",
                    role: "IT Support",
                    status: "Available",
                    tasks: 1,
                    initials: "DS"
                  },
                  {
                    name: "Vinod Gupta",
                    role: "Carpenter",
                    status: "On Break",
                    tasks: 0,
                    initials: "VG"
                  }
                ].map((staff, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-hostel-purple-light text-white">
                          {staff.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">{staff.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        staff.status === "Available" 
                          ? "bg-green-100 text-green-800" 
                          : staff.status === "On Task" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-100 text-gray-800"
                      }`}>
                        {staff.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {staff.tasks} active tasks
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Manage Staff</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
