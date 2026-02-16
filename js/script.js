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
];
let automaticTimerLevel = 0;
const automaticTimerUpgrades = [
    { cost: 100, newTimer: 950 },
    { cost: 1000, newTimer: 900 },
    { cost: 5000, newTimer: 850 },
    { cost: 7500, newTimer: 800 },
    { cost: 12500, newTimer: 750 }
];

window.addEventListener('load', function () {
    const clicker = document.getElementById('clicker');
    const scoreboard = document.getElementById('scoreboard');
    const manualMultiplier = document.getElementById('multiplier');
    const automaticMultiplier = document.getElementById('automaticMultiplier');
    const automaticTimer = document.getElementById('automaticTimer');

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

    function addAutomaticClicker(PPC, timer) {
        autoClicker = setInterval(() => addPoint(PPC), timer);
        autoClickerOn = true;
    }

    function stopAutomaticClicker() {
        clearInterval(autoClicker);
        autoClickerOn = false;
    }

    function automaticMultiplierUpgrade(cost, PPC, timer) {
        if (click_count >= cost) {
            click_count -= cost;
            scoreboard.innerHTML = click_count;

            if (autoClickerOn == true) {
                stopAutomaticClicker();
            } else {
                automaticMultiplier.innerHTML = 'Auto Clicker Multiplier Upgrade';
                automaticTimer.style.visibility = 'visible';
            }
            addAutomaticClicker(PPC, timer);

            automaticMultiplierLevel++;
        }
    }

    function automaticTimerUpgrade(cost, PPC, timer) {
        if (click_count >= cost) {
            click_count -= cost;
            scoreboard.innerHTML = click_count;

            stopAutomaticClicker();
            addAutomaticClicker(PPC, timer);
            
            automaticTimerLevel++;
        }
    }

    clicker.addEventListener('click', () => addPoint(pointsPerClick));
    manualMultiplier.addEventListener('click', () => manualMultiplierUpgrade(manualMultiplierUpgrades[manualMultiplierLevel].cost, manualMultiplierUpgrades[manualMultiplierLevel].newPPC));
    automaticMultiplier.addEventListener('click', () => automaticMultiplierUpgrade(automaticMultiplierUpgrades[automaticMultiplierLevel].cost, automaticMultiplierUpgrades[automaticMultiplierLevel].newPPC, automaticTimerUpgrades[automaticTimerLevel].newTimer));
    automaticTimer.addEventListener('click', () => automaticTimerUpgrade(automaticTimerUpgrades[automaticTimerLevel].cost, automaticMultiplierUpgrades[automaticMultiplierLevel-1].newPPC, automaticTimerUpgrades[automaticTimerLevel].newTimer));
});