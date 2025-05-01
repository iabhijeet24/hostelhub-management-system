
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Users, Filter, Search } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

// Mock data for rooms
const BLOCKS = ["All Blocks", "Block A", "Block B", "Block C", "Block D"];
const FLOORS = ["All Floors", "Ground", "First", "Second", "Third"];
const ROOM_TYPES = ["All Types", "Single", "Double Sharing", "Triple Sharing"];

const mockRooms = Array.from({ length: 20 }, (_, i) => {
  const blockLetter = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
  const floor = Math.floor(Math.random() * 4); // 0-3 floor
  const roomNumber = Math.floor(Math.random() * 25) + 1; // 1-25 rooms per floor
  const fullRoomNumber = `${floor}${roomNumber.toString().padStart(2, "0")}`; // Format: floor + room (e.g., 301)
  
  const roomType = ["Single", "Double Sharing", "Triple Sharing"][Math.floor(Math.random() * 3)];
  const capacity = roomType === "Single" ? 1 : roomType === "Double Sharing" ? 2 : 3;
  
  // Random occupancy that doesn't exceed capacity
  const occupied = Math.min(capacity, Math.floor(Math.random() * (capacity + 1)));
  
  return {
    id: `room-${i}`,
    number: fullRoomNumber,
    block: blockLetter,
    floor: floor === 0 ? "Ground" : `${floor}${floor === 1 ? "st" : floor === 2 ? "nd" : "rd"}`,
    type: roomType,
    capacity,
    occupied,
    available: capacity - occupied,
    status: occupied >= capacity ? "Full" : "Available",
    amenities: [
      "Wi-Fi",
      "Attached Bathroom",
      "Study Table",
      "Wardrobe",
      "Bed with Mattress"
    ].slice(0, Math.floor(Math.random() * 3) + 3), // 3-5 amenities per room
  };
});

// Mock data for preferences
const mockPreferences = [
  { id: 1, preference: "Block B preference", reason: "Closer to the computer lab", status: "Approved" },
  { id: 2, preference: "Ground floor room", reason: "Medical reasons", status: "Pending" },
  { id: 3, preference: "Single room request", reason: "Study requirements", status: "Rejected" },
];

