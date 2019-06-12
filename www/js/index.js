var chickens = 1;
var money = 0;
var eggs = 0;

var multiplier_eggs = 1; //1 = 100%
var intervall_eggs = 60000 * 20;//ms * 20 ticks = ticks
var bigger_eggs_possibility = 0; //0 = 0%, 100 = 100%, bigger eggs = more money
var auto_pickup = false;

//upgrades = cost
var upgrade_chickens = 10; //increases per buy; increases chicken count
var upgrade_bigger_eggs = 100; //incrreases per buy; increases bigger_eggs_possibility
var upgrade_more_food = 50; //increases per buy; decreaes intervall_eggs
var upgrade_auto_pickup = 1000;//one-time; sets auto_pickup to true

var current_intervall_eggs = 0;
var game = setInterval(function doGameTick() {
    if(current_intervall_eggs > intervall_eggs) {
        current_intervall_eggs = 0;
        layEgg();
    } else {
        current_intervall_eggs++;
    }
    
}, 50); //= 20 ticks/s or 50ms

async function layEgg() {
    let eggs = {};
    for(let i = 0; i<chickens; i++) {
        let rand = Math.random()*100;
        if(rand < bigger_eggs_possibility) {
            eggs[i] = 2;
        } else {
            eggs[i] = 1;
        }
    }
}