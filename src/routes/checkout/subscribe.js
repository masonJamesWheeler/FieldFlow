import { auth, db, app } from "../../lib/firebase"
import { getAuth } from "firebase/auth";
import { getDoc, getDocs, setDoc, doc, collection, query, where, onSnapshot, orderBy, limit, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getFormationNames, getPlayNames, getPlay } from "../../utils/stores"
import { onAuthStateChanged } from "firebase/auth";
import { createCheckoutSession } from "@stripe/firestore-stripe-payments";
import { getStripePayments } from "@stripe/firestore-stripe-payments";

// this is the page load function
let user = getAuth()?.currentUser;
let userLoaded = false;

const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    userLoaded = true;
    // ...
  } else {
    // we are not logged in
  }
});

export async function subscribe() {
  let user = await gitgetAuth()?.currentUser;
  const docRef = await addDoc(collection(db, "Users", user.uid, "checkout_sessions"), {
    price : "price_1MOzHPH4tqBFeYceXMEdVPbu",
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  }
  );
  const session =await createCheckoutSession(payments, {
    price: "price_1MOzHPH4tqBFeYceXMEdVPbu",
  });
  console.log(session)
  window.location.assign(session.url);
}

