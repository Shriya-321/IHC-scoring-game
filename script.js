// Load the sound
const clickSound = new Audio("click.wav");

// Function to play the sound
function playClickSound() {
    clickSound.currentTime = 0; // Reset sound in case it's played in quick succession
    clickSound.play();
}

// Add event listeners to all buttons
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", playClickSound);
});

// Load and play background music
const bgMusic = new Audio("background.mp3");
bgMusic.loop = true; // Loop the music
bgMusic.volume = 0.5; // Set volume (0.0 to 1.0)

const musicToggle = document.getElementById("musicToggle");

musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.innerText = "🔊 Mute Music";
    } else {
        bgMusic.pause();
        musicToggle.innerText = "🔇 Play Music";
    }
});

// List of lines to display
const textLines = [
    "Welcome! You've come at just the right time. Neurotrauma researchers need your help with immunohistochemistry (IHC) images!",
    "What is IHC? IHC is just a lab technique that helps researchers identify the shape and location of different cell types in a tissue sample.",
    "And how will you help? Well, you're going to score IHC images. You'll look at 3 factors and score each one on a scale of 1 to 10 for different IHC tissue sample images:",
    "1. Discernible pathology (DP): How much contrast is there between the cells and the background?",
    "2. Background noise (BN): How dark is the space between cells?",
    "3. Uniform staining (US): How consistent/even is the staining?",
    "Based on your scoring, we will compute your final score for you. Let's see how close your scores are to the researchers'!",
];

let currentIndex = 0;

function showNextLine() {
    const textDisplay = document.getElementById("textDisplay");
    const nextButton = document.getElementById("nextButton");

    if (currentIndex < textLines.length) {
        const newLine = document.createElement("p");
        newLine.innerText = textLines[currentIndex];
        textDisplay.appendChild(newLine);
        currentIndex++;

        // Change button text based on progress
        if (currentIndex === textLines.length) {
            nextButton.innerText = "Start Game"; // Last instruction → "Start Game"
            nextButton.onclick = startGame;
        } else {
            nextButton.innerText = "Next"; // Before last → "Next"
        }
    }
}


function updateTrackers() {
    document.getElementById("roundTracker").innerText = currentRound + 1; 
    document.getElementById("pointTracker").innerText = playerPoints; 
}

function startGame() {
    bgMusic.play();
    document.getElementById("musicToggle").style.display = "block";
    console.log("Game is starting...");
    document.getElementById("instructions").style.display = "none";
    document.getElementById("startGameButton").style.display = "none";
    const game = document.getElementById("game");
    game.style.display = "block";  
    updateTrackers();
    setTimeout(() => {
        game.style.transform = "rotateY(0deg)";
    }, 10);
}

const researchScores = [6.825, 7.125, 6.75, 7.725, 5.125]; 
const totalRounds = researchScores.length; 
let currentRound = 0;
let playerPoints = 0;
updateTrackers();

function calculateScore() {
    let dp = parseFloat(document.getElementById("dp").value);
    let bn = parseFloat(document.getElementById("bn").value);
    let us = parseFloat(document.getElementById("us").value);

    console.log("DP:", dp, "BN:", bn, "US:", us);

    if (isNaN(dp) || dp < 1 || dp > 10 || 
        isNaN(bn) || bn < 1 || bn > 10 || 
        isNaN(us) || us < 1 || us > 10) {
        document.getElementById("result").innerText = "⚠️ Please enter values between 1 and 10.";
        return;
    }

    let finalScore = 0.55 * dp + 0.25 * (10 - bn) + 0.20 * us;
    let researchScore = researchScores[currentRound];
    let scoreDifference = Math.abs(finalScore - researchScore);

    console.log("Final Score:", finalScore, "Research Score:", researchScore, "Difference:", scoreDifference);

    if (scoreDifference <= 1.5) {  
        playerPoints++;
        document.getElementById("result").innerText = `Your final score: ${finalScore.toFixed(2)} ✅ Close match! +1 Point!`;
        document.getElementById("WinSound").play();
    } else {
        document.getElementById("result").innerText = `Your final score: ${finalScore.toFixed(2)} ❌ We got something a little different. Research score: ${researchScore}`;
        document.getElementById("LoseSound").play();
    }

    if (currentRound < totalRounds - 1) {
        setTimeout(nextRound, 2000); 
    } else {
        setTimeout(endGame, 2000);
    }
}

const ihcImageDescriptions = [
    "This image targets the IBA1 (ionized calcium-binding adaptor molecule 1) antigen to stain for microglia, resident immune cells of the brain.",
    "This image targets the GFAP (glial fibrillary acidic protein) antigen to stain for astrocytes, resident immune cells of the brain that can form glial scars.",
    "This image targets the MAP2 (microtubule-associated protein 2) antigen to stain for neuronal dendrites, which is evident by the streaks of staining.",
    "This image targets the IBA1 (ionized calcium-binding adaptor molecule 1) antigen to stain for microglia, resident immune cells of the brain. A different concentration of antibodies were used here, compared to the other IBA1 image.",
    "This image targets the MAP2 (microtubule-associated protein 2) antigen to stain for neuronal dendrites, which is evident by the streaks of staining. A different concentration of antibodies were used here, compared to the other MAP2 image."
];

function nextRound() {
    let gameContainer = document.getElementById("game");
    gameContainer.classList.add("flip-transition");

    setTimeout(() => {
        currentRound++; // ✅ Only increment here!

        document.getElementById("dp").value = "";
        document.getElementById("bn").value = "";
        document.getElementById("us").value = "";
        document.getElementById("result").innerText = "";
        document.getElementById("gameImage").src = `ihc_sample${currentRound + 1}.jpeg`;

        console.log("Current Round:", currentRound);
        console.log("Description:", ihcImageDescriptions[currentRound]);

        let desc = document.getElementById("imageDescription");
        desc.innerText = ihcImageDescriptions[currentRound]; // ✅ Ensure the text updates
        desc.style.display = "none"; // ✅ Hide it initially
        
        setTimeout(() => {
            gameContainer.classList.remove("flip-transition");
            updateTrackers();
        }, 200);
    }, 600);
}

function toggleDescription() {
    let desc = document.getElementById("imageDescription");

    if (!desc) {
        console.error("Error: #imageDescription element not found.");
        return;
    }

    if (desc.innerText.trim() === "") {
        desc.innerText = ihcImageDescriptions[currentRound]; // Ensure it gets text
    }

    desc.style.display = desc.style.display === "none" ? "block" : "none";
}



function endGame() {
    let endSound = new Audio("GameOverSound.wav"); // Load the sound file
    endSound.play(); // Play the sound

    // Wait for a moment before redirecting to allow sound to play
    setTimeout(() => {
        window.location.href = `gameover.html?score=${playerPoints}/${totalRounds}`;
    }, 1500); // Adjust delay based on sound length
}


function restartGame() {
    currentRound = 0;
    playerPoints = 0;
    document.getElementById("dp").value = "";
    document.getElementById("bn").value = "";
    document.getElementById("us").value = "";
    document.getElementById("result").innerText = "";
    document.getElementById("gameImage").src = "ihc_sample1.jpg";
    updateTrackers();
}

window.onload = function() {
    console.log("JavaScript loaded!");
    document.getElementById("instructions").classList.add("show");
    document.getElementById("nextButton").onclick = showNextLine;
};