// Constants
const gameScreen = document.getElementById("gameScreen");
const gun = document.getElementById("gun");
const timeDisplay = document.getElementById("timeDisplay");
const ammoDisplay = document.getElementById("ammoDisplay");
const openingText = document.getElementById("openingText");
const wantedPoster = document.getElementById("wanted");
const playerName = sessionStorage.getItem("sheriffName") || "";

// Variables
let targetsNeeded = 20;
let timerDuration = 60;
let timerInterval;
let ammo = 10;
let levelpass = false;
let backgroundScale = 1;
let shotsTaken = 0;
let levelOngoing = true;
let enemyShot = false;
let currentEnemyTarget = -1;
let score = 0;


// code to deal with gun movement
function updateGunPosition(event) {
  // constantly follow mouse with gun
  var mouseX = event.clientX; // mouse x position in pixels
  gun.style.left = `calc(${mouseX}px - ((100vw - 100%)/2) + 17%)`; // include desired offset because it looks nicer
}
document.addEventListener("mousemove", updateGunPosition); // when mouse moves, the position of gun is updated

// Function to fade out the message after 2 seconds
function fadeOutEntry() {
  var enemyNum = Math.random();
  if (enemyNum < 0.3) {
    currentEnemyTarget = 0;
    wantedPoster.style.backgroundImage = "url('gameAssets/wantedLevel2.png')";
    console.log("set poster to style 0");
  } else if (enemyNum > 0.3 && enemyNum < 0.5) {
    currentEnemyTarget = 1;
    wantedPoster.style.backgroundImage = "url('gameAssets/wantedWallace.png')";
    console.log("set poster to style 1");
  } else if (enemyNum > 0.5 && enemyNum < 0.7) {
    currentEnemyTarget = 2;
    wantedPoster.style.backgroundImage =
      "url('gameAssets/wantedOliverThief.png')";
    console.log("set poster to style 2");
  } else {
    currentEnemyTarget = 3;
    wantedPoster.style.backgroundImage =
      "url('gameAssets/wantedLarryTheKid.png')";
    console.log("set poster to style 3");
  }
  console.log("current enemy: " + currentEnemyTarget);
  const levelEntry = document.querySelector(".levelEntry");
  openingText.textContent =
    "Sheriff " +
    playerName +
    ", Shoot the wanted suspect and bring him back to the Deputy office!";

  setTimeout(() => {
    levelEntry.classList.add("fadeOut");
    console.log(playerName);
  }, 4000);
}

// when page loads, the level brief is shown
window.onload = fadeOutEntry;

