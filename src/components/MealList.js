import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { supabase } from '../supabaseClient';
import MealForm from './MealForm';
import Header from './Header';
import { useNavigate } from 'react-router';

const MealList = () => {
    const [meals, setMeals] = useState([]);
    const [editMealId, setEditMealId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            const userDataString = localStorage.getItem('loggedInUser');
            const { id } = JSON.parse(userDataString);
            const user = id;
            const { data, error } = await supabase
                .from('meals')
                .select('*')
                .eq('user_id', user);
            if (error) {
                throw error;
            }
            setMeals(data);
        } catch (error) {
            console.error('Error fetching meals:', error.message);
        }
    };

    const handleDeleteMeal = async (id) => {
        try {
            const { error } = await supabase.from('meals').delete().eq('id', id);
            if (error) {
                throw error;
            }
            setMeals(meals.filter(meal => meal.id !== id));
        } catch (error) {
            console.error('Error deleting meal:', error.message);
        }
    };

    const handleEditMeal = async (id, updatedMeal) => {
        try {
            const { error } = await supabase.from('meals').update(updatedMeal).eq('id', id);
            if (error) {
                throw error;
            }
            setMeals(meals.map(meal => (meal.id === id ? { ...meal, ...updatedMeal } : meal)));
            setEditMealId(null);
        } catch (error) {
            console.error('Error editing meal:', error.message);
        }
    };

    const handleEditClick = (id) => {
        setEditMealId(id);
    };

    const handleCloseEditForm = () => {
        setEditMealId(null);
    };
    const handleMeal = () => {
        navigate('/meals')
    }

    return (
        <>
            <Header />
            <Container>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{ justifyContent: 'flex-end', marginTop: '20px', color: 'white', marginLeft: 'auto' }} variant="contained" color="secondary" onClick={handleMeal}>Add Meal</Button>
                </div>

                <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px', color: '#800080' }}>My Weekly Meals </Typography>
                <Grid container spacing={3}>
                    {meals.map((meal, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper style={{ padding: '1rem', height: '90%', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h5" style={{ textAlign: 'center', background: '#9c27b0', color: 'white', padding: '0.2rem' }}>{meal.name}</Typography>
                                <p style={{ overflow: 'hidden', overflowWrap: 'break-word', height: '60%' }}>{meal.description}</p>
                                <img src={meal.imageurl} alt={meal.name} style={{ maxWidth: '100%', height: '50%' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        aria-label="edit"
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleEditClick(meal.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        aria-label="delete"
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteMeal(meal.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>

                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {editMealId !== null && (
                    <MealForm
                        open={true}
                        onSubmit={(updatedMeal) => handleEditMeal(editMealId, updatedMeal)}
                        initialMeal={meals.find(meal => meal.id === editMealId)}
                        onClose={handleCloseEditForm}
                    />
                )}
            </Container>
        </>
    );
};

export default MealList;
