import React, { createContext, useState, useContext, useEffect } from 'react';
import { userService } from '../utils/dataService';

// Create the user context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// User provider component
export const UserProvider = ({ children }) => {
  // State to store the current user
  const [currentUser, setCurrentUser] = useState(null);
  
  // State to store the user type
  const [userType, setUserType] = useState(null);
  
  // State to store loading status - set to false initially since we're not doing an async operation yet
  const [isLoading, setIsLoading] = useState(false);

  // Login function - for demonstration purposes, we'll just set the user based on mock data
  const login = (username, password) => {
    setIsLoading(true);
    
    // Mock authentication (in a real app, this would be an API call)
    setTimeout(() => {
      // Use the userService to find the user
      const foundUser = userService.findUserByUsername(username);
      
      if (foundUser) {
        setCurrentUser(foundUser);
        setUserType(foundUser.type);
        
        // Store user using the userService
        userService.setCurrentUser(foundUser);
      } else {
        console.error('User not found');
      }
      
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    
    // Remove user using the userService
    userService.removeCurrentUser();
  };

  // Upgrade guest to resident - for demonstration purposes
  const upgradeToResident = (residenceCode) => {
    if (currentUser && userType === 'guest') {
      const updatedUser = {
        ...currentUser,
        type: 'resident',
        residence: residenceCode,
      };
      
      setCurrentUser(updatedUser);
      setUserType('resident');
      
      // Update user using the userService
      userService.setCurrentUser(updatedUser);
      
      return true;
    }
    
    return false;
  };

  // Downgrade resident to guest - for admin use
  const downgradeToGuest = (userId) => {
    if (currentUser && userType === 'admin') {
      // In a real app, this would make an API call
      console.log(`User ${userId} downgraded to guest`);
      return true;
    }
    
    return false;
  };

  // NEW FUNCTION: Switch user type (for demo purposes)
  const switchUserType = (user) => {
    if (user) {
      setCurrentUser(user);
      setUserType(user.type);
      
      // Store user using the userService
      userService.setCurrentUser(user);
    }
  };

  // Load saved user on initial load
  useEffect(() => {
    // Set loading to true while we check for a saved user
    setIsLoading(true);
    
    const savedUser = userService.getCurrentUser();
    
    if (savedUser) {
      setCurrentUser(savedUser);
      setUserType(savedUser.type);
    }
    
    // Set loading to false once we're done
    setIsLoading(false);
  }, []);

  // The value to be provided to consumers
  const contextValue = {
    currentUser,
    userType,
    isLoading,
    login,
    logout,
    upgradeToResident,
    downgradeToGuest,
    switchUserType, // Add the new function to the context
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider; 