const RoomAllocation = () => {
  const { role } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [block, setBlock] = useState("all");
  const [floor, setFloor] = useState("all");
  const [roomType, setRoomType] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  
  // Filter rooms based on search and filter criteria
  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = 
      searchQuery === "" || 
      room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${room.block}-${room.number}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBlock = block === "all" || room.block === block.split(" ")[1]; // Extract "A" from "Block A"
    const matchesFloor = floor === "all" || room.floor.toLowerCase().includes(floor.toLowerCase());
    const matchesRoomType = roomType === "all" || room.type === roomType;
    const matchesAvailability = 
      availabilityFilter === "all" || 
      (availabilityFilter === "available" && room.available > 0) ||
      (availabilityFilter === "full" && room.available === 0);
    
    return matchesSearch && matchesBlock && matchesFloor && matchesRoomType && matchesAvailability;
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Room Allocation</h1>
        <p className="text-muted-foreground">
          Manage hostel room assignments and view availability status
        </p>
      </div>
      
      <Tabs defaultValue={role === "admin" ? "all-rooms" : "my-room"}>
        <TabsList className="mb-4">
          {role === "admin" && <TabsTrigger value="all-rooms">All Rooms</TabsTrigger>}
          {role === "student" && <TabsTrigger value="my-room">My Room</TabsTrigger>}
          <TabsTrigger value="room-finder">Room Finder</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {role === "admin" && (
          <TabsContent value="all-rooms" className="animate-in">
            <Card>
              <CardHeader>
                <CardTitle>Room Inventory</CardTitle>
                <CardDescription>
                  Manage and view all hostel rooms and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    <div className="col-span-2 flex items-center relative">
                      <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by room number..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select onValueChange={setBlock} defaultValue={block}>
                      <SelectTrigger>
                        <SelectValue placeholder="Block" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Blocks</SelectItem>
                        <SelectItem value="Block A">Block A</SelectItem>
                        <SelectItem value="Block B">Block B</SelectItem>
                        <SelectItem value="Block C">Block C</SelectItem>
                        <SelectItem value="Block D">Block D</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select onValueChange={setFloor} defaultValue={floor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Floor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Floors</SelectItem>
                        <SelectItem value="Ground">Ground Floor</SelectItem>
                        <SelectItem value="1st">First Floor</SelectItem>
                        <SelectItem value="2nd">Second Floor</SelectItem>
                        <SelectItem value="3rd">Third Floor</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select onValueChange={setRoomType} defaultValue={roomType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Room Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Double Sharing">Double Sharing</SelectItem>
                        <SelectItem value="Triple Sharing">Triple Sharing</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select onValueChange={setAvailabilityFilter} defaultValue={availabilityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rooms</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="col-span-2 md:flex md:justify-end">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline">
                          <Filter className="h-4 w-4 mr-2" />
                          Advanced Filters
                        </Button>
                        <Button className="bg-hostel-purple hover:bg-hostel-purple-dark">
                          <BedDouble className="h-4 w-4 mr-2" />
                          Allocate Rooms
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-2">Room</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2 text-center">Capacity</div>
                    <div className="col-span-2 text-center">Occupied</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  
                  {filteredRooms.length > 0 ? (
                    <div className="divide-y">
                      {filteredRooms.map((room) => (
                        <div key={room.id} className="grid grid-cols-12 p-3 text-sm items-center">
                          <div className="col-span-2">
                            <div className="font-medium">Block {room.block}-{room.number}</div>
                            <div className="text-xs text-muted-foreground">
                              {room.floor} Floor
                            </div>
                          </div>
                          <div className="col-span-2">{room.type}</div>
                          <div className="col-span-2 text-center">{room.capacity}</div>
                          <div className="col-span-2 text-center">{room.occupied}</div>
                          <div className="col-span-2">
                            <Badge variant={room.status === "Available" ? "outline" : "secondary"} className={`${
                              room.status === "Available" ? "border-green-500 text-green-600 bg-green-50" : "bg-gray-100"
                            }`}>
                              {room.status}
                            </Badge>
                          </div>
                          <div className="col-span-2 text-right space-x-1">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No rooms match your search criteria
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredRooms.length} of {mockRooms.length} rooms
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {role === "student" && (
          <TabsContent value="my-room" className="animate-in">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Room B-203</CardTitle>
                  <CardDescription>Double Sharing • 2nd Floor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Room Floor Plan / Photo
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Room Details</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Room Type</dt>
                          <dd className="text-sm font-medium">Double Sharing</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Room Size</dt>
                          <dd className="text-sm font-medium">180 sq. ft.</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Bathroom</dt>
                          <dd className="text-sm font-medium">Attached</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Check-in Date</dt>
                          <dd className="text-sm font-medium">Aug 15, 2024</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Check-out Date</dt>
                          <dd className="text-sm font-medium">May 30, 2025</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Amenities</h3>
                      <ul className="space-y-1">
                        {["Wi-Fi", "Study Table", "Wardrobe", "Bed with Mattress", "Chair", "Bookshelf"].map((amenity, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Roommate</h3>
                    <div className="flex items-center space-x-4">
                      <div className="bg-muted rounded-full h-12 w-12 flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Rajesh Kumar</p>
                        <p className="text-sm text-muted-foreground">Computer Science, 3rd Year</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Room Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 13v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/><path d="M12 7V3"/><path d="m8 5 4-2 4 2"/><rect width="20" height="8" x="2" y="13" rx="2"/></svg>
                      Request Room Change
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M15 22H9a2 2 0 0 1-2-2v-5.5l-2 .5 9-9 9 9-2-.5V20a2 2 0 0 1-2 2Z"/><rect width="6" height="6" x="9" y="13" rx="1"/></svg>
                      Report Room Issue
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M10 5H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1"/><rect width="10" height="5" x="7" y="2" rx="1.5"/><path d="M7 16h9"/><path d="M7 19h5"/></svg>
                      Room Inventory List
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                      Checkout Procedure
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Room Rules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-1"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                        <span>No smoking or alcohol consumption in rooms</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-1"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                        <span>No cooking allowed in rooms</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-1"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                        <span>Visitors allowed only from 9 AM to 8 PM</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-1"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                        <span>Night curfew after 10 PM</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-1"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                        <span>No unauthorized electrical appliances</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="room-finder" className="animate-in">
          <Card>
            <CardHeader>
              <CardTitle>Find Available Rooms</CardTitle>
              <CardDescription>
                Search for rooms based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCKS.map((block) => (
                      <SelectItem key={block} value={block.toLowerCase()}>
                        {block}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {FLOORS.map((floor) => (
                      <SelectItem key={floor} value={floor.toLowerCase()}>
                        {floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockRooms
                  .filter(room => room.available > 0)
                  .slice(0, 6)
                  .map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                      <div className="bg-muted h-32 flex items-center justify-center border-b">
                        <BedDouble className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">Block {room.block}-{room.number}</h3>
                            <p className="text-sm text-muted-foreground">{room.floor} Floor</p>
                          </div>
                          <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                            {room.available}/{room.capacity} Available
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Room Type:</span>
                            <span>{room.type}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Amenities:</span>
                            <span>{room.amenities.length}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {room.amenities.map((amenity, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button className="w-full">Request Room</Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button variant="outline">View More Rooms</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="animate-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Room Preferences</CardTitle>
                <CardDescription>
                  Submit and track your room allocation preferences
                </CardDescription>
              </div>
              <Button className="bg-hostel-purple hover:bg-hostel-purple-dark">
                New Preference
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">Preference</div>
                  <div className="col-span-4">Reason</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2">Status</div>
                </div>
                
                <div className="divide-y">
                  {mockPreferences.map((pref) => (
                    <div key={pref.id} className="grid grid-cols-12 p-3 text-sm items-center">
                      <div className="col-span-1 font-medium">#{pref.id}</div>
                      <div className="col-span-3">{pref.preference}</div>
                      <div className="col-span-4">{pref.reason}</div>
                      <div className="col-span-2 text-muted-foreground">Apr 28, 2025</div>
                      <div className="col-span-2">
                        <Badge variant={pref.status === "Approved" ? "outline" : pref.status === "Pending" ? "secondary" : "destructive"} className={`${
                          pref.status === "Approved" ? "border-green-500 text-green-600 bg-green-50" : 
                          pref.status === "Pending" ? "bg-amber-100 text-amber-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {pref.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {mockPreferences.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                      No preferences submitted yet
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomAllocation;
