
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Role = "student" | "admin" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  // Added student-specific fields
  rollNumber?: string;
  branch?: string;
  year?: number;
  roomAllocated?: string;
}

interface UserContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  switchRole: (role: Role) => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  allocateRoom: () => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const navigate = useNavigate();

  // AI-based room allocation logic
  const allocateRoom = () => {
    if (!user) return null;
    
    // Simple AI logic for room allocation based on student data
    const blocks = ["A", "B", "C", "D"];
    const floors = [1, 2, 3];
    
    // Use student data to influence room selection
    const yearInfluence = user.year ? user.year % blocks.length : 0;
    const branchInfluence = user.branch 
      ? user.branch.charCodeAt(0) % floors.length 
      : 0;
    
    // Determine block based on student year and some randomness
    const blockIndex = (yearInfluence + Math.floor(Math.random() * 2)) % blocks.length;
    const selectedBlock = blocks[blockIndex];
    
    // Determine floor based on branch and some randomness
    const floorIndex = (branchInfluence + Math.floor(Math.random() * 2)) % floors.length;
    const selectedFloor = floors[floorIndex];
    
    // Generate room number
    const roomNumber = Math.floor(Math.random() * 20) + 1;
    const formattedRoomNumber = roomNumber.toString().padStart(2, '0');
    
    // Format: Block-FloorRoom (e.g., A-201)
    const roomId = `${selectedBlock}-${selectedFloor}${formattedRoomNumber}`;
    
    // Update user with allocated room
    updateUserProfile({ roomAllocated: roomId });
    
    return roomId;
  };

  const login = async (email: string, password: string, selectedRole: Role) => {
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock validation - in real app, this would verify with a backend
      if (email && password) {
        // Create a mock user based on the login info
        const newUser = {
          id: `user-${Math.floor(Math.random() * 10000)}`,
          name: email.split('@')[0],
          email,
          role: selectedRole,
          // Add mock student data if role is student
          ...(selectedRole === "student" ? {
            rollNumber: `R${Math.floor(10000 + Math.random() * 90000)}`,
            branch: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"][Math.floor(Math.random() * 4)],
            year: Math.floor(1 + Math.random() * 4)
          } : {})
        };
        
        setUser(newUser);
        setRole(selectedRole);
        
        // Store minimal auth info in localStorage
        localStorage.setItem('hostelHubAuth', JSON.stringify({
          isAuthenticated: true,
          role: selectedRole,
          userData: newUser
        }));
        
        toast.success(`Welcome, ${newUser.name}!`);
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      
      // Update localStorage
      const authData = JSON.parse(localStorage.getItem('hostelHubAuth') || '{}');
      localStorage.setItem('hostelHubAuth', JSON.stringify({
        ...authData,
        userData: updatedUser
      }));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('hostelHubAuth');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const switchRole = (newRole: Role) => {
    if (newRole) {
      setRole(newRole);
      if (user) {
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        
        // Update localStorage
        const authData = JSON.parse(localStorage.getItem('hostelHubAuth') || '{}');
        localStorage.setItem('hostelHubAuth', JSON.stringify({
          ...authData,
          role: newRole,
          userData: updatedUser
        }));
      }
      toast.success(`Switched to ${newRole} view`);
    }
  };
  
  // Check if user was previously logged in
  React.useEffect(() => {
    const authData = localStorage.getItem('hostelHubAuth');
    if (authData) {
      try {
        const { isAuthenticated, role: storedRole, userData } = JSON.parse(authData);
        
        if (isAuthenticated && storedRole) {
          // Use stored user data if available
          if (userData) {
            setUser(userData);
          } else {
            // Fallback to creating fake user data
            setUser({
              id: `user-${Math.floor(Math.random() * 10000)}`,
              name: `User-${Math.floor(Math.random() * 1000)}`,
              email: `user${Math.floor(Math.random() * 1000)}@example.com`,
              role: storedRole,
              // Add mock student data if role is student
              ...(storedRole === "student" ? {
                rollNumber: `R${Math.floor(10000 + Math.random() * 90000)}`,
                branch: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"][Math.floor(Math.random() * 4)],
                year: Math.floor(1 + Math.random() * 4)
              } : {})
            });
          }
          setRole(storedRole);
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
        localStorage.removeItem('hostelHubAuth');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      role, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      switchRole, 
      updateUserProfile,
      allocateRoom 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
