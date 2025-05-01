
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { BedDouble, Users, MessageSquare, Bell } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useUser();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-hostel-purple rounded-md p-1">
            <BedDouble size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-hostel-purple">HostelHub</span>
        </div>
        <Link to="/login">
          <Button variant="outline">Log In</Button>
        </Link>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Smart Hostel Management
            </h1>
            <p className="text-xl text-gray-600">
              A modern platform that revolutionizes hostel management for students, administrators, and staff
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-hostel-purple hover:bg-hostel-purple/90">
                  Get Started
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 gap-4">
            {[
              {
                title: "Smart Room Allocation",
                description: "AI-driven algorithm for fair and efficient hostel room assignments",
                icon: <BedDouble className="text-hostel-purple h-8 w-8" />
              },
              {
                title: "Complaint Management",
                description: "Quick resolution of maintenance and service issues",
                icon: <MessageSquare className="text-hostel-purple h-8 w-8" />
              },
              {
                title: "Visitor Management",
                description: "QR-based check-in/check-out for guests with automated logs",
                icon: <Users className="text-hostel-purple h-8 w-8" />
              },
              {
                title: "Digital Notice Board",
                description: "AI-curated announcements with push notifications",
                icon: <Bell className="text-hostel-purple h-8 w-8" />
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <div className="bg-white p-2 rounded-md w-fit">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2025 HostelHub Guardian System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
