<script>
  // import stripe
  import { loadStripe } from '@stripe/stripe-js';
  import { CardElement, Elements } from '@stripe/react-stripe-js';
  

const appearance = {
  theme: 'stripe'
};

// Pass the appearance object to the Elements instance
const elements = stripe.elements({clientSecret, appearance});
</script>