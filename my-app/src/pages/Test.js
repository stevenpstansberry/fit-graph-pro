import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Typography } from '@mui/material';

function Test() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const requestConfig = {
        headers: {
          'x-api-key': process.env.REACT_APP_FIT_GRAPH_PROD_KEY
        }
      }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_FIT_GRAPH_PROD}/health` );
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error: {error.message}</Typography>;

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Data from API
                </Typography>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </Box>
        </Container>
    );
}

export default Test;
