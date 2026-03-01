/*

Authors: Edgar Dizon and Jamie Hammill
Date Created: Feb 13, 2026
Purpose: Game logic and JS functions to run the game

*/

let click_count = 0;
let pointsPerClick = 1;
let totalUpgradesBought = 0;
let manualClickCount = 0;

// --- Multiplier 1: Adds a flat constant to PPC ---
let flatMultiplierLevel = 0;
const flatMultiplierUpgrades = [
    { cost: 20,      addPPC: 1  },
    { cost: 60,      addPPC: 2  },
    { cost: 180,     addPPC: 3  },
    { cost: 540,     addPPC: 5  },
    { cost: 1600,    addPPC: 7  },
    { cost: 4800,    addPPC: 10 },
    { cost: 14500,   addPPC: 15 },
    { cost: 44000,   addPPC: 22 },
    { cost: 133000,  addPPC: 30 },
    { cost: 400000,  addPPC: 45 },
    { cost: 1200000, addPPC: 65 },
    { cost: 3600000, addPPC: 100}
];

// --- Multiplier 2: Multiplies PPC by 1.5 ---
let multiplyX15Level = 0;
const multiplyX15Upgrades = [
    { cost: 150,     mult: 1.5 },
    { cost: 500,     mult: 1.5 },
    { cost: 1800,    mult: 1.5 },
    { cost: 6000,    mult: 1.5 },
    { cost: 20000,   mult: 1.5 },
    { cost: 65000,   mult: 1.5 },
    { cost: 200000,  mult: 1.5 },
    { cost: 650000,  mult: 1.5 },
    { cost: 2000000, mult: 1.5 },
    { cost: 6500000, mult: 1.5 }
];

// --- Multiplier 3: Multiplies PPC by 3 ---
let multiplyX3Level = 0;
const multiplyX3Upgrades = [
    { cost: 800,      mult: 3 },
    { cost: 5000,     mult: 3 },
    { cost: 30000,    mult: 3 },
    { cost: 180000,   mult: 3 },
    { cost: 1000000,  mult: 3 },
    { cost: 6000000,  mult: 3 },
    { cost: 35000000, mult: 3 }
];

let autoClicker;
let autoClickerOn = false;
let automaticMultiplierLevel = 0;
const automaticMultiplierUpgrades = [
    { cost: 100,      newPPC: 1  },
    { cost: 250,      newPPC: 2  },
    { cost: 750,      newPPC: 3  },
    { cost: 2000,     newPPC: 5  },
    { cost: 6000,     newPPC: 8  },
    { cost: 18000,    newPPC: 12 },
    { cost: 54000,    newPPC: 18 },
    { cost: 160000,   newPPC: 27 },
    { cost: 480000,   newPPC: 40 },
    { cost: 1450000,  newPPC: 60 },
    { cost: 4350000,  newPPC: 90 },
    { cost: 13000000, newPPC: 120}
];

let automaticTimerLevel = 0;
const automaticTimerUpgrades = [
    { cost: 500,      newTimer: 1000 },
    { cost: 2000,     newTimer: 900  },
    { cost: 8000,     newTimer: 800  },
    { cost: 25000,    newTimer: 700  },
    { cost: 80000,    newTimer: 600  },
    { cost: 250000,   newTimer: 500  },
    { cost: 800000,   newTimer: 400  },
    { cost: 2500000,  newTimer: 320  },
    { cost: 8000000,  newTimer: 260  },
    { cost: 25000000, newTimer: 200  }
];

/**
 * Gets the current automatic clicker points per click based on upgrade level.
 *
 * @returns {Number} The current auto PPC value, or 0 if no auto upgrade bought yet
 */
function getCurrentAutoPPC() {
    if (automaticMultiplierLevel > 0) {
        return automaticMultiplierUpgrades[automaticMultiplierLevel - 1].newPPC;
    }
    return 0;
}

