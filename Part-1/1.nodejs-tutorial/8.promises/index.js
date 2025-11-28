/*
3️⃣ PROMISE — Introduction of Tokens

Restaurant upgrades the system.

Instead of asking for phone numbers…

The waiter gives you a token (Promise).

This token guarantees that:

If food is made → you’ll get a ✔️ resolve

If kitchen fails → ❌ reject

And the waiter says:

“When it’s done, check your token status.”

This is .then() and .catch().

✔️ Promise code version:
function cookBiryani() {
    return new Promise((resolve, reject) => {
        console.log("👨‍🍳 Cooking biryani...");

        setTimeout(() => {
            resolve("🍛 Biryani is ready!");
        }, 2000);
    });
}

cookBiryani()
    .then((msg) => console.log("Waiter:", msg))
    .catch((err) => console.log("Error:", err));

4️⃣ PROMISE CHAINING — Organized Waiting

You can now:

Wait for biryani → then salad → then drinks

in a clean chain.

Restaurant version:

The waiter says:

“After biryani finishes,
I will automatically order salad,
after salad → drinks…”

✔️ Promise Chain:
cookBiryani()
    .then(() => makeSalad())
    .then(() => bringDrinks())
    .then(() => cookDessert())
    .then(() => console.log("All food done!"))
    .catch((err) => console.log("Error:", err));

No chaos.

No nested waiters.
No callback hell.

*/

function delayLog(message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(message);
            resolve();
        }, 2000);
    });
}

function mypromise(ready) {
    return new Promise((resolve, reject) => {
        if (ready) {
            setTimeout(() => {
                resolve("We are ready for marriage");
            }, 2000);
        } else {
            reject("I need some time for marriage");
        }
    });
}

mypromise(true)
    .then(msg => delayLog(msg))
    .then(() => delayLog("Marriage Arranged"))
    .then(() => delayLog("We are ready for a baby"))
    .then(() => delayLog("Alhamdulillah, we are blessed with a baby"))
    .then(() => delayLog("We should buy a house"))
    .then(() => delayLog("Alhamdulillah, we bought the house"))
    .catch(err => console.log("❌ " + err));


