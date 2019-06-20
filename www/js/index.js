var chickens = 1;
var money = 0;
var eggs = 0;

var food = 0;   //max 100
var bigger_eggs_possibility = 0; //0 = 0%, 100 = 100%, bigger eggs = more money

var interval_eggs = (60 / (0.01 * food)) * 20;//ms * 20 ticks = ticks //max: alle 6 sekunden ein egg
var auto_pickup = false;

//
var reward_small_egg = 5;
var reward_big_egg = 7;

//upgrades = cost
var upgrade_chickens = 10; //increases per buy; increases chicken count
var upgrade_bigger_eggs = 100; //incrreases per buy; increases bigger_eggs_possibility
var upgrade_more_food = 50; //increases per buy; decreaes intervall_eggs
var upgrade_auto_pickup = 1000;//one-time; sets auto_pickup to true

//current eggs
var eggs = [];

//Main
var current_interval_eggs = 0;
var game = setInterval(function doGameTick() {
    if(current_interval_eggs > interval_eggs) {
        current_interval_eggs = 0;
        layEggs();
    }

    document.querySelector("#status-chicken").innerHTML = chickens;
    document.querySelector("#status-money").innerHTML = money;
    document.querySelector("#status-food").innerHTML = food;
    document.querySelector("#status-bep").innerHTML = bigger_eggs_possibility;
    
    current_interval_eggs++;
}, 50); //= 20 ticks/s or 50ms

async function layEggs() {
    let rect = document.querySelector("#eggground").getBoundingClientRect();

    for(let i = 0; i<chickens; i++) {
        let rand = Math.random()*100;

        let posX = Math.floor((Math.random()*rect.width) + rect.left);
        let posY = Math.floor((Math.random()*rect.height) + rect.top);

        if(rand < bigger_eggs_possibility) {
            eggs.push(new Egg(2, posX, posY));
        } else {
            eggs.push(new Egg(1, posX, posY));
        }
    }
    drawEggs();
}

function drawEggs() {
    for(let e of eggs) {
        if(e.notDrawn) {
            let img = document.createElement("img");
            img.src = "img/egg.png";
            img.style.left = e.posX + "px";
            img.style.top = e.posY + "px";
            img.classList.add("egg-img");
            img.setAttribute('type', e.type);
            img.addEventListener('click', function() {
                pickUpEgg(this);
            });
            console.log(e.posX + "," + e.posY + "," + img.classList)
            document.querySelector("#eggground").appendChild(img);
            e.notDrawn = false;
        }
    }
}

let inUpgradeScreen = false;
async function showUpgrades() {
    if(inUpgradeScreen == false) {
        document.querySelector("#upgrades-screen").style.height = "100%";
        document.querySelector("#upgrades-column").style.height = "calc(100% - 100px)";

        let upgrades = document.getElementsByClassName("upgrades-item");
        for(let u of upgrades) {
            u.style.height = "calc((100vh - 100px) / 4)";
        }

        inUpgradeScreen = true;
    } else {
        document.querySelector("#upgrades-screen").style.height = "10%";
        document.querySelector("#upgrades-column").style.height = "100%";

        let upgrades = document.getElementsByClassName("upgrades-item");
        for(let u of upgrades) {
            u.style.height = "calc(100px / 4)";
        }

        inUpgradeScreen = false;
    }
}

async function pickUpEgg(img) {
    let type = img.getAttribute('type');
    if(type == 1) {
        money+=reward_small_egg;
    } else if(type == 2) {
        money+=reward_big_egg;
    }
    img.parentNode.removeChild(img);
}