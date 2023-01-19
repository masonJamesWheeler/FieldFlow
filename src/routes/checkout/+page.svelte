<script lang="ts">
    import { onMount } from "svelte";
    import { loadStripe } from "@stripe/stripe-js";
    import type { ActionData } from "./$types";

    let stripe;
    //check if form exists
    export let form: ActionData;
    console.log(form)
    // add stripe appearance
    const appearance = {
        theme: "stripe" as const,
        labels: 'floating' as const,

    };

    onMount(async () => {
        stripe = await loadStripe(
            "pk_live_51MO4VQH4tqBFeYcelvXv9DEMt7u3yWnDxjIjI5oQc85q7sOgPheOs8eR7oPGDl8aL4SLt4XfjXFob1hhQLds8iob00gKVuGqec",
            {
                apiVersion: "2022-11-15",
            }
        );
        // if the form exists, create a stripe payment element
        if (form != null && stripe != null && form.client_secret != null) {
            let clientSecret = form.client_secret;
            console.log(clientSecret);
            const elements = stripe.elements({ clientSecret, appearance });
            const paymentElement = elements.create("payment", {
                layout: {
                    type: "tabs",
                    defaultCollapsed: false,
                },
            });
            paymentElement.mount("#payment-element");
        }
    });

    if (form != null) {
        // create a stripe payment element
    }
</script>

<!-- create a checkout button with stripe -->
<div class = "w-full h-full grid">
<form method="POST" action="?/handlePayment">
    <button class="btn btn-primary"> Checkout</button>
</form>

{#if form != null}
    <form id="payment-form" class=" w-3/5 p-8 rounded-3xl bg-white mx-auto">
        <div id="payment-element">
            <!-- Elements will create form elements here -->
        </div>
        <button id="submit">Submit</button>
        <div id="error-message">
            <!-- Display error message to your customers here -->
        </div>
    </form>
{/if}
</div>