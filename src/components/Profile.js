import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import Header from './Header';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#9c27b0',
        },
        '&:hover': {
            borderColor: '#9c27b0',
        },
        '&:focus-within fieldset': {
            borderColor: 'purple',
        },
        '& fieldset': {
            borderColor: '#9c27b0',
        },
    },
});

const Profile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            setUsername(loggedInUser.username || '');
            setEmail(loggedInUser.email || '');
            setPassword(loggedInUser.password || '');
        }
    }, []);


    const handleUpdateProfile = async () => {
        try {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            const userId = loggedInUser.id;
            const { error } = await supabase
                .from('users')
                .update({ email: email, password: password, username: username })
                .eq('id', userId);
            if (error) {
                console.error('Supabase error:', error.message);
            }

            if (error) {
                throw error;
            }
            const updatedUser = {
                ...loggedInUser,
                username: username,
                password: password,
                email: email
            };
            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
            setShowAlert(true);
        } catch (error) {
            console.error('Error updating profile:', error.message);
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <>
            <Header />
            <Container>
                <Snackbar
                    open={showAlert}
                    autoHideDuration={6000}
                    onClose={handleAlertClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleAlertClose} severity="success">
                        Profile updated successfully!
                    </Alert>
                </Snackbar>
                <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', color: '#800080' }}>My Profile</Typography>
                <StyledTextField
                    fullWidth
                    margin="normal"
                    id="username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <StyledTextField
                    fullWidth
                    margin="normal"
                    id="email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <StyledTextField
                    fullWidth
                    margin="normal"
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button variant="contained" color="secondary" onClick={handleUpdateProfile}>Update</Button>
            </Container>
        </>
    );
}

export default Profile;