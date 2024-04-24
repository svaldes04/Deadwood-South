const gameScreen = document.getElementById("gameScreen"); // anywhere on screen
const gun = document.getElementById("gun"); // the div that holds the gun
const timeDisplay = document.getElementById("timeDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const tumbleweedDisplay = document.getElementById("tumbleweedDisplay");
const ammoDisplay = document.getElementById("ammoDisplay");
const multiplierDisplay = document.getElementById("multiplierDisplay");
const openingText = document.getElementById("openingText");
const playerName = sessionStorage.getItem("sheriffName") || "";

let score = 0;
let targetsNeeded = 20; // 20 hits need to pass level
let timerDuration = 30; // 20 seconds time limit
let timerInterval;
let ammo = 10; // initally 10 bullets
let levelpass = false;
let backgroundScale = 1; // Initial scale
let shotsTaken = 0;
let levelOngoing = true;
let bonusPoints = 0;
let multiplier = 1;
let tumbleweedVal = 20;
let shotsWithoutMiss = 0;

// Function to fade out the message after 2 seconds
function fadeOutEntry() {
  const levelEntry = document.querySelector(".levelEntry");
  openingText.textContent =
    playerName + ", Score 20 points in 30 seconds to gain your sheriff's badge";

  setTimeout(() => {
    levelEntry.classList.add("fadeOut");
    console.log(playerName);
  }, 2000);
}
// when page loads, the level brief is shown
window.onload = fadeOutEntry;
function updateGunPosition(event) {
  // constantly follow mouse with gun
  var mouseX = event.clientX + 300; // add 300 to x just because it looks nicer
  gun.style.left = mouseX + "px";
}

document.addEventListener("mousemove", updateGunPosition); // when mouse moves, the position of gun is updated

const createTarget = () => {
  const target = document.createElement("div");
  target.classList.add("target", "spin");
  target.hit = false;
  gameScreen.appendChild(target);
  const maxTranslationX = gameScreen.offsetWidth - target.offsetWidth;
  const randomY = Math.floor(Math.random() * 65);
  const startAtMaxX = Math.random() < 0.5;
  const initialX = startAtMaxX ? maxTranslationX : 0;

  const keyframes = [
    { transform: `translate(${initialX}px, ${randomY}%) rotate(0deg)` },
    {
      transform: `translate(${
        startAtMaxX ? 0 : maxTranslationX
      }px, ${randomY}%) rotate(360deg)`,
    },
  ];

  const animation = target.animate(keyframes, {
    duration: 1500,
    easing: "linear",
    iterations: Infinity,
  });

  target.addEventListener("click", () => {
    shotsWithoutMiss++;
    if (shotsWithoutMiss === 0){
      multiplier === 1;
    }
    if (shotsWithoutMiss === 4) {
      multiplier = 2;
    }
    if (shotsWithoutMiss === 8) {
      multiplier = 3;
    }
    if (shotsWithoutMiss === 15) {
      multiplier = 4;
    }
    if (shotsWithoutMiss === 30) {
      multiplier = 5;
    }
    // Update multiplier display content
multiplierDisplay.textContent = `${multiplier}`;
    // when target is hit
    if (ammo > 0 && levelOngoing == true) {
      if (!target.hit) {
        // Check if the target has already been hit
        target.hit = true; // Mark the target as hit
        // handles the score gained by hitting bonus target and showing it on the screen
    const numberDisplay = document.createElement("div");
    numberDisplay.textContent = "+" + (tumbleweedVal * multiplier); // Display the points earned
    numberDisplay.classList.add("numberDisplay"); // Apply CSS styles for appearance
    document.body.appendChild(numberDisplay); // Add the number display element to the DOM


    const targetRect = target.getBoundingClientRect();
    const numberX = targetRect.left + targetRect.width / 2;
    const numberY = targetRect.top - 30; // Adjust this value to position the number above the target

    // Set position of number display element
    numberDisplay.style.left = `${numberX}px`;
    numberDisplay.style.top = `${numberY}px`;

   // visual effects for hitting target
    setTimeout(() => {
      numberDisplay.style.opacity = "0";
    }, 400);

        target.remove(); // remove target
        createTarget(); // replace target
        score = score + (tumbleweedVal * multiplier);
        scoreDisplay.textContent = score; // set score
        if (targetsNeeded > 0) // stop counting down when 20 hit
        {
          targetsNeeded--; // reduce targets needed
        }
        
        tumbleweedDisplay.textContent = targetsNeeded;
        console.log("Target hit!");
        
      }
    } 
  });

  // reload gun when r pressed
  document.addEventListener("keydown", (event) => {
    if ((event.key === "r" || event.key === "R") && ammo < 10) {
      ammo = 10;
      console.log("Reloaded. Ammo: " + ammo);
      ammoDisplay.textContent = ammo;
      let reloadSound = new Audio("gameAssets/soundEffects/reload.mp3"); // new audio object created each reload
      reloadSound.play();

      // fades the gun out and in to simulate the guy reloading
      let opacity = 0;
      const fadeInOutInterval = setInterval(() => {
        gun.style.opacity = opacity;
        opacity += 0.05;

        if (opacity >= 1) {
          clearInterval(fadeInOutInterval);
        }
      }, 100);
    }
  });

  animation.finished.then(() => {
    // if the target isnt hit and goes all across reset animation
    target.style.transform = `translate(0px, ${randomY}px) rotate(0deg)`;
    targetsNeeded--;
    
  });
};
countdown(4, function () {
  document.getElementById("openingText").textContent = "Get ready!";
  createTarget();
  startTimer();
});
function countdown(seconds, callback) {
  var countdownElement = document.getElementById("countdown");
  countdownElement.style.display = "block"; // Display countdown element

  var interval = setInterval(function () {
    seconds--;
    countdownElement.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(interval);
      countdownElement.style.display = "none"; 
      if (typeof callback === "function") {
        callback();
      }
    }
  }, 1000); // Update every second
}
const createArcheryTarget = () => {
  const existingTargets = document.querySelectorAll(".archerytarget");
  existingTargets.forEach((target) => {
    target.remove();
  });

  const target = document.createElement("div");
  target.classList.add("archerytarget");

  const gameScreenWidth = gameScreen.offsetWidth;
  const gameScreenHeight = gameScreen.offsetHeight;
  const targetWidth = target.offsetWidth;
  const targetHeight = target.offsetHeight;

  // Calculate random position for the target
  const randomX = Math.random() * 500;
  const randomY = Math.random() * 500;

  // Set target position
  target.style.left = `${randomX}px`;
  target.style.top = `${randomY}px`;
  gameScreen.appendChild(target);
  setTimeout(() => {
    console.log("Removing target...");
    target.remove();
  }, 2000);
  target.addEventListener("click", () => {
    console.log("hit archery target");
    bonusPoints += 30; // Add 30 points when the target is hit
    score += 30;
    scoreDisplay.textContent = score; // set score
    console.log("Bonus Points earned:", bonusPoints);

   // handles the score gained by hitting bonus target and showing it on the screen
    const numberDisplay = document.createElement("div");
    numberDisplay.textContent = "+30"; // Display the points earned
    numberDisplay.classList.add("numberDisplay"); // Apply CSS styles for appearance
    document.body.appendChild(numberDisplay); // Add the number display element to the DOM


    const targetRect = target.getBoundingClientRect();
    const numberX = targetRect.left + targetRect.width / 2;
    const numberY = targetRect.top - 30; // Adjust this value to position the number above the target

    // Set position of number display element
    numberDisplay.style.left = `${numberX}px`;
    numberDisplay.style.top = `${numberY}px`;

   // visual effects for hitting target
    setTimeout(() => {
      numberDisplay.style.opacity = "0";
    }, 900);

    
    setTimeout(() => {
      numberDisplay.remove();
    }, 1250);

// add spin 
    target.classList.add("targetSpin");

    // Remove target after spin (1 second)
    setTimeout(() => {
      console.log("Removing target...");
      target.remove();
    }, 1000);
  });
  // Reload gun when 'r' key is pressed
  document.addEventListener("keydown", (event) => {
    if ((event.key === "r" || event.key === "R") && ammo < 10) {
      ammo = 10;
      console.log("Reloaded. Ammo: " + ammo);
      ammoDisplay.textContent = ammo;
      let reloadSound = new Audio("gameAssets/soundEffects/reload.mp3");
      reloadSound.play();

      // Fade the gun out and in to simulate the guy reloading
      let opacity = 0;
      const fadeInOutInterval = setInterval(() => {
        gun.style.opacity = opacity;
        opacity += 0.05;

        if (opacity >= 1) {
          clearInterval(fadeInOutInterval);
        }
      }, 100);
    }
  });
};
setTimeout(() => {
  createArcheryTarget();
}, 5000);
setTimeout(() => {
  createArcheryTarget();
}, 12000);
setTimeout(() => {
  createArcheryTarget();
}, 16000);
setTimeout(() => {
  createArcheryTarget();
}, 21000);
setTimeout(() => {
  createArcheryTarget();
}, 23000);
// Decrease ammo and change skin when fired to show the gun flash
gameScreen.addEventListener("click", (event) => {
  if (ammo > 0 && levelOngoing) {
    const clickedTarget = event.target.closest(".target");
    if (!clickedTarget) {
      shotsWithoutMiss = 0; // Reset shotsWithoutMiss if the click doesn't hit a target
      multiplier = 1;
      multiplierDisplay.textContent = `${multiplier}`;
      console.log("Shot missed");
      let shootSound = new Audio("gameAssets/soundEffects/shoot.mp3");
      shootSound.volume = 0.6;
      shootSound.play();
      shotsTaken++;
      ammo--;
      console.log("Ammo:", ammo);
      ammoDisplay.textContent = ammo;
      gun.src = "gameAssets/gunfire.png";
      gun.style.width = "20vw";
      gun.style.height = "";
      setTimeout(() => {
        gun.src = "gameAssets/gunaim.png";
        gun.style.width = "";
        gun.style.height = "";
      }, 250);
    } else {
      let shootSound = new Audio("gameAssets/soundEffects/shoot.mp3");
      shootSound.volume = 0.6;
      shootSound.play();
      shotsTaken++;
      ammo--;
      console.log("Ammo:", ammo);
      ammoDisplay.textContent = ammo;
      gun.src = "gameAssets/gunfire.png";
      gun.style.width = "20vw";
      gun.style.height = "";
      setTimeout(() => {
        gun.src = "gameAssets/gunaim.png";
        gun.style.width = "";
        gun.style.height = "";
      }, 250);
    }
  } else {
    let noAmmoSound = new Audio("gameAssets/soundEffects/emptyShoot.mp3");
    noAmmoSound.play();
    ammoDisplay.textContent = "Press R to reload";
  }
});

// Timer countdown
function startTimer() {
  let timeLeft = timerDuration;
  timerInterval = setInterval(() => {
    timeLeft--;
    console.log(timeLeft);
    timeDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);

      // Perform closing code
      if (targetsNeeded == 0) {
        levelpass = true; // check if level passed
        let finalTime = timerDuration - timeLeft;
        
        let shotsMissed = shotsTaken - 20;
        sessionStorage.setItem("level1FinalTime", finalTime);
        sessionStorage.setItem("level1FinalScore", score);
        sessionStorage.setItem("level1ShotsMissed", shotsMissed);
        console.log(
          sessionStorage.getItem("level1ShotsMissed") + " shots missed"
        );
        console.log(
          sessionStorage.getItem("level1FinalScore") + " final score"
        );
        console.log(
          sessionStorage.getItem("level1FinalTime") + " seconds taken"
        );
        
        console.log("you have passed");
        sessionStorage.setItem("currentLevel", 2);
        window.location.href = "betweenLevel.html";
      } else {
        sessionStorage.setItem("currentLevel", 0);
        window.location.href = "betweenLevel.html";
        console.log("lose");
      }
    }
  }, 1000);
}