import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const NavBar = () => {
    return (
        <AppBar position="static" color="secondary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Meal Planner
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
