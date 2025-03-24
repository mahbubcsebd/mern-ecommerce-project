import { createAsyncThunk } from '@reduxjs/toolkit';

// Example async thunk
export const fetchRandomNumber = createAsyncThunk(
    'counter/fetchRandomNumber',
    async () => {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        return data.info.seed; // Example response
    }
);
