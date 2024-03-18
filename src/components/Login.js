import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import NavBar from './NavBar';
import { Navigate } from 'react-router';
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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [Rmsg, setRMsg] = useState('');
    const [Lmsg, setLMsg] = useState('');
    const [loggedIn, setLoggedIn] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        setEmailError(!isValidEmail(newEmail));
    };


    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isValidEmail(email)) {
            setLoading(true);

            try {
                const { data: users, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email);

                if (error) {
                    throw error;
                }

                if (!users || users.length === 0) {
                    throw new Error('User not found');
                }

                const user = users[0];

                if (user.password !== password) {
                    throw new Error('Incorrect password');
                }

                setLMsg('Login successful');
                setLoggedIn(user)
                const data = localStorage.setItem('loggedInUser', JSON.stringify(user));
                navigate('/mealList');
            } catch (error) {
                console.error('Login error:', error.message);
                setLMsg(error.message);
                setEmailError(true);
                setTimeout(() => {
                    setLMsg('');
                    setEmailError(false);
                }, 5000);
            }
        } else {
            setLMsg('Invalid email');
            setEmailError(true);
        }

        setLoading(false);
    };

    const handleSignUpSubmit = async (event) => {
        try {
            await supabase.from('users').insert([
                { email: email, password: password, username: username }
            ]);
            setRMsg('User created successfully');
            setTimeout(() => {
                setEmail('');
                setPassword('');
                setUsername('')
                Navigate('/');
            }, 8000);
        } catch (error) {
            console.error('Error signing up:', error.message);
            setRMsg(error.message)
        }
    }

    return (
        <>
            <NavBar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Container>
                    {Lmsg && <Alert severity="error">{Lmsg}</Alert>}
                    {Rmsg && <Alert severity="success">{Rmsg}</Alert>}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card sx={{ maxWidth: 400, marginTop: 2 }}>
                            <CardContent>
                                <form onSubmit={isSignUp ? handleSignUpSubmit : handleSubmit}>
                                    <StyledTextField
                                        fullWidth
                                        margin="normal"
                                        id="email"
                                        label="Email"
                                        variant="outlined"
                                        value={email}
                                        onChange={handleEmailChange}
                                        error={emailError}
                                        helperText={emailError ? 'Invalid email' : ''}
                                        required
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
                                        required
                                    />
                                    {isSignUp && (
                                        <StyledTextField
                                            fullWidth
                                            margin="normal"
                                            id="username"
                                            label="Username"
                                            variant="outlined"
                                            value={username}
                                            onChange={(event) => setUsername(event.target.value)}
                                            required
                                        />
                                    )}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        sx={{ mt: 3 }}
                                    >
                                        {isSignUp ? 'Sign Up' : 'Login'}
                                    </Button>
                                    <p>
                                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                        <Button
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            color="secondary"
                                            sx={{ mt: 3 }}
                                            onClick={() => setIsSignUp(!isSignUp)}
                                        >
                                            {isSignUp ? 'Login' : 'Sign Up'}
                                        </Button>
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Login;