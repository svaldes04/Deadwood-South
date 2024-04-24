const gameScreen = document.getElementById("gameScreen");
const gun = document.getElementById("gun");
const timeDisplay = document.getElementById("timeDisplay");
const ammoDisplay = document.getElementById("ammoDisplay");
const openingText = document.getElementById("openingText");
const goldCount = document.getElementById("goldDisplay");
const vetBillsCount = document.getElementById("score");
const playerName = sessionStorage.getItem("sheriffName") || "";
let timerDuration = 60;
let timerInterval;
let ammo = 10;
let levelpass = false;
let backgroundScale = 1;
let shotsTaken = 0;
let levelOngoing = true;
const randomNumber = Math.random();
let vetBills = 0;


//audio
let noAmmoSound = new Audio("gameAssets/soundEffects/emptyShoot.mp3"); 
let money = new Audio("gameAssets/soundEffects/shells.wav"); 
let shootSound = new Audio("gameAssets/soundEffects/shoot.mp3"); 
let reloadSound = new Audio("gameAssets/soundEffects/reload.mp3"); 

function updateGunPosition(event) {
  var mouseX = event.clientX;
  gun.style.left = `calc(${mouseX}px - ((100vw - 100%)/2) + 17%)`;
}

document.addEventListener("mousemove", updateGunPosition);

function fadeOutEntry() {
  const levelEntry = document.querySelector(".levelEntry");
  openingText.textContent =
    "Sheriff " +
    playerName +
    ", Shoot the wanted suspects and save as much stolen money as you can!\n Avoid harming animals or your vet bills will increase!";
  setTimeout(() => {
    levelEntry.classList.add("fadeOut");
  }, 4000);
}

window.onload = fadeOutEntry;

function playBackgroundMusic() {
  startTimer();
  document.removeEventListener("click", playBackgroundMusic);
}

document.addEventListener("click", playBackgroundMusic);

const createHorse = function () {
  const newHorse = document.createElement("div");
  newHorse.hit = false;
  newHorse.animFrame = 0;
  newHorse.moveFrame = 0;
  newHorse.classList.add("horse");
  gameScreen.appendChild(newHorse);
  newHorse.style.top = `${Math.floor(Math.random() * 35) + 42}%`;
  newHorse.style.left = `0px`;

  const nextAnim = () => {
    newHorse.animFrame += 1;
    newHorse.style.backgroundImage = `url(gameAssets/horse/horseframe${
      newHorse.animFrame % 6
    }.png)`;
  };

  const nextMove = () => {
    newHorse.moveFrame += 1;
    newHorse.style.left = `${(newHorse.moveFrame * window.innerWidth) / 100}px`;
    if (
      parseInt(newHorse.style.getPropertyValue("left"), 10) > window.innerWidth
    ) {
      if (!newHorse.hit) {
        newHorse.hit = true;
        createHorse();
        newHorse.remove();
      }
    }
  };

  setInterval(nextMove, 20);
  setInterval(nextAnim, 140);

  newHorse.addEventListener("click", () => {
    if (ammo >= 1 && levelOngoing == true) {
      if (!newHorse.hit) {
        newHorse.hit = true;
        clearInterval(newHorse.moveInterval);
        clearInterval(newHorse.animInterval);
 
        const currentVetBills = parseInt(score.innerHTML.replace(/\D/g, ""));
        const updatedVetBills = currentVetBills + 100;
        score.innerHTML = "Vet Bills: -$" + updatedVetBills;
        newHorse.remove();
        createHorse();
      
        
      }
    }
  });
};

const createCowboyHorse = function () {
  const newCowboyHorse = document.createElement("div");
  let value = Math.floor(randomNumber * (1000 - 100 + 1)) + 100;
  newCowboyHorse.hit = false;
  newCowboyHorse.animFrame = 0;
  newCowboyHorse.moveFrame = 0;
  newCowboyHorse.classList.add("cbhorse");
  gameScreen.appendChild(newCowboyHorse);
  newCowboyHorse.style.top = `${Math.floor(Math.random() * 35) + 42}%`;
  newCowboyHorse.style.left = `0px`;

  const randomY = Math.floor(Math.random() * 35 + 42);
  const startX = Math.random() < 0.5 ? -100 : window.innerWidth;
  const direction = startX === -100 ? 1 : -1;

  newCowboyHorse.style.top = `${randomY}%`;
  newCowboyHorse.style.left = `${startX}px`;

  const nextAnim = () => {
    newCowboyHorse.animFrame += 1;
    newCowboyHorse.style.backgroundImage = `url(gameAssets/cowboyhorse/cowboyhorse_${
      newCowboyHorse.animFrame % 4
    }.png)`;
  };

  const nextMove = () => {
    newCowboyHorse.moveFrame += 1;
    newCowboyHorse.style.left = `${
      parseInt(newCowboyHorse.style.left) +
      direction * ((newCowboyHorse.moveFrame * window.innerWidth) / 100)
    }px`;
    if (direction === -1 && parseInt(newCowboyHorse.style.left) < -100) {
      if (!newCowboyHorse.hit) {
        newCowboyHorse.hit = true;
        newCowboyHorse.remove();
      }
    } else if (
      direction === 1 &&
      parseInt(newCowboyHorse.style.left) > window.innerWidth
    ) {
      if (!newCowboyHorse.hit) {
        newCowboyHorse.hit = true;
        newCowboyHorse.remove();
      }
    }
    if (direction === -1) {
      newCowboyHorse.style.transform = "scaleX(-1)";
    } else {
      newCowboyHorse.style.transform = "scaleX(1)";
    }
  };

  setInterval(nextMove, 140);
  setInterval(nextAnim, 140);

  newCowboyHorse.addEventListener("click", (event) => {
    const imageCoords = newCowboyHorse.getBoundingClientRect();
    const xCoord = event.clientX - imageCoords.left;
    const yCoord = event.clientY - imageCoords.top;
    if (ammo >= 1 && levelOngoing == true) {
      if (!newCowboyHorse.hit) {
        newCowboyHorse.hit = true;
        money.currentTime = 0;
        money.play();
        const randomNumber = Math.random();
        const value = Math.floor(randomNumber * (500 - 100 + 1)) + 100;
        const currentGold = parseInt(goldCount.innerHTML.replace(/\D/g, ""));
        const updatedGoldCount = currentGold + value;
        goldCount.innerHTML = "$" + updatedGoldCount;
        clearInterval(newCowboyHorse.moveInterval);
        clearInterval(newCowboyHorse.animInterval);
        newCowboyHorse.remove();
        console.log("Target hit!");
       
      }
    }
  });
};

