let resultDisplayed = false;

function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
    resultDisplayed = false; // Reset the flag when the display is cleared
}

function voiceInput() {
    const blob = document.querySelector('.neon-blob');
    const soundWave = document.querySelector('.sound-wave-lines');
    const glowCircle = document.querySelector('.neon-glow-circle');

    // Hide the blob and show the sound wave lines
    blob.style.display = 'none';
    soundWave.style.display = 'flex';

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript.trim().toLowerCase();
        
        if (result === 'clear' || result === 'reset') {
            clearDisplay();
        } else {
            if (resultDisplayed) {
                clearDisplay();
            }
            document.getElementById('display').value += result;
            setTimeout(calculate, 1000);
        }
    };

    recognition.onend = function() {
        // Hide the sound wave lines, show the neon glow circle
        soundWave.style.display = 'none';
        glowCircle.style.display = 'flex';

        // Set a timeout to switch from the glow circle to the blob
        setTimeout(function() {
            glowCircle.style.display = 'none';
            blob.style.display = 'block';
        }, 5000); // Adjust the timeout duration as needed
    };

    recognition.start();
}
function calculate() {
    let input = document.getElementById('display').value;
    try {
        let result = eval(input);
        document.getElementById('display').value = result;
        resultDisplayed = true; // Set the flag to true after displaying the result

        // Convert symbols to words and generate the speech output
        let spokenText = convertSymbolsToWords(input);
        spokenText += ` equals ${result}`;
        speak(spokenText);

        // Automatically clear the display after 15 seconds (3000 milliseconds)
        setTimeout(clearDisplay, 15000);
    } catch (error) {
        document.getElementById('display').value = 'Error';
        resultDisplayed = true; // Set the flag to true even on error

        // Generate and play the voice output for error
        speak('There was an error with your calculation.');

        // Automatically clear the display after 1 seconds (3000 milliseconds)
        setTimeout(clearDisplay, 1000);
    }
}

function convertSymbolsToWords(expression) {
    return expression
        .replace(/\*/g, ' multiplied by ')
        .replace(/\//g, ' divided by ')
        .replace(/\+/g, ' plus ')
        .replace(/\-/g, ' minus ');
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}