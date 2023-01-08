<script lang="ts">



// create a array to keep track of the active tab, three total tabs
let tabs = ["", "border-8 border-indigo-700", ""]
// prices for tabs, monthly and annually
let prices = [
    ["FREE"],
    ["$30/mo"],
    ["$100/mo"]
]
// monthly and annually toggle array
let toggle = ["bg-gray-100 text-black", "bg-indigo-700 text-white"]

// function to change the toggle
function changeToggleYearly() {
    // change the toggle
    toggle = ["bg-indigo-700 text-white", "bg-gray-100 text-black"]
    // change the prices
    prices = [
        ["FREE"],
        ["$300/yr"],
        ["$1000/yr"]
    ]
}

// function to change the toggle
function changeToggleMonthly() {
    // change the toggle
    toggle = ["bg-gray-100 text-black", "bg-indigo-700 text-white"]
    // change the prices
    prices = [
        ["FREE"],
        ["$30/mo"],
        ["$100/mo"]
    ]
}
// function to check what the current toggle is and then change it
function changeToggle() {
    //check if the toggle is monthly
    console.log(toggle[0])
    if (toggle[0] == "bg-gray-100 text-black") {
        // change the toggle
        changeToggleYearly()
    } else {
        // change the toggle
        changeToggleMonthly()
    }
}
function changeTab(tab) {
    // change the active tab
    tabs = ["", "", ""]
    tabs[tab] = "border-8 border-indigo-700"
}



</script>

<!-- create the second part of the sign up page -->
<!--  let the user input their team Names as well as select from a range -->
<!--  of numbers of plays, and the features that they would like -->
<!--  then reccomend different tiers based on these  -->

<div class = "min-h-screen w-full flex bg-gradient-to-r from-slate-800 to-slate-700">
    <div class="lg:flex items-center justify-between my-auto mx-auto">
        <div class="lg:w-1/2 w-full">
            <p class=" leading-4 text-white">Choose your plan</p>
            <h1  class="md:text-5xl text-3xl font-bold leading-10 mt-3 bg-gradient-to-r to-rose-600 from-indigo-600 bg-clip-text text-transparent py-4">Our Pricing</h1>
            <p role="contentinfo" class="text-base leading-5 mt-5 text-white">Our pricing options are designed to give you the flexibility to choose the features that best meet your needs.

            </p>
            <div class="w-56">
                <button class="bg-gray-100 shadow rounded-full flex items-center mt-10" on:click={() => changeToggle()}>
                    <div class=" focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none text-base leading-none  rounded-full py-4 px-6 mr-1 {toggle[0]}" id="monthly">Monthly</div>
                    <div class=" focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none text-base leading-none rounded-full py-4 px-6 {toggle[1]} " id="annually"  >Annually</div>
                </button>
            </div>
        </div>
        <div class="xl:w-1/2 lg:w-7/12 relative w-full lg:mt-0 mt-12 md:px-8" role="list">
            <img src="https://i.ibb.co/0n6DSS3/bgimg.png" class="absolute w-full -ml-12 mt-24" alt="background circle images" />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="bg-white cursor-pointer shadow rounded-lg p-8 relative z-30 {tabs[0]}" on:click={() => changeTab(0)}>
                <div class="md:flex items-center justify-between">
                    <h2 class="text-2xl font-semibold leading-6 text-gray-800">Starter</h2>
                    <p class="text-2xl font-semibold md:mt-0 mt-4 leading-6 text-gray-800">{prices[0]}</p>
                </div>
                <ul class="md:w-80 text-base leading-6 mt-4 text-gray-600 list-disc">
                    <li>Limited access to library of drawing utilities</li>
                    <li>Limited access to auto-alignment features</li>
                </ul>
                </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="bg-white cursor-pointer shadow rounded-lg mt-3 flex relative z-30 {tabs[1]}" on:click={() => changeTab(1)}>
                <div class="w-2.5 h-auto  rounded-tl-md rounded-bl-md"></div>
                <div class="w-full p-8">
                    <div class="md:flex items-center justify-between">
                        <h2 class="text-2xl font-semibold leading-6 text-gray-800">Personal</h2>
                        <p class="text-2xl md:mt-0 mt-4 font-semibold leading-6 text-gray-800"><span class="font-normal text-base">{prices[1]}</span></p>
                    </div>
                    <ul class="md:w-80 text-base leading-6 mt-4 text-gray-600 list-disc">
                        <li>Access to full library of drawing utilities</li>
                        <li>Unlimited Storage of Plays</li>
                        <li>Access to Script and Install Creation features</li>
                        <li>Access to Playbook Creation features</li>
                        <li>Scout Card Auto-Alignment - Dozens of loaded fronts and coverages </li>
                        

                    </ul>
                </div>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="bg-white cursor-pointer shadow rounded-lg p-8 relative z-30 mt-7 {tabs[2]}" on:click={() => changeTab(2)}>
                <div class="md:flex items-center justify-between">
                    <h2 class="text-2xl font-semibold leading-6 text-gray-800">Team</h2>
                    <p class="text-2xl md:mt-0 mt-4 font-semibold leading-6 text-gray-800"><span class="font-normal text-base">{prices[2]}</span></p>
                </div>
                <ul class="md:w-80 text-base leading-6 mt-4 text-gray-600 list-disc">
                    <li>Access to all above features</li>
                    <li>Add up to 150 Athletes and Coaches</li>
                    <li>Unlimited usage of Playbook, Install, and Script sharing features</li>
                    <li>Export Installs and Scripts to PDF, PowerPoint, and More </li>
                    <li>Learning and Studying tools</li>

                </ul>
                </div>
            <div class="lg:w-1/2 w-full">
                <div class="w-56">
                    <a href = "/checkout" class="bg-indigo-700 shadow rounded-full flex items-center mt-10">
                        <div class=" focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:outline-none text-base leading-none  rounded-full py-4 px-6 mr-1 text-white" id="monthly">Continue</div>
                    </a>
                </div>
                </div>
        </div>
    </div>
    

</div>