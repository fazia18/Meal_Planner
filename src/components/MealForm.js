import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Button, Alert } from '@mui/material';
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

const MealForm = ({ open, onClose, onSubmit, initialMeal = {} }) => {
    const [meal, setMeal] = useState(initialMeal);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeal({ ...meal, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (!meal.name) {
                throw new Error('Name of recipe is required for the selected meal.');
            }
            onSubmit(meal);
            onClose();
        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 5000);
        }

    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography variant="h4" style={{ color: 'purple', justifyContent: 'center', textAlign: 'center' }}>Meal Form</Typography>
                {error && <Alert severity="error">{error}</Alert>}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <StyledTextField
                        label="Name"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        required
                        value={meal.name || ''}
                        onChange={handleChange}
                        name="name"
                    />
                    <StyledTextField
                        label="Description"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={meal.description || ''}
                        onChange={handleChange}
                        name="description"
                    />
                    <StyledTextField
                        label="Image URL"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={meal.imageurl || ''}
                        onChange={handleChange}
                        name="imageurl"
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="secondary" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MealForm;
