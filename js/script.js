let click_count = 0;
let pointsPerClick = 1;
let totalUpgradesBought = 0;
let manualClickCount = 0;

let manualMultiplierLevel = 0;
const manualMultiplierUpgrades = [
    { cost: 20, newPPC: 2 },
    { cost: 60, newPPC: 3 },
    { cost: 180, newPPC: 5 },
    { cost: 540, newPPC: 8 },
    { cost: 1600, newPPC: 12 },
    { cost: 4800, newPPC: 18 },
    { cost: 14500, newPPC: 27 },
    { cost: 44000, newPPC: 40 },
    { cost: 133000, newPPC: 60 },
    { cost: 400000, newPPC: 90 },
    { cost: 1200000, newPPC: 135 },
    { cost: 3600000, newPPC: 200 }
];

let autoClicker;
let autoClickerOn = false;
let automaticMultiplierLevel = 0;
const automaticMultiplierUpgrades = [
    { cost: 100, newPPC: 1 },
    { cost: 250, newPPC: 2 },
    { cost: 750, newPPC: 3 },
    { cost: 2000, newPPC: 5 },
    { cost: 6000, newPPC: 8 },
    { cost: 18000, newPPC: 12 },
    { cost: 54000, newPPC: 18 },
    { cost: 160000, newPPC: 27 },
    { cost: 480000, newPPC: 40 },
    { cost: 1450000, newPPC: 60 },
    { cost: 4350000, newPPC: 90 },
    { cost: 13000000, newPPC: 120 }
];

let automaticTimerLevel = 0;
const automaticTimerUpgrades = [
    { cost: 500, newTimer: 1000 },
    { cost: 2000, newTimer: 900 },
    { cost: 8000, newTimer: 800 },
    { cost: 25000, newTimer: 700 },
    { cost: 80000, newTimer: 600 },
    { cost: 250000, newTimer: 500 },
    { cost: 800000, newTimer: 400 },
    { cost: 2500000, newTimer: 320 },
    { cost: 8000000, newTimer: 260 },
    { cost: 25000000, newTimer: 200 }
];

function getCurrentAutoPPC() {
    if (automaticMultiplierLevel > 0) {
        return automaticMultiplierUpgrades[automaticMultiplierLevel - 1].newPPC;
    }
    return 0;
}

function getCurrentAutoTimer() {
    if (automaticTimerLevel > 0) {
        return automaticTimerUpgrades[automaticTimerLevel - 1].newTimer;
    }
    return 1000;
}

const achievements = [
    // Click number based
    { id: 'first_click', label: 'First Click', earned: false, check: () => manualClickCount >= 1 },
    { id: 'click_apprentice', label: '50 Manual Clicks', earned: false, check: () => manualClickCount >= 50 },
    { id: 'click_enthusiast', label: '250 Manual Clicks', earned: false, check: () => manualClickCount >= 250 },
    { id: 'click_machine', label: '1000 Manual Clicks', earned: false, check: () => manualClickCount >= 1000 },

    // Point number based
    { id: 'getting_rich', label: '100 Resources', earned: false, check: () => click_count >= 100 },
    { id: 'high_roller', label: '1000 Resources', earned: false, check: () => click_count >= 1000 },
    { id: 'resource_tycoon', label: '10000 Resources', earned: false, check: () => click_count >= 10000 },
    { id: 'resource_magnet', label: '100000 Resources', earned: false, check: () => click_count >= 100000 },

    // Upgrade amount based
    { id: 'upgrade_beginner', label: 'First Upgrade', earned: false, check: () => totalUpgradesBought >= 1 },
    { id: 'upgrade_shopper', label: 'Buy 5 Upgrades', earned: false, check: () => totalUpgradesBought >= 5 },
    { id: 'upgrade_collector', label: 'Buy 10 Upgrades', earned: false, check: () => totalUpgradesBought >= 10 },

    // Manual upgrades based
    { id: 'finger_training', label: 'Manual PPC ≥ 3', earned: false, check: () => pointsPerClick >= 3 },
    { id: 'iron_fingers', label: 'Manual PPC ≥ 12', earned: false, check: () => pointsPerClick >= 12 },
    { id: 'thunder_clicks', label: 'Manual PPC ≥ 40', earned: false, check: () => pointsPerClick >= 40 },
    { id: 'typhoon_clicks', label: 'Manual PPC ≥ 135', earned: false, check: () => pointsPerClick >= 135 },

    // Automatic multiplier upgrades based
    { id: 'auto_unlocked', label: 'Auto-Clicker Unlocked', earned: false, check: () => autoClickerOn === true },
    { id: 'auto_power_1', label: 'Auto PPC ≥ 3', earned: false, check: () => getCurrentAutoPPC() >= 3 },
    { id: 'auto_power_2', label: 'Auto PPC ≥ 12', earned: false, check: () => getCurrentAutoPPC() >= 12 },
    { id: 'auto_power_3', label: 'Auto PPC ≥ 27', earned: false, check: () => getCurrentAutoPPC() >= 27 },

    // Automatic timer upgrades based
    { id: 'auto_speed_1', label: 'Auto Timer ≤ 800ms', earned: false, check: () => getCurrentAutoTimer() !== null && getCurrentAutoTimer() <= 800 },
    { id: 'auto_speed_2', label: 'Auto Timer ≤ 500ms', earned: false, check: () => getCurrentAutoTimer() !== null && getCurrentAutoTimer() <= 500 },
    { id: 'auto_speed_3', label: 'Auto Timer ≤ 320ms', earned: false, check: () => getCurrentAutoTimer() !== null && getCurrentAutoTimer() <= 320 },

    // Completing Upgrades based
    { id: 'manual_maxed', label: 'Manual Multiplier Maxed', earned: false, check: () => manualMultiplierLevel >= manualMultiplierUpgrades.length },
    { id: 'auto_multiplier_maxed', label: 'Auto Multiplier Maxed', earned: false, check: () => automaticMultiplierLevel >= automaticMultiplierUpgrades.length },
    { id: 'auto_timer_maxed', label: 'Auto Timer Maxed', earned: false, check: () => automaticTimerLevel >= automaticTimerUpgrades.length }
];

