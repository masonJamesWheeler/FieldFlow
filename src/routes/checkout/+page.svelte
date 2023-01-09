<script lang="ts">
	import { loadStripe } from '@stripe/stripe-js';
	import { Elements, PaymentElement, LinkAuthenticationElement, Address} from 'svelte-stripe';
	import { onMount } from 'svelte';
  import {goto} from '$app/navigation';


  let stripe = null
  let clientSecret = null
  let error = null
  let elements
  let processing = false

	let PUBLIC_STRIPE_KEY =
		'pk_test_51MO4VQH4tqBFeYcemctybvlz6MhhW4qZuHV2dlr0lkhv3mutEa5K2glXdByLAByRRh9JDAjFBPyyAYCpuIvhCYdt00X7EvbjPw';
  onMount (async () => {
    stripe = await loadStripe(PUBLIC_STRIPE_KEY);
    clientSecret = await createPaymentIntent()

  });

  async function createPaymentIntent() {
    const response = await fetch('/stripeAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1000
      })
    })
  }

  async function submit() {
    // avoid processing duplicates
    if (processing) return
    processing = true
    // confirm payment with stripe
    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    })
    // log results, for debugging
    console.log({ result })
    if (result.error) {
      // payment failed, notify user
      error = result.error
      processing = false
    } else {
      // payment succeeded, redirect to "thank you" page
      goto('/')
    }
  }

</script>

{#if error}
  <p class="error">{error.message} Please try again.</p>
{/if}

{#if stripe && clientSecret}
  <Elements
    {stripe}
    {clientSecret}
    theme="flat"
    labels="floating"
    variables={{ colorPrimary: '#7c4dff' }}
    rules={{ '.Input': { border: 'solid 1px #0002' } }}
    bind:elements
  >
    <form on:submit|preventDefault={submit}>
      <LinkAuthenticationElement />
      <PaymentElement />

      <button disabled={processing}>
        {#if processing}
          Processing...
        {:else}
          Pay
        {/if}
      </button>
    </form>
  </Elements>
{:else}
  Loading...
{/if}

<style>
  .error {
    color: tomato;
    margin: 2rem 0 0;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 2rem 0;
  }
  button {
    padding: 1rem;
    border-radius: 5px;
    border: solid 1px #ccc;
    color: white;
    background: var(--link-color);
    font-size: 1.2rem;
    margin: 1rem 0;
  }
</style>
