/**
 5️⃣ ASYNC/AWAIT — VIP Mode

This is the smoothest and cleanest system.

Restaurant hires a VIP waiter.

You simply say:

“Bring biryani.
I will wait here.”

No tokens.
No chains.
Just a comfortable sit-and-wait system.

✔️ async/await version:
async function eat() {
    try {
        const biryani = await cookBiryani();
        const salad = await makeSalad();
        const drinks = await bringDrinks();
        const dessert = await cookDessert();

        console.log("All food served!");
    } catch (err) {
        console.log("Error:", err);
    }
}

eat();

It reads like real-world instructions:
Wait for biryani
Wait for salad
Wait for drinks
Wait for dessert
Done


This is why async/await is the most loved.
 */

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mypromise(ready) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (ready) {
                resolve("We are ready for marriage");
            } else {
                reject("I need some time for marriage");
            }
        }, 2000);
    });
}

async function life() {
    try {
        const msg = await mypromise(true);
        console.log(msg);

        await delay(2000);
        console.log("Marriage Arranged");

        await delay(2000);
        console.log("We are ready for a baby");

        await delay(2000);
        console.log("Alhamdulillah, we are blessed with a baby");

        await delay(2000);
        console.log("We should buy a house");

        await delay(2000);
        console.log("Alhamdulillah, we are blessed with a house");
    } catch (err) {
        console.log("❌ " + err);
    }
}

life();