/**
 * Gets the current automatic clicker interval in milliseconds based on upgrade level.
 *
 * @returns {Number} The current auto timer value in ms, or 1000 if no timer upgrade bought yet
 */
function getCurrentAutoTimer() {
    if (automaticTimerLevel > 0) {
        return automaticTimerUpgrades[automaticTimerLevel - 1].newTimer;
    }
    return 1000;
}

const achievements = [
    // Click number based
    { id: 'first_click',       label: 'First Click',                        earned: false, check: () => manualClickCount >= 1    },
    { id: 'click_apprentice',  label: 'Click Apprentice: 50 Manual Clicks', earned: false, check: () => manualClickCount >= 50   },
    { id: 'click_enthusiast',  label: 'Click Enthusiast: 250 Manual Clicks',earned: false, check: () => manualClickCount >= 250  },
    { id: 'click_machine',     label: 'Click Machine: 1000 Manual Clicks',  earned: false, check: () => manualClickCount >= 1000 },

    // Point number based
    { id: 'getting_rich',    label: 'Getting Rich: 100 Resources',      earned: false, check: () => click_count >= 100    },
    { id: 'high_roller',     label: 'High Roller: 1000 Resources',      earned: false, check: () => click_count >= 1000   },
    { id: 'resource_tycoon', label: 'Resource Tycoon: 10000 Resources', earned: false, check: () => click_count >= 10000  },
    { id: 'resource_magnet', label: 'Resource Magnet: 100000 Resources',earned: false, check: () => click_count >= 100000 },

    // Upgrade amount based
    { id: 'upgrade_beginner',  label: 'Upgrade Beginner: First Upgrade',    earned: false, check: () => totalUpgradesBought >= 1  },
    { id: 'upgrade_shopper',   label: 'Upgrade Shopper: Buy 5 Upgrades',    earned: false, check: () => totalUpgradesBought >= 5  },
    { id: 'upgrade_collector', label: 'Upgrade Collector: Buy 10 Upgrades', earned: false, check: () => totalUpgradesBought >= 10 },

    // Manual upgrades based
    { id: 'finger_training', label: 'Finger Training: Manual PPC >= 3',  earned: false, check: () => pointsPerClick >= 3   },
    { id: 'iron_fingers',    label: 'Iron Fingers: Manual PPC >= 12',    earned: false, check: () => pointsPerClick >= 12  },
    { id: 'thunder_clicks',  label: 'Thunder Clicks: Manual PPC >= 40',  earned: false, check: () => pointsPerClick >= 40  },
    { id: 'typhoon_clicks',  label: 'Typhoon Clicks: Manual PPC >= 135', earned: false, check: () => pointsPerClick >= 135 },

    // Automatic multiplier upgrades based
    { id: 'auto_unlocked', label: 'Auto-Clicker Unlocked',          earned: false, check: () => autoClickerOn === true     },
    { id: 'auto_power_1',  label: 'Auto Power 1: Auto PPC >= 3',    earned: false, check: () => getCurrentAutoPPC() >= 3  },
    { id: 'auto_power_2',  label: 'Auto Power 2: Auto PPC >= 12',   earned: false, check: () => getCurrentAutoPPC() >= 12 },
    { id: 'auto_power_3',  label: 'Auto Power 3: Auto PPC >= 27',   earned: false, check: () => getCurrentAutoPPC() >= 27 },

    // Automatic timer upgrades based
    { id: 'auto_speed_1', label: 'Auto Speed 1: Auto Timer <= 800ms', earned: false, check: () => getCurrentAutoTimer() <= 800 },
    { id: 'auto_speed_2', label: 'Auto Speed 2: Auto Timer <= 500ms', earned: false, check: () => getCurrentAutoTimer() <= 500 },
    { id: 'auto_speed_3', label: 'Auto Speed 3: Auto Timer <= 320ms', earned: false, check: () => getCurrentAutoTimer() <= 320 },

    // Completing Upgrades based
    { id: 'flat_multiplier_maxed', label: 'Flat Multiplier Maxed',  earned: false, check: () => flatMultiplierLevel      >= flatMultiplierUpgrades.length      },
    { id: 'x15_multiplier_maxed',  label: 'x1.5 Multiplier Maxed', earned: false, check: () => multiplyX15Level         >= multiplyX15Upgrades.length         },
    { id: 'x3_multiplier_maxed',   label: 'x3 Multiplier Maxed',   earned: false, check: () => multiplyX3Level          >= multiplyX3Upgrades.length          },
    { id: 'auto_multiplier_maxed', label: 'Auto Multiplier Maxed', earned: false, check: () => automaticMultiplierLevel >= automaticMultiplierUpgrades.length  },
    { id: 'auto_timer_maxed',      label: 'Auto Timer Maxed',      earned: false, check: () => automaticTimerLevel      >= automaticTimerUpgrades.length       }
];

