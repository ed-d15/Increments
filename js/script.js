let click_count = 0;
let pointsPerClick = 1;

multiplierLevel = 0;
const multiplierUpgrades = [
    { cost: 20, newPPC: 2 },
    { cost: 100, newPPC: 5 },
    { cost: 500, newPPC: 10 },
    { cost: 2000, newPPC: 15 },
    { cost: 10000, newPPC: 20 }
];

window.addEventListener('load', function () {
    const clicker = document.getElementById('clicker');
    const scoreboard = document.getElementById('scoreboard');
    const multiplier = document.getElementById('multiplier');

    function addPoint() {
        click_count += pointsPerClick;
        scoreboard.innerHTML = click_count;
    }

    function multiplierUpgrade() {
        if (click_count >= multiplierUpgrades[multiplierLevel].cost) {
            pointsPerClick = multiplierUpgrades[multiplierLevel].newPPC;
            click_count -= multiplierUpgrades[multiplierLevel].cost;
            multiplierLevel++;
            scoreboard.innerHTML = click_count;
        }
    }

    clicker.addEventListener('click', () => addPoint());
    multiplier.addEventListener('click', () => multiplierUpgrade())
});