import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import MealCalendar from './components/MealCalendar';
import MealList from './components/MealList';
import { UserProvider } from './components/UserContext';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const [userData, setUserData] = useState('');
  useEffect(() => {
    setUserData(localStorage.getItem('loggedInUser'));
  }, []);


  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/mealList"
            element={
              <PrivateRoute userData={userData}>
                <MealList />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute userData={userData}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/meals"
            element={
              <PrivateRoute userData={userData}>
                <MealCalendar />
              </PrivateRoute>
            } />

        </Routes>
      </Router>
    </UserProvider>


  );
};

export default App;
