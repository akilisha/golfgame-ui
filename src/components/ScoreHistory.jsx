import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

export default function ScoreHistory({ text }) {

    return <div style={{
        width: "400px",
        margin: "40px auto"
    }}>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                    m: 1,
                },
            }}
        >
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Coming soon
                    </Typography>
                    <Typography variant="h5" component="div">
                        Subscription features
                    </Typography>
                    <Typography sx={{ mb: 2 }} color="text.secondary">
                        Scores history
                    </Typography>
                    <Typography variant="body2">
                        Improve your game by tracking your scores history for each location you have played
                        <br />
                        {'"it\'s exciting and engaging"'}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    </div>
}