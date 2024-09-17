import * as React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import { Button, CardActions } from '@mui/material';
import { AppContext } from '../../state/AppContext';

function StartCheckout({ stripePromise, clientSecret, onCompletion }) {

  return clientSecret ? (
    <Elements stripe={stripePromise} options={clientSecret}>
      <CheckoutForm onCompletion={onCompletion} />
    </Elements>
  ) : (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  )
};

function showAlert({ severity, message }) {

  return (
    <Alert severity={severity}>{message}</Alert>
  );
}

const tiers = [{
  title: 'Newbie',
  amount: 'Free',
  about: 'only your last location played results are saved'
},
{
  title: 'Enthusiast',
  amount: '$5 monthly',
  about: 'With a subscription, your scores get saved and you can watch your improvements as you keep playing. Try now with the first 7 days free. Cancel any time'
},
{
  title: 'Visionary',
  amount: '$25 for 6 months',
  about: 'An enthusiast for the long haul. Pay 6 months in advance and get one of them free. Why not save when you know you can anyway?'
}]

export default function PaymentForm() {

  const [paying, setPaying] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState('')
  const { stripePromise, createPaymentIntent } = React.useContext(AppContext);
  const [message, setMessage] = React.useState('xscs')

  function handleStartPayment() {
    createPaymentIntent({ amount: 5700 }).then(setClientSecret);
    setPaying(true);
  }

  function handleOnPayment(message) {
    setMessage(message);
    setPaying(false);
  }

  return (
    paying ?
      (<StartCheckout stripePromise={stripePromise} clientSecret={clientSecret} onCompletion={handleOnPayment} />)
      : (<Grid>
        {message && showAlert({ severity: 'success', message })}
        <div style={{ display: 'flex', flexDirection: 'row', columnGap: 20 }}>{tiers.map((tier) =>
          <Card style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column' }} key={tier.title}>
            <CardContent sx={{ flex: 1 }}>
              <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
                {tier.title}
              </Typography>
              <Typography gutterBottom variant="h6" component="div" sx={{ mb: 3, fontStyle: 'italic' }}>
                {tier.amount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tier.about}
              </Typography>
            </CardContent>
            <CardActions sx={{}}>
              <Button size="small" color="primary" onClick={handleStartPayment}>
                Get Started
              </Button>
            </CardActions>
          </Card>)
        }
        </div>
      </Grid>)
  );
}