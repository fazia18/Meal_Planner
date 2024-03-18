import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const MyProfile = () => {
        navigate("/profile")
    }
    const onLogout = async () => {
        await logout();
        navigate("/");
    }

    return (
        <AppBar position="static" color="secondary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Meal Planner
                </Typography>
                <Button color="inherit" onClick={onLogout}>Logout</Button>
                <Button color="inherit" onClick={MyProfile}>MyProfile</Button>
            </Toolbar>
        </AppBar>
    );
};


export default Header