window.addEventListener('load', function () {
    const clicker = document.getElementById('clicker');
    const scoreboard = document.getElementById('scoreboard');
    const manualPPC = document.getElementById('manualPPC');
    const manualMultiplier = document.getElementById('multiplier');
    const automaticMultiplier = document.getElementById('automaticMultiplier');
    const automaticTimer = document.getElementById('automaticTimer');
    const achievementsList = document.getElementById('achievementsList');
    const congratsPopup = document.getElementById('congratsPopup');
    const helpBtn = document.getElementById('helpBtn');
    const helpPanel = document.getElementById('helpPanel');
    const closeHelp = document.getElementById('closeHelp');

    const c = document.getElementById('mineCanvas');
    const ctx = c.getContext('2d', { alpha: false });
    const beltY = 80;
    const beltHeight = 26;
    const ores = [];
    let spawn = 0;

    function addPoint(points) {
        click_count += points;
        scoreboard.innerHTML = click_count;
        checkAchievements();
    }

    function changeManualPPC () {
        manualPPC.innerHTML = `Manual PPC: ${pointsPerClick}`;
    }

    let congratsTimeout;
    function showCongrats(msg) {
        congratsPopup.innerHTML = msg;
        congratsPopup.classList.remove('hidden');
        clearTimeout(congratsTimeout);
        congratsTimeout = setTimeout(() => congratsPopup.classList.add('hidden'), 3000);
    }

    function checkAchievements() {
        achievements.forEach(a => {
            if (!a.earned && a.check()) {
                a.earned = true;
                const badge = document.createElement('div');
                badge.classList.add('achievement', 'achievement-enter');
                badge.innerHTML = a.label;
                achievementsList.prepend(badge);
                showCongrats('Achievement Unlocked: ' + a.label);
            }
        });
    }

    function canBuy(next, currency) {
        return next && currency >= next.cost;
    }

    function manualMultiplierUpgrade(cost, newPPC) {
        if (!manualMultiplierUpgrades[manualMultiplierLevel]) return;
        if (canBuy(manualMultiplierUpgrades[manualMultiplierLevel], click_count)) {
            pointsPerClick = newPPC;
            click_count -= cost;
            manualMultiplierLevel++;
            scoreboard.innerHTML = click_count;
            totalUpgradesBought++
            updateButtons();
            changeManualPPC();
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
        if (!automaticMultiplierUpgrades[automaticMultiplierLevel]) return;
        if (canBuy(automaticMultiplierUpgrades[automaticMultiplierLevel], click_count)) {
            click_count -= cost;
            totalUpgradesBought++;
            scoreboard.innerHTML = click_count;

            if (autoClickerOn == true) {
                stopAutomaticClicker();
            } else {
                automaticMultiplier.innerHTML = `Auto Clicker Multiplier - Cost: ${automaticMultiplierUpgrades[automaticMultiplierLevel].cost}`;
                automaticTimer.style.visibility = 'visible';
            }
            addAutomaticClicker(PPC, timer);

            automaticMultiplierLevel++;
            updateButtons();
        }
    }

    function automaticTimerUpgrade(cost, PPC, timer) {
        if (!automaticTimerUpgrades[automaticTimerLevel]) return;
        if (canBuy(automaticTimerUpgrades[automaticTimerLevel], click_count)) {
            click_count -= cost;
            totalUpgradesBought++;
            scoreboard.innerHTML = click_count;

            stopAutomaticClicker();
            addAutomaticClicker(PPC, timer);

            automaticTimerLevel++;
            updateButtons();
        }
    }

    function updateButtons() {
        const m = manualMultiplierUpgrades[manualMultiplierLevel];
        const a = automaticMultiplierUpgrades[automaticMultiplierLevel];
        const t = automaticTimerUpgrades[automaticTimerLevel];

        if (m) {
            manualMultiplier.textContent = `Multiplier - Cost: ${m.cost}`;
        } else {
            manualMultiplier.textContent = 'Multiplier - MAX';
        } if (automaticMultiplierLevel === 0) {
            automaticMultiplier.textContent = 'Automatic Clicker - Cost 100';
        } else if (a) {
            automaticMultiplier.textContent = `Auto Clicker Multiplier - Cost: ${a.cost}`;
        } else {
            automaticMultiplier.textContent = 'Auto Clicker Multiplier - MAX';
        } if (t) {
            automaticTimer.textContent = `Auto Clicker Timer - Cost: ${t.cost}`;
        } else {
            automaticTimer.textContent = 'Auto Clicker Timer - MAX';
        }

        checkAchievements();
    }

    function resizeMineCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = c.getBoundingClientRect();
        c.width = Math.max(1, Math.round(rect.width * dpr));
        c.height = Math.max(1, Math.round(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeMineCanvas();
    window.addEventListener('resize', resizeMineCanvas);
 
    function spawnOre() {
        const rect = c.getBoundingClientRect();
        const size = 12 + Math.random() * 8;
        const colors = ['#d2a84a', '#a0b9d9', '#76c68f', '#c27bd1'];

        ores.push({
            x: -30,
            y: beltY - beltHeight * 0.35 + Math.random() * (beltHeight * 0.3),
            s: size,
            c: colors[Math.floor(Math.random() * colors.length)],
            wobble: Math.random() * Math.PI * 2,
            v: 1 + Math.random() * 0.4
        });
    }

    function drawOre(o) {
        const s = o.s, r = 4, x = o.x, y = o.y;
        ctx.fillStyle = o.c;
        ctx.strokeStyle = '#1a1d22';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x - s / 2 + r, y - s / 2);
        ctx.arcTo(x + s / 2, y - s / 2, x + s / 2, y + s / 2, r);
        ctx.arcTo(x + s / 2, y + s / 2, x - s / 2, y + s / 2, r);
        ctx.arcTo(x - s / 2, y + s / 2, x - s / 2, y - s / 2, r);
        ctx.arcTo(x - s / 2, y - s / 2, x + s / 2, y - s / 2, r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function syncOresToUpgrades() {
        while (ores.length < totalUpgradesBought) {
            spawnOre();
        }

        while (ores.length > totalUpgradesBought) {
            ores.shift();
        }
    }

    let mt = 0;
    function canvasFrame() {
        const rect = c.getBoundingClientRect();
        const W = rect.width;
        const H = rect.height;

        ctx.fillStyle = '#22262c';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#2a2f36';
        ctx.fillRect(0, 18, W, 18);
        ctx.fillStyle = '#2b3139';
        ctx.fillRect(0, 42, W, 18);

        ctx.fillStyle = '#2f353e';
        ctx.fillRect(0, beltY - beltHeight / 2, W, beltHeight);

        ctx.fillStyle = '#1d2127';
        ctx.fillRect(0, beltY - beltHeight / 2, W, 3);
        ctx.fillRect(0, beltY - beltHeight / 2 - 3, W, 3);

        ctx.save();
        ctx.strokeStyle = '#5c6678';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([14, 10]);
        ctx.lineDashOffset = -mt * (0.5 * 2.0);

        const ty1 = beltY - beltHeight * 0.2;
        const ty2 = beltY + beltHeight * 0.2;
        ctx.beginPath();
        ctx.moveTo(0, ty1);
        ctx.lineTo(W, ty1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, ty2);
        ctx.lineTo(W, ty2);
        ctx.stroke();
        ctx.restore();

        syncOresToUpgrades();

        for (let i = ores.length - 1; i >= 0; i--) {
            const o = ores[i];
            o.wobble += 0.08;
            o.x += 0.5 * o.v * 1.5;
            o.y += Math.sin(o.wobble) * 0.18;
            drawOre(o);
            if (o.x - o.s > W + 24) ores.splice(i, 1);
        }

        mt++;
        requestAnimationFrame(canvasFrame);
    }
    canvasFrame();

    clicker.addEventListener('click', () => {
        manualClickCount++;
        addPoint(pointsPerClick);
    });

    manualMultiplier.addEventListener('click', () => manualMultiplierUpgrade(manualMultiplierUpgrades[manualMultiplierLevel].cost, manualMultiplierUpgrades[manualMultiplierLevel].newPPC));
    automaticMultiplier.addEventListener('click', () => automaticMultiplierUpgrade(automaticMultiplierUpgrades[automaticMultiplierLevel].cost, automaticMultiplierUpgrades[automaticMultiplierLevel].newPPC, automaticTimerUpgrades[automaticTimerLevel].newTimer));
    automaticTimer.addEventListener('click', () => automaticTimerUpgrade(automaticTimerUpgrades[automaticTimerLevel].cost, automaticMultiplierUpgrades[automaticMultiplierLevel - 1].newPPC, automaticTimerUpgrades[automaticTimerLevel].newTimer));
    helpBtn.addEventListener('click', () => helpPanel.classList.remove('hidden'));
    closeHelp.addEventListener('click', () => helpPanel.classList.add('hidden'));
});