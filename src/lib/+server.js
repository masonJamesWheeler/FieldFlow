import Stripe from 'stripe';
let SECRET_STRIPE_KEY = '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'
const stripe = new Stripe(SECRET_STRIPE_KEY)

export async function Post() {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: 'usd',
        payment_method_types: ['card'],
    });
    return json({
    
        clientSecret: paymentIntent.client_secret
        
    });
}
