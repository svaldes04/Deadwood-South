const gameScreen = document.getElementById("gameScreen_alt"); // anywhere on screen
const gun = document.getElementById("gun"); // the div that holds the gun
const timeDisplay = document.getElementById("timeDisplay");
const ammoDisplay = document.getElementById("ammoDisplay");
const openingText = document.getElementById("openingText");
const playerName = sessionStorage.getItem("sheriffName") || "";

let targetsNeeded = 20; // 25 hits need to pass level
let timerDuration = 60; // 60 seconds time limit
let timerInterval;
let score = 0;
let ammo = 10; // initally 10 bullets
let levelpass = false;
let backgroundScale = 1; // Initial scale
let shotsTaken = 0;
let levelOngoing = true;
let enemyShot = false;
let timesHit = 0;

// Play background music on entry
const background_music = new Audio("gameAssets/Music/FinalLevel.mp3");
    background_music.play();
    background_music.loop = true;

// code to deal with gun movement
function updateGunPosition(event) {
  // constantly follow mouse with gun
  var mouseX = event.clientX; // mouse x position in pixels
  gun.style.left = `calc(${mouseX}px - ((100vw - 100%)/2) + 17%)`; // include desired offset because it looks nicer
}
document.addEventListener("mousemove", updateGunPosition); // when mouse moves, the position of gun is updated

// Function to fade out the message after 2 seconds
function fadeOutEntry() {
  const levelEntry = document.querySelector(".levelEntry");
  openingText.textContent =
    playerName +
    ", you're being persecuted for your crime. You're surrounded. Escape Deadwood South unharmed ";

  setTimeout(() => {
    levelEntry.classList.add("fadeOut");
  }, 4000);
}

// when page loads, the level brief is shown
window.onload = fadeOutEntry;


const createEnemy = function(areaId, waitTime = 3000){

  const enemyElement = document.createElement("div");
  const myArea = document.getElementById(areaId);

  // class assignments
  enemyElement.classList.add("armed-cowboy");
  let randomSprite = Math.floor(Math.random() * 3);
  if(randomSprite == 1){
    enemyElement.classList.add("sprite-b");
  } else if(randomSprite == 2){
    enemyElement.classList.add("sprite-c");
  }

  myArea.appendChild(enemyElement);
  enemyElement.hit = false;

  // Waiting period before main animation
  let wait = enemyElement.animate(
    [{ transform: `translate(150%, 100%) scaleX(-1)` },
    { transform: `translate(150%, 100%) scaleX(-1)` }],
    {
      duration: waitTime,
      easing: "linear",
      iterations: 1
  });

  // Main animation keyframes
  const keyframes = [
    { transform: `translate(150%, 100%) scaleX(-1)` },
    { transform: `translate(150%, -2%) scaleX(-1)` },
    { transform: `translate(0%, -2%) scaleX(-1)` },
    { transform: `translate(0%, 100%) scaleX(-1)` },
    { transform: `translate(0%, 100%) scaleX(1)` },
    { transform: `translate(0%, -2%) scaleX(1)` },
    { transform: `translate(150%, -2%) scaleX(1)` },
    { transform: `translate(150%, 100%) scaleX(1)` },
    { transform: `translate(150%, 100%) scaleX(-1)` }
  ];

  const keyframes2 = [
    { transform: `translate(150%, 100%) scaleX(-1)` },
    { transform: `translate(150%, -2%) scaleX(-1)` },
    { transform: `translate(0%, -2%) scaleX(-1)` },
    { transform: `translate(0%, 100%) scaleX(-1)` },
    { transform: `translate(0%, 100%) scaleX(1)` },
    { transform: `translate(0%, -2%) scaleX(1)` },
    { transform: `translate(80%, -2%) scaleX(1)` },
    { transform: `translate(80%, 0%) scaleX(1)` },
    { transform: `translate(80%, 0%) scaleX(1)` }
  ];

  wait.finished.then(() => {
    let animation;
    let randomAnimation = Math.floor(Math.random() * 1.5); 
    // 66% chance of enemy shooting at player
    
    if(randomAnimation == 0){
        // Animation with shooting
        animation = enemyElement.animate(keyframes2, {
        duration: 5700,
        easing: "linear",
        iterations: 1
      });
    } else {
        // Start main animation
        animation = enemyElement.animate(keyframes, {
        duration: ( Math.floor((Math.random() * 3000) + 4500) ), // 4500-7500 milliseconds
        easing: "linear",
        iterations: 1
      });
    }

    // After initial wait is done, start main animation
    animation.finished.then(() => {

      // Destroy self and create new enemy
      if (!enemyElement.hit) {
        if(randomAnimation == 0){
          // make gun appear on screen briefly
          const gunDisplay = document.createElement("div");
          gunDisplay.classList.add("gunDisplay");
          document.body.appendChild(gunDisplay);
          const targetRect = myArea.getBoundingClientRect();
          const numberX = targetRect.left + targetRect.width / 2;
          const numberY = targetRect.top;
          gunDisplay.style.left = `${numberX - 40}px`;
          gunDisplay.style.top = `${numberY}px`;

          // check which row this area is in
          if(myArea.parentElement.id.localeCompare("row1") == 0){
            gunDisplay.style.width = "60px";
            gunDisplay.style.left = `${numberX - 30}px`;
          } else if(myArea.parentElement.id.localeCompare("row2") == 0){
            gunDisplay.style.width = "80px";
          } else {
            gunDisplay.style.width = "100px";
          }

          score -=25; // lose point for taking damage
          scoreDisplay.textContent = score; // set score
          timesHit++;

          const numberDisplay = document.createElement("div");
          numberDisplay.textContent = "-25"; // Display the points lost
          numberDisplay.classList.add("numberDisplay");
          numberDisplay.classList.add("negative");
          myArea.appendChild(numberDisplay); // Add the number display element to the area
          const targetRect2 = enemyElement.getBoundingClientRect();
          numberDisplay.style.top = `0px`;

          let ouchSound = new Audio("gameAssets/soundEffects/ouch.mp3"); // new audio object created each reload
          ouchSound.play();

          setTimeout(() => {
            gunDisplay.remove();
            numberDisplay.remove();
            
          }, 700);
        }

        let randomWaitTime = Math.floor((Math.random() * 2000) + 2000 ); // Random between 2000-4000 milliseconds
        enemyElement.remove();
        createEnemy(areaId, randomWaitTime);
      }
    
    });
  });


  // On hit, exit animation
  enemyElement.addEventListener("click", () => {

    // when target is hit
    if (ammo > 0 && levelOngoing == true) {
      // check if ammo to shoot
      if (!enemyElement.hit) {
        // Check if the target has already been hit
        enemyElement.hit = true; // Mark the target as hit
        enemyElement.remove();

        // Create bew enemy
        console.log("Hit");
        let randomWaitTime = Math.floor((Math.random() * 2000) + 2000 ); // Random between 2000-4000 milliseconds
        createEnemy(areaId,randomWaitTime);

        score+=50;
        scoreDisplay.textContent = score; // set new score

        // Display points gained
        const numberDisplay = document.createElement("div");
        numberDisplay.textContent = "+50"; // Display the points earned
        numberDisplay.classList.add("numberDisplay");
        myArea.appendChild(numberDisplay); // Add the number display element to the area
        const targetRect = enemyElement.getBoundingClientRect();
        const numberY = targetRect.top; // Adjust to position above the target
        numberDisplay.style.top = `${numberY}px`;

        setTimeout(() => {
          numberDisplay.style.top = `${numberY}px`;
          numberDisplay.style.opacity = "0";
          numberDisplay.remove();
        }, 400);

      }
    } else {
    }
  });

};

