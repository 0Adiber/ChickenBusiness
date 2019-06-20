var chickens = 1;
var money = 0;
var eggs = 0;

var interval_eggs = 60 * 20;//ms * 20 ticks = ticks
var bigger_eggs_possibility = 0; //0 = 0%, 100 = 100%, bigger eggs = more money
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
    let c = document.getElementById("eggground");
    let ctx = c.getContext('2d');
    let img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 1, 1, 50, 50);
    };
    img.src = "./img/egg.png";  

    /*
    for(let e of eggs) {
        if(e.notDrawn) {
            let img = document.createElement("img");
            img.src = "img/egg.png";
            img.style.left = e.posX + "px";
            img.style.top = e.posY + "px";
            img.classList.add("egg-img");
            console.log(e.posX + "," + e.posY + "," + img.classList)
            document.querySelector("#eggground").appendChild(img);
            e.notDrawn = false;
        }
    }*/
}

let inUpgradeScreen = false;
async function showUpgrades() {
    if(inUpgradeScreen == false) {
        document.querySelector("#upgrades-screen").style.height = "100%";
        inUpgradeScreen = true;
    } else {
        document.querySelector("#upgrades-screen").style.height = "10%";
        inUpgradeScreen = false;
    }

    let upgrades = document.getElementsByClassName("upgrades-item");
    for(let u in upgrades) {
        u.style.display = "block";
    }
    document.querySelector(".upgrades-row").style.display = "flex";
}

async function pickUpEgg(type) {
    if(type == 1) {
        money+=reward_small_egg;
    } else if(type == 2) {
        money+=reward_big_egg;
    }
}