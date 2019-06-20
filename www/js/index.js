var chickens = 1;
var money = 10;
var eggs = 0;

var food = 1;   //max 100
var bigger_eggs_possibility = 1; //0 = 0%, 100 = 100%, bigger eggs = more money

var interval_eggs = (60 / (0.1 * food)) * 20;//ms * 20 ticks = ticks //max: alle 6 sekunden ein egg
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
    countdown();
    if(current_interval_eggs > interval_eggs) {
        current_interval_eggs = 0;
        interval_eggs = (60 / (0.1 * food)) * 20;
        layEggs();
    }

    document.querySelector("#status-chicken").innerHTML = chickens;
    document.querySelector("#status-money").innerHTML = parseFloat(money).toFixed(2);
    document.querySelector("#status-food").innerHTML = food;
    document.querySelector("#status-bep").innerHTML = bigger_eggs_possibility;

    document.querySelector("#upgrades-cost-ap").innerHTML = "(" + upgrade_auto_pickup + "$)";
    document.querySelector("#upgrades-cost-chicken").innerHTML = "(" + upgrade_chickens + "$)";
    document.querySelector("#upgrades-cost-bep").innerHTML = "(" + upgrade_bigger_eggs + "$)";
    document.querySelector("#upgrades-cost-food").innerHTML = "(" + upgrade_more_food + "$)";
    
    if(auto_pickup == true) {
        autoPickup();
    }

    current_interval_eggs++;
}, 50); //= 20 ticks/s or 50ms

async function countdown() {
    document.querySelector("#status-countdown").innerHTML = Math.round(interval_eggs/20) - Math.round(current_interval_eggs/20) + "s";
}

async function layEggs() {
    let rect = document.querySelector("#eggground").getBoundingClientRect();

    for(let i = 0; i<chickens; i++) {
        let rand = Math.random()*100;

        let posX = Math.floor((Math.random()*rect.width-25) + rect.left);
        let posY = Math.floor((Math.random()*rect.height-50) + rect.top);

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
            if(e.type == 1) {
                img.src = "img/eggs/egg_default.png";
            } else {
                img.src = "img/eggs/egg_gold.png";
            }
            img.style.left = e.posX + "px";
            img.style.top = e.posY + "px";
            img.classList.add("egg-img");
            img.setAttribute('type', e.type);
            img.addEventListener('click', function() {
                pickUpEgg(this);
            });
            document.querySelector("#eggground").appendChild(img);
            e.notDrawn = false;
            e.img = img;
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

async function autoPickup() {
    setTimeout(function() {
        if(eggs.length > 0) {
            pickUpEgg(eggs[0].img);
            autoPickup();
        }
    }, 300);
}

async function pickUpEgg(img) {
    let type = img.getAttribute('type');
    if(type == 1) {
        money+=reward_small_egg;
    } else if(type == 2) {
        money+=reward_big_egg;
    }
    img.parentNode.removeChild(img);

    $.each(eggs, function(i) {
        if(eggs[i].img == img) {
           eggs.splice(i,1);
           return false;
        }
    });

}

async function upgrade(type) {
    //0 = auto pickup
    //1 = chicken
    //2 = bigger egg
    //3 = food
    if(type == 0 && money >= upgrade_auto_pickup && !auto_pickup) {
        auto_pickup = true;
        money-=upgrade_auto_pickup;
    } else if(type == 1 && money >= upgrade_chickens) {
        chickens+=1;
        money-=upgrade_chickens;
        upgrade_chickens = parseFloat(upgrade_chickens*=1.41).toFixed(2);
    } else if(type == 2 && money >= upgrade_bigger_eggs && bigger_eggs_possibility < 100) {
        bigger_eggs_possibility+=1;
        money-=upgrade_bigger_eggs;
        upgrade_bigger_eggs = parseFloat(upgrade_bigger_eggs*=2.73).toFixed(2);
    } else if(type == 3 && money >= upgrade_more_food && food < 100) {
        food += 1;
        money-=upgrade_more_food;
        interval_eggs = (60 / (0.1 * food)) * 20 - current_interval_eggs;
        upgrade_more_food = parseFloat(upgrade_more_food*3.89).toFixed(2);
    }
}