// Create initial enemies
let areaIds = ["c1","c2","c3","c4","c5","c6","c7"];
for (let i = 0; i < areaIds.length; i++) {
  let randomWaitTime = Math.floor((Math.random() * 6000)); // Random between 0-6000 milliseconds
  createEnemy(areaIds[i], randomWaitTime);
}

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

// Decrease ammo and change skin when fired to show the gun flash
gameScreen.addEventListener("click", () => {
  if (ammo > 0 && levelOngoing == true) {
    let shootSound = new Audio("gameAssets/soundEffects/shoot.mp3"); // new audio object created each shot
    shootSound.volume = 0.6; // lower volume (original audio too loud)
    shootSound.play();
    shotsTaken++;
    ammo--;
    console.log(ammo);
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
      levelpass = true; // check if level passed
      let finalTime = timerDuration - timeDisplay.textContent;
          
      let finalScore = score;

      shotsMissed = shotsTaken - ((finalScore + (timesHit * 25) )/ 50); // Find number of shots that have increased the score
      sessionStorage.setItem("level3FinalTime", finalTime);
      sessionStorage.setItem("level3FinalScore", finalScore);
      sessionStorage.setItem("level3ShotsMissed", shotsMissed);
      console.log(
        sessionStorage.getItem("level3ShotsMissed") + " shots missed"
      );
      console.log(
        sessionStorage.getItem("level3FinalScore") + " final score"
      );
      console.log(
        sessionStorage.getItem("level3FinalTime") + " seconds taken"
      );
      console.log("you have passed");
      // move onto next level // move onto next level // move onto next level // move onto next level // move onto next level // move onto next level
      clearInterval(timerInterval);
      levelOngoing = false;

      // SEND TO FINAL GAME SCREEN 
      sessionStorage.setItem("currentLevel", 6);

      window.location.href = "betweenLevel.html"; 
      clearInterval(timerInterval);
    }
  }, 1000);
}

startTimer();