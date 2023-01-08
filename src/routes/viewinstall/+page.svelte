<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import type { PageLoad } from './$types';

export let data;
console.log(data)

// initialize stastistics
let numberpasses = 0
let numberruns = 0
let formations = new Map()


onMount( () => {

    // iterate over the plays in the install and change the statistics
    console.log(data)
    data.props.installData.plays.forEach(play => {
        if (play.run_pass == "Pass") {
            numberpasses += 1
        } else if (play.run_pass == "Run"){
            numberruns += 1
        }
        // add the formation to the map
        formations.set(play.formation, 1)
        formations = formations
    })


})

// a function to get the 

</script>
<div class = "min-h-screen w-full bg-gradient-to-b from-slate-800 to-slate-700">
    <div class = "grid grid-cols-3 h-full w-full">
        <!-- span the entire first row of columns with a title and statistics of the install -->
        <div class = "col-span-3 mx-auto">
        <div class="stats shadow h-48 my-auto">
            <div class="stat place-items-center ">
                <div class="stat-title">Total Passes</div>
                <div class="stat-value text-indigo-700">{numberpasses}</div>
                <div class="stat-desc"># NEW</div>
            </div>

            <div class="stat place-items-center">
                <div class="stat-title">Total Runs</div>
                <div class="stat-value text-indigo-700">{numberruns}</div>
                <div class="stat-desc"># NEW</div>
            </div>

            <div class="stat place-items-center">
                <div class="stat-title">Total Formations</div>
                <div class="stat-value text-indigo-700">{formations.size}</div>
                <div class="stat-desc"># NEW</div>
            </div>
        </div>
        </div>

    </div>

</div>