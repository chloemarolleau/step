function readStepCounts() {
  let filenames = require("Storage").list("\step_+")
  
    // Boucle sur les deux derniers fichiers
    for (const filename of filenames) {
        console.log(`Trying to read file: ${filename}`); // Afficher le nom de fichier

        // Lecture du contenu du fichier
        const fileContent = require("Storage").read(filename);

        if (fileContent !== undefined) {
            // Convertir la chaîne de caractères en tableau de bytes
            const bytes = new Uint8Array(fileContent.length);
            for (let j = 0; j < fileContent.length; ++j) {
                bytes[j] = fileContent.charCodeAt(j); // Convertir chaque caractère en byte
            }
            // Affichage des données binaires lues depuis le fichier
            console.log(`Data read from ${filename}:`, bytes[0]);
        } else {
            // Affichage d'une erreur si le fichier n'a pas été trouvé ou est vide
            console.error(`Error reading ${filename}: File not found or empty.`);
        }
    }
}




// Initialize step counter
let stepCount = 0;
let lastTotalStepCount = -1;

// Function to update step count every step
Bangle.on("step", function(sc) {
    if (lastTotalStepCount == -1) {
      lastTotalStepCount = sc -1;
    }
    stepCount = stepCount + (sc - lastTotalStepCount);
      console.log(stepCount);
  lastTotalStepCount = sc;
});

// Function to store step count in a file with a timestamp
function storeStepCount() {
    // Get current timestamp
    const now = new Date();
    const timestamp = `${now.getFullYear()}_${('0' + (now.getMonth() + 1)).slice(-2)}_${('0' + now.getDate()).slice(-2)}_${('0' + now.getHours()).slice(-2)}_${('0' + now.getMinutes()).slice(-2)}`;
    
    // Create filename
    const filename = `step_${timestamp}_1_1.bin`;

    // Create buffer with step count
    const buf = new Uint8Array([stepCount & 0xFF]);

    // Write step count to file
    require("Storage").write(filename, buf);

    console.log(`Step count for ${timestamp} has been written to ${filename}.`);

    // Reset step count
    stepCount = 0;
}

// Set interval to store step count every minute
setInterval(storeStepCount, 60000);
setInterval(readStepCounts,120000);