const createEnemy = function () {
  var enemyStyle = Math.random();
  if (enemyStyle < 0.3) enemyStyle = 0;
  else if (enemyStyle > 0.3 && enemyStyle < 0.5) enemyStyle = 1;
  else if (enemyStyle > 0.5 && enemyStyle < 0.7) enemyStyle = 2;
  else enemyStyle = 3;
  // create enemy element and define some attributes
  const newEnemy = document.createElement("div");

  newEnemy.hit = false;
  newEnemy.animFrame = 0;
  newEnemy.moveFrame = 0;
  if (enemyStyle == 0) {
    newEnemy.classList.add("cowboy");
    // add it to the DOM
    gameScreen.appendChild(newEnemy);

    // randomized Y position for new enemy
    newEnemy.style.top = `${Math.floor(Math.random() * 35) + 42}%`;
    newEnemy.style.left = `0px`;

    // Changes animation of an enemy
    var nextAnim = function () {
      newEnemy.animFrame += 1;
      newEnemy.style.backgroundImage = `url(gameAssets/cowboy/cowboy_${
        newEnemy.animFrame % 4
      }.png)`; // through the 4 animation frames
    };
  } else if (enemyStyle == 1) {
    newEnemy.classList.add("sprite2");
    // add it to the DOM
    gameScreen.appendChild(newEnemy);

    // randomized Y position for new enemy
    newEnemy.style.top = `${Math.floor(Math.random() * 35) + 42}%`;
    newEnemy.style.left = `0px`;

    // Changes animation of an enemy
    var nextAnim = function () {
      newEnemy.animFrame += 1;

      newEnemy.style.backgroundImage = `url(gameAssets/sprite2/sprite2_${
        newEnemy.animFrame % 4
      }.png)`; // through the 4 animation frames
    };
  } else if (enemyStyle == 2) {
    newEnemy.classList.add("oliver");
    // add it to the DOM
    gameScreen.appendChild(newEnemy);

    // randomized Y position for new enemy
    newEnemy.style.top = `${Math.floor(Math.random() * 35) + 42}%`;
    newEnemy.style.left = `0px`;

    // Changes animation of an enemy
    var nextAnim = function () {
      newEnemy.animFrame += 1;

      newEnemy.style.backgroundImage = `url(gameAssets/oliver/oliver_${
        newEnemy.animFrame % 4
      }.png)`; // through the 4 animation frames
    };
  } else if (enemyStyle == 3) {
    newEnemy.classList.add("lad");
    // add it to the DOM
    gameScreen.appendChild(newEnemy);

    // randomized Y position for new enemy
    newEnemy.style.top = `${Math.floor(Math.random() * 35) + 42}%`;
    newEnemy.style.left = `0px`;

    // Changes animation of an enemy
    var nextAnim = function () {
      newEnemy.animFrame += 1;

      newEnemy.style.backgroundImage = `url(gameAssets/lad/lad_${
        newEnemy.animFrame % 4
      }.png)`; // through the 4 animation frames
    };
  }

  // Changes position of an enemy ( only works left to right )*
  const nextMove = function () {
    newEnemy.moveFrame += 1;

    newEnemy.style.left = `${(newEnemy.moveFrame * window.innerWidth) / 100}px`; // moves enemy by 15 pixels
    console.log(gameScreen.style.getPropertyValue("width"));
    // reaches the edge of the screen remove it
    if (
      parseInt(newEnemy.style.getPropertyValue("left"), 10) > window.innerWidth
    ) {
      if (!newEnemy.hit) {
        newEnemy.hit = true;
        createEnemy();
        newEnemy.remove();
      }
    }
  };

  setInterval(nextMove, 20);
  setInterval(nextAnim, 140);

  // Click listener
  newEnemy.addEventListener("click", () => {
    if (enemyStyle == currentEnemyTarget) {
      console.log("shot" + currentEnemyTarget);
      console.log("shot" + enemyStyle);
      console.log("GOOD SHOT");
      enemyShot = true;
      score++;
      clearInterval(newEnemy.moveInterval);
      clearInterval(newEnemy.animInterval);
      newEnemy.remove();
      if (score==2)
      {
        createEnemy();
      }
      if (score==3)
      {
        createEnemy();
      }
      if (score==4)
      {
        createEnemy();
      }
      if (score == 5) {
        levelpass = true;

        let finalTime = timerDuration - timeDisplay.textContent;

        shotsMissed = shotsTaken - 5;
        sessionStorage.setItem("level2FinalTime", finalTime);

        sessionStorage.setItem("level2ShotsMissed", shotsMissed);
        console.log(
          sessionStorage.getItem("level2ShotsMissed") + " shots missed"
        );

        console.log(
          sessionStorage.getItem("level2FinalTime") + " seconds taken"
        );
        console.log("you have passed");
        sessionStorage.setItem("currentLevel", 4);
        window.location.href = "betweenLevel.html";
        // move onto next level // move onto next level // move onto next level // move onto next level // move onto next level // move onto next level
        clearInterval(timerInterval);
        levelOngoing = false;
      } else {
        var enemyNum = Math.random();
        if (enemyNum < 0.3) {
          currentEnemyTarget = 0;
          wantedPoster.style.backgroundImage =
            "url('gameAssets/wantedLevel2.png')";
          console.log("set poster to style 0");
        } else if (enemyNum > 0.3 && enemyNum < 0.5) {
          currentEnemyTarget = 1;
          wantedPoster.style.backgroundImage =
            "url('gameAssets/wantedWallace.png')";
          console.log("set poster to style 1");
        } else if (enemyNum > 0.5 && enemyNum < 0.7) {
          currentEnemyTarget = 2;
          wantedPoster.style.backgroundImage =
            "url('gameAssets/wantedOliverThief.png')";
          console.log("set poster to style 2");
        } else {
          currentEnemyTarget = 3;
          wantedPoster.style.backgroundImage =
            "url('gameAssets/wantedLarryTheKid.png')";
          console.log("set poster to style 3");
        }
        console.log("current enemy: " + currentEnemyTarget);
      }
    } else {
      console.log("You shot an innocent");
      console.log("shot" + currentEnemyTarget);
      console.log("shot" + enemyStyle);
      enemyShot = true;
      levelpass = true;

        let finalTime = 60; // penalty full time taken

        shotsMissed = shotsTaken - 5;
        sessionStorage.setItem("level2FinalTime", finalTime);

        sessionStorage.setItem("level2ShotsMissed", shotsMissed);
        console.log(
          sessionStorage.getItem("level2ShotsMissed") + " shots missed"
        );

        console.log(
          sessionStorage.getItem("level2FinalTime") + " seconds taken"
        );
      sessionStorage.setItem("currentLevel", 3);
      window.location.href = "betweenLevel.html";
      clearInterval(newEnemy.moveInterval);
      clearInterval(newEnemy.animInterval);
      newEnemy.remove();
      createEnemy();
    }
  });
};

// Reload event listener with 'r' key
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

createEnemy();

// Decrease ammo and change skin when fired to show the gun flash
gameScreen.addEventListener("click", () => {
  if (ammo > 0 && levelOngoing == true) {
    let shootSound = new Audio("gameAssets/soundEffects/shoot.mp3"); // new audio object created each shot
    shootSound.volume = 0.6; // lower volume (original audio too loud)
    shootSound.play();
    shotsTaken++;
    ammo--;

    ammoDisplay.textContent = ammo;
    gun.src = "gameAssets/gunfire.png";
    setTimeout(() => {
      gun.src = "gameAssets/gunaim.png";
    }, 250);
  } else {
    let noAmmoSound = new Audio("gameAssets/soundEffects/emptyShoot.mp3"); // new audio object created each shot
    noAmmoSound.play();
    ammoDisplay.innerHTML = "Press R to reload";
  }
});

// Timer countdown
function startTimer() {
  let timeLeft = timerDuration;
  timerInterval = setInterval(() => {
    timeLeft--;

    timeDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
      if (targetsNeeded > 0) {
        window.location.href = "level2.html"; // or some win / lose screen
        console.log("lose");
      }
      clearInterval(timerInterval);
    }
  }, 1000);
}

startTimer();
