import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useNavigate, useRouteError } from 'react-router-dom';

export default function OutlinedCard() {

  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: "100vw",
        alignItems: 'center'
      }}
    >
      <Grid sx={{ width: '50%', mt: 6 }} container spacing={2}>
        <Grid item xs={4}>
          <img src='src/assets/stop-sign.png' width={200} style={{ borderRadius: '10px' }} />
        </Grid>
        <Grid item xs={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Oh Com'on!
              </Typography>
              <Typography variant="h5" component="div">
                Nothing pleasant beyond here
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Recommendation
              </Typography>
              <Typography variant="body2">
                {error?.statusText || error?.message || "Now would be a good time to review where you went wrong."}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate("/")}>Get me out of dodge</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}