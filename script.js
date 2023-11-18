const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

hoursInput.addEventListener('input', formatInput);
minutesInput.addEventListener('input', formatInput);
secondsInput.addEventListener('input', formatInput);

function formatInput(e) {
    const input = e.target;
    let value = input.value;

    // Remove any non-numeric characters
    value = value.replace(/\D/g, '');

    // Ensure the input is at most 2 characters long
    if (value.length > 2) {
        value = value.slice(0, 2);
    }

    // Add a preceding zero if the value is a single digit
    if (value.length === 1 && value !== '0') {
        value = '0' + value;
    }

    input.value = value;

    // Check for out-of-range or negative values
    const min = parseInt(input.getAttribute('min'));
    const max = parseInt(input.getAttribute('max'));
    value = parseInt(value);
    if (isNaN(value) || value < min || value > max) {
        alert(`Please enter a number between ${min} and ${max}`);
        value = min; // Reset to minimum value
    }

}

const activeTimers = document.querySelector('.active-timers');
const startButton = document.getElementById('startTimer');
const alertSound = document.getElementById('alert');
const noTimers = document.querySelector('.no-timers'); // Select the "You have no timers currently!" message

const timers = [];

startButton.addEventListener('click', () => {
    const hours = parseInt(document.getElementById('hours').value || 0);
    const minutes = parseInt(document.getElementById('minutes').value || 0);
    const seconds = parseInt(document.getElementById('seconds').value || 0);

    if (isNaN(hours) && isNaN(minutes) && isNaN(seconds)) {
        return;
    }

    const totalTime = hours * 3600 + minutes * 60 + seconds;

    if (isNaN(hours) && isNaN(minutes) && isNaN(seconds)) {
        return;
    }

   

    if (totalTime <= 0) {
        alert("Please enter a valid positive time.");
        return;
    }

    const timer = {
        totalTime,
        remainingTime: totalTime,
        element: document.createElement('div'),
    };


    timer.element.innerHTML = `
        <div class="timer">
            <div class="set">Time Left:</div>
            <div class="timer-content">
                <div class="timer-part">
                   
                    <span class="timer-value">${String(hours).padStart(2, '0')}</span>
                </div>
                <div class="timer-part">
                    <span class="timer-label">:</span>
                    <span class="timer-value">${String(minutes).padStart(2, '0')}</span>
                </div>
                <div class="timer-part">
                    <span class="timer-label">:</span>
                    <span class="timer-value">${String(seconds).padStart(2, '0')}</span>
                </div>
            </div>
            <button class="stop-timer">Delete</button>
        </div>
    `;

    activeTimers.appendChild(timer.element);

    timer.interval = setInterval(() => {
        timer.remainingTime--;
        if (timer.remainingTime === 0) {
            clearInterval(timer.interval);
            timer.element.querySelector('.timer-content').textContent = 'Timer is up!';
            timer.element.querySelector('.stop-timer').textContent = 'Stop';
            timer.element.querySelector('.set').remove();
            
            const yellowDiv = document.createElement('div');
            yellowDiv.className = 'timer-ended';
            yellowDiv.style.backgroundColor = 'yellow';
            yellowDiv.style.width = '100%';
            yellowDiv.style.height = '100px';
            yellowDiv.style.display = 'flex';
            yellowDiv.style.alignItems = 'center';
            yellowDiv.style.justifyContent = 'center';
            yellowDiv.style.borderRadius = '12px';
            yellowDiv.style.marginTop = '30px';
            
            const timeUpHeading = document.createElement('h2');
            timeUpHeading.textContent = "Timer is Up!";
            timeUpHeading.style.paddingRight='200px';
            yellowDiv.appendChild(timeUpHeading);
            
            const stopButton = document.createElement('button');
            stopButton.textContent = 'Stop';
            stopButton.className = 'stop-timer';
            
            stopButton.style.width='80px';
            stopButton.style.height='40px';
            stopButton.style.borderRadius='20px';
            stopButton.style.border='none';
            stopButton.style.backgroundColor='#34344a';
            stopButton.style.color='white';
            stopButton.style.marginLeft="100px";
            yellowDiv.appendChild(stopButton);
            
            activeTimers.replaceChild(yellowDiv, timer.element);
            
            stopButton.addEventListener('click', () => {
                // Remove the yellow div when the "Stop" button is clicked
                alertSound.pause();
                activeTimers.removeChild(yellowDiv);
                // Check if there are no more timers
                if (timers.length === 0) {
                    // Display the "You have no timers currently!" message
                    noTimers.style.display = 'block';
                }
            });
            
            alertSound.play();
        } else {
            const timerParts = timer.element.querySelectorAll('.timer-value');
            const h = Math.floor(timer.remainingTime / 3600);
            const m = Math.floor((timer.remainingTime % 3600) / 60);
            const s = timer.remainingTime % 60;
            timerParts[0].textContent = String(h).padStart(2, '0');
            timerParts[1].textContent = String(m).padStart(2, '0');
            timerParts[2].textContent = String(s).padStart(2, '0');
        }
    }, 1000);

    const stopButton = timer.element.querySelector('.stop-timer');
    stopButton.addEventListener('click', () => {
        clearInterval(timer.interval);
        activeTimers.removeChild(timer.element);
        alertSound.pause(); // Pause the audio when the timer is stopped
        
        // Check if there are no more timers
        if (timers.length === 0) {
            // Display the "You have no timers currently!" message
            noTimers.style.display = 'block';
        }
    });

    timers.push(timer);
    
    // Hide the "You have no timers currently!" message when a timer is added
    noTimers.style.display = 'none';
});