document.addEventListener("keydown", (event) => {
  if ((event.key === "r" || event.key === "R") && ammo < 10) {
    ammo = 10;
    console.log("Reloaded. Ammo: " + ammo);
    reloadSound.currentTime = 0;
    reloadSound.play();
    ammoDisplay.textContent = ammo;
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

const createHorseCarriage = function () {
  const newHorseCarriage = document.createElement("div");
  newHorseCarriage.hit = false;
  newHorseCarriage.animFrame = 0;
  newHorseCarriage.moveFrame = 0;
  newHorseCarriage.classList.add("chorse");
  gameScreen.appendChild(newHorseCarriage);
  newHorseCarriage.style.top = `${Math.floor(Math.random() * 35) + 42}%`;
  newHorseCarriage.style.left = `0px`;

  const nextAnim = () => {
    newHorseCarriage.animFrame += 1;
    newHorseCarriage.style.backgroundImage = `url(gameAssets/horsecarriage/horsecarriage_${
      newHorseCarriage.animFrame % 4
    }.png)`;
  };

  const nextMove = () => {
    newHorseCarriage.moveFrame += 1;
    newHorseCarriage.style.left = `${
      (newHorseCarriage.moveFrame * window.innerWidth) / 100
    }px`;
    if (
      parseInt(newHorseCarriage.style.getPropertyValue("left"), 10) >
      window.innerWidth
    ) {
      if (!newHorseCarriage.hit) {
        newHorseCarriage.hit = true;
        newHorseCarriage.remove();
      }
    }
  };

  setInterval(nextMove, 20);
  setInterval(nextAnim, 140);

  newHorseCarriage.addEventListener("click", (event) => {
    const imageCoords = newHorseCarriage.getBoundingClientRect();
    const xCoord = event.clientX - imageCoords.left;
    const yCoord = event.clientY - imageCoords.top;
    if (ammo >= 1 && levelOngoing == true) {
      if (!newHorseCarriage.hit) {
        newHorseCarriage.hit = true;
        money.currentTime = 0;
        money.play();
        const randomNumber = Math.random();
        const value = Math.floor(randomNumber * (1000 - 100 + 1)) + 500;
        const currentGold = parseInt(goldCount.innerHTML.replace(/\D/g, ""));
        const updatedGoldCount = currentGold + value;
        goldCount.innerHTML = "$" + updatedGoldCount;
        clearInterval(newHorseCarriage.moveInterval);
        clearInterval(newHorseCarriage.animInterval);
        newHorseCarriage.remove();
        console.log("Target hit!");
        
      }
    }
  });
};

document.addEventListener("keydown", (event) => {
  if ((event.key === "r" || event.key === "R") && ammo < 10) {
    ammo = 10;
    console.log("Reloaded. Ammo: " + ammo);
    reloadSound.currentTime = 0;
    reloadSound.play();
    ammoDisplay.textContent = ammo;
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

createHorse();


setTimeout(() => {
  createCowboyHorse();
}, 10000);

setInterval(() => {
  createCowboyHorse();
}, 5000);

setTimeout(() => {
  createHorseCarriage();
}, 3000);

setTimeout(() => {
  createHorseCarriage();
}, 17000);
setTimeout(() => {
  createHorseCarriage();
}, 30000);
setTimeout(() => {
  createHorseCarriage();
}, 45000);

gameScreen.addEventListener("click", () => {
  if (ammo > 0 && levelOngoing == true) {
    shotsTaken++;
    shootSound.currentTime = 0;
    shootSound.play();
    ammo--;
    console.log(ammo);
    ammoDisplay.textContent = ammo;
    gun.src = "gameAssets/gunfire.png";
    setTimeout(() => {
      gun.src = "gameAssets/gunaim.png";
    }, 250);
  } else {
    ammoDisplay.innerHTML = "Press R to reload";
  }
});
function endLevel(){
  let finalScore = parseInt(goldCount.innerHTML.replace(/\D/g, "")); 
  let vetBillFinal = parseInt(vetBillsCount.innerHTML.replace(/\D/g, "")); 
  sessionStorage.setItem("gold", finalScore);
  sessionStorage.setItem("vetBills", vetBillFinal);
  sessionStorage.setItem("currentLevel", 5);
  window.location.href = "betweenLevel.html";
  clearInterval(timerInterval);
}
function startTimer() {
  let timeLeft = timerDuration;
  timerInterval = setInterval(() => {
    console.log(timeLeft);
    timeDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
      endLevel();
      clearInterval(timerInterval);
    }
    timeLeft--; // Move the decrement operation here
  }, 1000);
}


