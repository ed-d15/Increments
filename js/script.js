let click_count = 0;
let pointsPerClick = 1;

let manualMultiplierLevel = 0;
const manualMultiplierUpgrades = [
    { cost: 20, newPPC: 2 },
    { cost: 100, newPPC: 5 },
    { cost: 500, newPPC: 10 },
    { cost: 2000, newPPC: 15 },
    { cost: 10000, newPPC: 20 }
];

let autoClicker;
let autoClickerOn = false;
let automaticMultiplierLevel = 0;
const automaticMultiplierUpgrades = [
    { cost: 100, newPPC: 1 },
    { cost: 500, newPPC: 2 },
    { cost: 1500, newPPC: 3 },
    { cost: 2500, newPPC: 5 },
    { cost: 5000, newPPC: 8 },
    { cost: 10000, newPPC: 10 }
]

window.addEventListener('load', function () {
    const clicker = document.getElementById('clicker');
    const scoreboard = document.getElementById('scoreboard');
    const manualMultiplier = document.getElementById('multiplier');
    const automaticMultiplier = document.getElementById('automaticClickerMultiplier');

    function addPoint(points) {
        click_count += points;
        scoreboard.innerHTML = click_count;
    }

    function manualMultiplierUpgrade(cost, newPPC) {
        if (click_count >= cost) {
            pointsPerClick = newPPC;
            click_count -= cost;
            manualMultiplierLevel++;
            scoreboard.innerHTML = click_count;
        }
    }

    function addAutomaticClicker(newPPC) {
        autoClicker = setInterval(() => addPoint(newPPC), 1000);
        autoClickerOn = true;
    }

    function stopAutomaticClicker() {
        clearInterval(autoClicker);
        autoClickerOn = false;
    }

    function automaticMultiplierUpgrade(cost, newPPC) {
        if (click_count >= cost) {
            click_count -= cost;
            scoreboard.innerHTML = click_count;

            if (autoClickerOn == true) {
                stopAutomaticClicker();
            }
            addAutomaticClicker(newPPC);

            automaticMultiplierLevel++;
        }
    }

    clicker.addEventListener('click', () => addPoint(pointsPerClick));
    manualMultiplier.addEventListener('click', () => manualMultiplierUpgrade(manualMultiplierUpgrades[manualMultiplierLevel].cost, manualMultiplierUpgrades[manualMultiplierLevel].newPPC));
    automaticMultiplier.addEventListener('click', () => automaticMultiplierUpgrade(automaticMultiplierUpgrades[automaticMultiplierLevel].cost, automaticMultiplierUpgrades[automaticMultiplierLevel].newPPC))
});