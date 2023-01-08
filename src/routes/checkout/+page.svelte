<script lang="ts">
// import stripe
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { PUBLIC_STRIPE_KEY } from '../../lib/stores'
  
  // create a variable to hold the stripe object
  // create a variable to hold the public key
  let public_key = null
  let clientSecret = null
  let error = null
  let elements
  let processing = false


  </script>




 