import Stripe from 'stripe';
import type { Actions } from './$types';
import { auth } from '../../lib/firebase';



// get the current user
const user = auth?.currentUser;

export const actions: Actions = {
    handlePayment: async (event) => {
        console.log('hello')
        const stripe = new Stripe("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", {
            apiVersion: '2022-11-15',
        });

        // if (user) {
            let usersEmail = "masonwheeler1225@gmail.com"
            // if user's email is null or undefined throw an error
                // create customer information for the customer
                const customer = await stripe.customers.create({
                    email: usersEmail,
                });
                console.log(usersEmail)
                // create a subscription for the customer
                const subscription = await stripe.subscriptions.create({
                    customer: customer.id,
                    items: [
                        {
                            price: 'price_1MOzHPH4tqBFeYceXMEdVPbu',
                        },
                    ],
                    payment_behavior: 'default_incomplete',
                    payment_settings: { save_default_payment_method: 'on_subscription' },
                    expand: ['latest_invoice.payment_intent'],
                });
                if (subscription.latest_invoice != null) {
                    let latestInvoice = subscription.latest_invoice as any;
                    if (latestInvoice.payment_intent != null) {
                        let paymentIntent = latestInvoice.payment_intent as any;
                        console.log(paymentIntent.client_secret)
                        return { subscription_id: subscription.id, client_secret: paymentIntent.client_secret };

                    }
                 
                }
            }
        }
    // };