window.addEventListener('load', function () {
    const clicker             = document.getElementById('clicker');
    const scoreboard          = document.getElementById('scoreboard');
    const manualPPC           = document.getElementById('manualPPC');
    const flatMultiplierBtn   = document.getElementById('multiplier');
    const x15MultiplierBtn    = document.getElementById('multiplierX15');
    const x3MultiplierBtn     = document.getElementById('multiplierX3');
    const automaticMultiplier = document.getElementById('automaticMultiplier');
    const automaticTimer      = document.getElementById('automaticTimer');
    const achievementsList    = document.getElementById('achievementsList');
    const congratsPopup       = document.getElementById('congratsPopup');
    const helpBtn             = document.getElementById('helpBtn');
    const helpPanel           = document.getElementById('helpPanel');
    const closeHelp           = document.getElementById('closeHelp');

    const c          = document.getElementById('mineCanvas');
    const ctx        = c.getContext('2d', { alpha: false });
    const beltY      = 80;
    const beltHeight = 26;
    const ores       = [];

    /**
     * Updates the scoreboard display, flooring click_count so no decimals ever appear.
     * The internal click_count variable keeps full float precision for accurate game logic.
     */
    function updateScoreboard() {
        scoreboard.innerHTML = Math.floor(click_count) + ' Ore';
    }

    /**
     * Adds points to the player's total score and updates the scoreboard display.
     * click_count keeps full float precision; only the display is floored.
     *
     * @param {Number} points - The number of points to add to click_count
     */
    function addPoint(points) {
        click_count += points;
        updateScoreboard();
        checkAchievements();
    }

    /**
     * Updates the manual PPC display label to reflect the current pointsPerClick value,
     * formatted to 2 decimal places. The internal pointsPerClick retains full precision.
     */
    function changeManualPPC() {
        manualPPC.innerHTML = `Manual PPC: ${pointsPerClick.toFixed(2)}`;
    }

    let congratsTimeout;
    /**
     * Displays a temporary congratulations popup message for 3 seconds.
     *
     * @param {String} msg - The message text to display in the popup
     */
    function showCongrats(msg) {
        congratsPopup.innerHTML = msg;
        congratsPopup.classList.remove('hidden');
        clearTimeout(congratsTimeout);
        congratsTimeout = setTimeout(() => congratsPopup.classList.add('hidden'), 3000);
    }

    /**
     * Checks all achievements and awards any that have been newly earned,
     * adding a badge to the achievements list and showing a congrats popup.
     */
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

    /**
     * Checks whether the player has enough currency to purchase an upgrade.
     *
     * @param {Object} next - The upgrade object containing a cost property
     * @param {Number} currency - The player's current resource count
     * @returns {Boolean} True if the upgrade exists and the player can afford it
     */
    function canBuy(next, currency) {
        return next && currency >= next.cost;
    }

    /**
     * Purchases the next flat PPC upgrade, adding a fixed amount to pointsPerClick.
     * Deducts the cost from click_count and increments the upgrade level.
     */
    function flatMultiplierUpgrade() {
        const upgrade = flatMultiplierUpgrades[flatMultiplierLevel];
        if (!upgrade) return;
        if (!canBuy(upgrade, click_count)) return;

        pointsPerClick += upgrade.addPPC;
        click_count    -= upgrade.cost;
        flatMultiplierLevel++;
        totalUpgradesBought++;

        updateScoreboard();
        updateButtons();
        changeManualPPC();
    }

    /**
     * Purchases the next x1.5 PPC upgrade, multiplying pointsPerClick by 1.5.
     * The full float result is kept internally; only the display rounds to 2dp.
     * Deducts the cost from click_count and increments the upgrade level.
     */
    function x15MultiplierUpgrade() {
        const upgrade = multiplyX15Upgrades[multiplyX15Level];
        if (!upgrade) return;
        if (!canBuy(upgrade, click_count)) return;

        pointsPerClick  = pointsPerClick * upgrade.mult;
        click_count    -= upgrade.cost;
        multiplyX15Level++;
        totalUpgradesBought++;

        updateScoreboard();
        updateButtons();
        changeManualPPC();
    }

    /**
     * Purchases the next x3 PPC upgrade, multiplying pointsPerClick by 3.
     * The full float result is kept internally; only the display rounds to 2dp.
     * Deducts the cost from click_count and increments the upgrade level.
     */
    function x3MultiplierUpgrade() {
        const upgrade = multiplyX3Upgrades[multiplyX3Level];
        if (!upgrade) return;
        if (!canBuy(upgrade, click_count)) return;

        pointsPerClick  = pointsPerClick * upgrade.mult;
        click_count    -= upgrade.cost;
        multiplyX3Level++;
        totalUpgradesBought++;

        updateScoreboard();
        updateButtons();
        changeManualPPC();
    }

    /**
     * Starts the automatic clicker interval, awarding points at a set rate.
     *
     * @param {Number} PPC - Points to award per automatic click interval
     * @param {Number} timer - Interval duration in milliseconds between automatic clicks
     */
    function addAutomaticClicker(PPC, timer) {
        autoClicker   = setInterval(() => addPoint(PPC), timer);
        autoClickerOn = true;
    }

    /**
     * Stops the automatic clicker interval and sets autoClickerOn to false.
     */
    function stopAutomaticClicker() {
        clearInterval(autoClicker);
        autoClickerOn = false;
    }

    /**
     * Purchases the next automatic clicker PPC upgrade, restarting the clicker at the new rate.
     * If this is the first auto upgrade, also reveals the timer upgrade button.
     *
     * @param {Number} cost - The resource cost of the upgrade
     * @param {Number} PPC - The new points per automatic click interval after upgrading
     * @param {Number} timer - The current auto clicker interval in milliseconds
     */
    function automaticMultiplierUpgrade(cost, PPC, timer) {
        if (!automaticMultiplierUpgrades[automaticMultiplierLevel]) return;
        if (canBuy(automaticMultiplierUpgrades[automaticMultiplierLevel], click_count)) {
            click_count -= cost;
            totalUpgradesBought++;
            updateScoreboard();

            if (autoClickerOn) {
                stopAutomaticClicker();
            } else {
                automaticTimer.style.visibility = 'visible';
            }
            addAutomaticClicker(PPC, timer);

            automaticMultiplierLevel++;
            updateButtons();
        }
    }

    /**
     * Purchases the next auto clicker timer upgrade, restarting the clicker at the faster interval.
     *
     * @param {Number} cost - The resource cost of the upgrade
     * @param {Number} PPC - The current auto clicker points per interval (unchanged by this upgrade)
     * @param {Number} timer - The new interval duration in milliseconds after upgrading
     */
    function automaticTimerUpgrade(cost, PPC, timer) {
        if (!automaticTimerUpgrades[automaticTimerLevel]) return;
        if (canBuy(automaticTimerUpgrades[automaticTimerLevel], click_count)) {
            click_count -= cost;
            totalUpgradesBought++;
            updateScoreboard();

            stopAutomaticClicker();
            addAutomaticClicker(PPC, timer);

            automaticTimerLevel++;
            updateButtons();
        }
    }

    /**
     * Updates all upgrade button labels to reflect the current upgrade levels and costs.
     * Shows MAX when an upgrade tree is fully purchased. Also re-checks achievements.
     * Reveals the x1.5 button after the first flat upgrade is bought,
     * and the x3 button after the first x1.5 upgrade is bought.
     */
    function updateButtons() {
        // Flat multiplier
        const fm = flatMultiplierUpgrades[flatMultiplierLevel];
        if (fm) {
            flatMultiplierBtn.textContent = `Multiplier: +${fm.addPPC} Flat PPC - Cost: ${fm.cost}`;
        } else {
            flatMultiplierBtn.textContent = 'Multiplier: Flat - MAX';
        }

        // x1.5 multiplier — reveal after first flat upgrade purchased
        if (flatMultiplierLevel >= 1) {
            x15MultiplierBtn.classList.remove('hidden');
        }
        const x15 = multiplyX15Upgrades[multiplyX15Level];
        if (x15) {
            x15MultiplierBtn.textContent = `Multiplier: x1.5 PPC - Cost: ${x15.cost}`;
        } else {
            x15MultiplierBtn.textContent = 'Multiplier: x1.5 - MAX';
        }

        // x3 multiplier — reveal after first x1.5 upgrade purchased
        if (multiplyX15Level >= 1) {
            x3MultiplierBtn.classList.remove('hidden');
        }
        const x3 = multiplyX3Upgrades[multiplyX3Level];
        if (x3) {
            x3MultiplierBtn.textContent = `Multiplier: x3 PPC - Cost: ${x3.cost}`;
        } else {
            x3MultiplierBtn.textContent = 'Multiplier: x3 - MAX';
        }

        // Auto multiplier
        const a = automaticMultiplierUpgrades[automaticMultiplierLevel];
        if (automaticMultiplierLevel === 0) {
            automaticMultiplier.textContent = 'Auto Clicker: Unlock - Cost: 100';
        } else if (a) {
            automaticMultiplier.textContent = `Auto Clicker: Power - Cost: ${a.cost}`;
        } else {
            automaticMultiplier.textContent = 'Auto Clicker: Power - MAX';
        }

        // Auto timer
        const t = automaticTimerUpgrades[automaticTimerLevel];
        if (t) {
            automaticTimer.textContent = `Auto Clicker: Speed - Cost: ${t.cost}`;
        } else {
            automaticTimer.textContent = 'Auto Clicker: Speed - MAX';
        }

        checkAchievements();
    }

    /**
     * Resizes the mine canvas to match its CSS display size, accounting for device pixel ratio.
     * Should be called on load and whenever the window is resized.
     */
    function resizeMineCanvas() {
        const dpr  = Math.min(window.devicePixelRatio || 1, 2);
        const rect = c.getBoundingClientRect();
        c.width  = Math.max(1, Math.round(rect.width  * dpr));
        c.height = Math.max(1, Math.round(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeMineCanvas();
    window.addEventListener('resize', resizeMineCanvas);

    /**
     * Spawns a new ore object off the left edge of the canvas and adds it to the ores array.
     * Each ore has a random size, color, position, wobble phase, and speed.
     */
    function spawnOre() {
        const colors = ['#d2a84a', '#a0b9d9', '#76c68f', '#c27bd1'];
        const size   = 12 + Math.random() * 8;
        ores.push({
            x:      -30,
            y:      beltY - beltHeight * 0.35 + Math.random() * (beltHeight * 0.3),
            s:      size,
            c:      colors[Math.floor(Math.random() * colors.length)],
            wobble: Math.random() * Math.PI * 2,
            v:      1 + Math.random() * 0.4
        });
    }

    /**
     * Draws a single ore as a rounded rectangle on the canvas at its current position.
     *
     * @param {Object} o - The ore object containing position (x, y), size (s), and color (c)
     */
    function drawOre(o) {
        const s = o.s, r = 4, x = o.x, y = o.y;
        ctx.fillStyle   = o.c;
        ctx.strokeStyle = '#1a1d22';
        ctx.lineWidth   = 2;

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

    /**
     * Keeps the ores array in sync with the total number of upgrades purchased.
     * Spawns new ores if under count, or removes the oldest if over count.
     */
    function syncOresToUpgrades() {
        while (ores.length < totalUpgradesBought) spawnOre();
        while (ores.length > totalUpgradesBought) ores.shift();
    }

    let mt = 0;
    /**
     * Renders a single animation frame of the mine conveyor belt canvas.
     * Draws the belt background, animated dashed lines, and all ore pieces,
     * then schedules the next frame via requestAnimationFrame.
     */
    function canvasFrame() {
        const rect = c.getBoundingClientRect();
        const W    = rect.width;
        const H    = rect.height;

        ctx.fillStyle = '#22262c';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#2a2f36';
        ctx.fillRect(0, 18, W, 18);
        ctx.fillStyle = '#2b3139';
        ctx.fillRect(0, 42, W, 18);

        ctx.fillStyle = '#2f353e';
        ctx.fillRect(0, beltY - beltHeight / 2, W, beltHeight);

        ctx.fillStyle = '#1d2127';
        ctx.fillRect(0, beltY - beltHeight / 2,     W, 3);
        ctx.fillRect(0, beltY - beltHeight / 2 - 3, W, 3);

        ctx.save();
        ctx.strokeStyle   = '#5c6678';
        ctx.lineWidth     = 2.5;
        ctx.setLineDash([14, 10]);
        ctx.lineDashOffset = -mt * 2.0;

        const ty1 = beltY - beltHeight * 0.2;
        const ty2 = beltY + beltHeight * 0.2;
        ctx.beginPath(); ctx.moveTo(0, ty1); ctx.lineTo(W, ty1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, ty2); ctx.lineTo(W, ty2); ctx.stroke();
        ctx.restore();

        syncOresToUpgrades();

        for (let i = ores.length - 1; i >= 0; i--) {
            const o = ores[i];
            o.wobble += 0.08;
            o.x += o.v * 1.5;
            o.y += Math.sin(o.wobble) * 0.18;
            drawOre(o);
            if (o.x - o.s > W + 24) ores.splice(i, 1);
        }

        mt++;
        requestAnimationFrame(canvasFrame);
    }
    canvasFrame();

    // Set initial button labels and PPC display
    updateButtons();
    changeManualPPC();

    // Event listeners
    clicker.addEventListener('click', () => {
        manualClickCount++;
        addPoint(pointsPerClick);
    });

    flatMultiplierBtn.addEventListener('click', flatMultiplierUpgrade);
    x15MultiplierBtn.addEventListener('click',  x15MultiplierUpgrade);
    x3MultiplierBtn.addEventListener('click',   x3MultiplierUpgrade);

    automaticMultiplier.addEventListener('click', () => {
        const upgrade = automaticMultiplierUpgrades[automaticMultiplierLevel];
        if (!upgrade) return;
        automaticMultiplierUpgrade(upgrade.cost, upgrade.newPPC, getCurrentAutoTimer());
    });

    automaticTimer.addEventListener('click', () => {
        const upgrade = automaticTimerUpgrades[automaticTimerLevel];
        if (!upgrade) return;
        automaticTimerUpgrade(upgrade.cost, getCurrentAutoPPC(), upgrade.newTimer);
    });

    helpBtn.addEventListener('click',   () => helpPanel.classList.remove('hidden'));
    closeHelp.addEventListener('click', () => helpPanel.classList.add('hidden'));
});