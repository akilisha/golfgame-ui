import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Elements } from '@stripe/react-stripe-js';
import SetupForm from './SetupForm';
import { AppContext } from '../../state/AppContext';

function StartSetup({ stripePromise, clientSecret, onCompletion }) {

    return clientSecret ? (
        <Elements stripe={stripePromise} options={clientSecret}>
            <SetupForm onCompletion={onCompletion} />
        </Elements>
    ) : (
        <Box sx={{ width: '100%' }}>
            <LinearProgress />
        </Box>
    )
}

export default function SubscribeForm() {

    const [prepping, setPrepping] = React.useState(false);
    const [clientSecret, setClientSecret] = React.useState('')
    const { stripePromise, createSetupIntent } = React.useContext(AppContext);
    const [message, setMessage] = React.useState('xscs')

    function handleStartPayment() {
        createSetupIntent({customerId: 'cus_QnrjFuIAwFBJW6'}).then(setClientSecret);
        setPrepping(true);
    }

    function handleOnPayment(message) {
        setMessage(message);
        setPrepping(false);
    }

    return prepping ? <StartSetup stripePromise={stripePromise} clientSecret={clientSecret} onCompletion={handleOnPayment} /> : (
        <Grid>
            {message && <Typography variant='body1' component={'div'} sx={{ mt: 2, textAlign: 'center' }}>{message}</Typography>}
            <Button size="small" color="primary" onClick={handleStartPayment}>
                Get Started
            </Button>
        </Grid>
    )
}