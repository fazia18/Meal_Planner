import React, { useState } from 'react';
import { Container, Typography, Grid, TextField, Button, Alert } from '@mui/material';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router';
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

const MealCalendar = () => {
    const [meals, setMeals] = useState(Array(7).fill({
        name: '',
        description: '',
        imageurl: ''
    }));
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleCardClick = (index) => {
        setSelectedIndex(index);
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setMeals(prevMeals => {
            const updatedMeals = [...prevMeals];
            updatedMeals[index] = { ...updatedMeals[index], [name]: value };
            return updatedMeals;
        });
    };

    const handleAddMeals = async () => {
        try {
            const promises = meals.map((meal, index) => {
                if (index === selectedIndex && !meal.name) {
                    throw new Error('Name of recipe is required for the selected meal.');
                }

                if (meal.name && meal.description && meal.imageurl) {
                    const date = getDateByIndex(index);
                    const userDataString = localStorage.getItem('loggedInUser');
                    const { id } = JSON.parse(userDataString);
                    const user_id = id;
                    return supabase.from('meals').insert([{ ...meal, date, user_id }]);
                } else {
                    return null;
                }
            });
            await Promise.all(promises);
            setMeals(Array(7).fill({ name: '', description: '', imageurl: '' }));
            navigate('/mealList');
        } catch (error) {
            console.error('Error adding meals:', error.message);
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    const getCurrentWeekDates = () => {
        const today = new Date();
        const currentDay = today.getDay();
        const startDate = new Date(today);
        const dates = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
        }

        return dates;
    };


    const getDateByIndex = (index) => {
        const dates = getCurrentWeekDates();
        return dates[index];
    };

    const weekDates = getCurrentWeekDates();

    return (
        <>
            <Header />
            <Container>
                {error && <Alert severity="error">{error}</Alert>}
                <Typography variant="h4" mt={4} style={{ color: 'purple' }} > Weekly Meal Calendar</Typography>
                <Grid container spacing={3}>

                    {weekDates.map((date, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} onClick={() => handleCardClick(index)}>
                            <Typography variant="h6" style={{ color: 'purple' }} >
                                {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </Typography>
                            <StyledTextField
                                placeholder='Name*'
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                required
                                value={meals[index].name}
                                onChange={(e) => handleChange(e, index)}
                                name="name"
                            />
                            <StyledTextField
                                placeholder="Description"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={meals[index].description}
                                onChange={(e) => handleChange(e, index)}
                                name="description"
                            />
                            <StyledTextField
                                placeholder="Image URL"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={meals[index].imageurl}
                                onChange={(e) => handleChange(e, index)}
                                name="imageurl"
                            />
                        </Grid>
                    ))}

                </Grid>

                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleAddMeals}
                    style={{ marginBottom: '10px' }}
                >
                    Add Meals
                </Button>
            </Container >
        </>
    );
};

export default MealCalendar;