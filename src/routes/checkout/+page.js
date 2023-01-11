import Stripe from 'stripe';
import {auth, db } from "../../lib/firebase"
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

// this is the page load function

let user = getAuth()?.currentUser;
let userLoaded = false;
const stripe = await new Stripe('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');




  onAuthStateChanged(auth, (user) => {
  if (user && stripe != null) {
    userLoaded = true;
    // ...
  } else {
    // we are not logged in
  }
});

export const load = (async ({ params }) => {
    // if we have a user then we want to pass the user to the page
    if (userLoaded && user.uid != null) {
      const stripe = await new Stripe('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');
      const paymentElement = stripe.elements();
      const cardElement = paymentElement.create('card');
      cardElement.mount('#card-element');
      const customerId = user.uid;
      const productId = 'prod_N8QwheDaVrC054';
      const intent = await stripe.paymentIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        setup_future_usage: 'off_session',
        subscription_data: {
          items: [{ product: productId }],
        },
        confirm: true,
      });
      console.log(intent)
      return { props : { stripe, intent, cardElement } };
    }
})



