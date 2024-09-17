import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function SetupForm({ onCompletion }) {

    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const { error, setupIntent } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/setup-complete`
            },
            redirect: 'if_required',
        });

        if (error) {
            onCompletion(error.message)
        }
        else if (setupIntent?.status === 'succeeded') {
            onCompletion("You payment method has been saved")
        }
        else {
            onCompletion("Unexpected state");
        }

        setProcessing(false);
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '20px auto 0' }}>
            <PaymentElement />
            {!processing ? <button type='submit' style={{ marginTop: 20, borderColor: '#ccc' }} disabled={processing}>{processing ? "Processing..." : "Save Card"}</button> : <></>}
        </form>
    );
};
