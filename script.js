// Stopwatch class  functionality
class Stopwatch {
    constructor() {
        // Time tracking variables
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapCounter = 0;

        // DOM elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.millisecondsDisplay = document.getElementById('millisecondsDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.lapTimes = document.getElementById('lapTimes');
        this.themeToggle = document.getElementById('themeToggle');

        // Initialize event listeners
        this.initEventListeners();
    }

    // Set event listeners
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case ' ': 
                    e.preventDefault();
                    this.isRunning ? this.stop() : this.start();
                    break;
                case 'r': 
                    this.reset();
                    break;
                case 'l': 
                    if (this.isRunning) this.recordLap();
                    break;
            }
        });
    }

    // Start the stopwatch
    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;
            this.updateButtonStates();
        }
    }

    // Stop the stopwatch
    stop() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.updateButtonStates();
        }
    }

    // Reset the stopwatch
    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.lapCounter = 0;
        this.updateDisplay();
        this.updateButtonStates();
        this.clearLapTimes();
    }

    // Update the time display
    updateDisplay() {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
        }

        const time = this.formatTime(this.elapsedTime);
        this.timeDisplay.textContent = time.main;
        this.millisecondsDisplay.textContent = time.milliseconds;

        this.timeDisplay.classList.add('time-pulse');
        setTimeout(() => this.timeDisplay.classList.remove('time-pulse'), 100);
    }

    // Time format
    formatTime(totalMilliseconds) {
        const hours = Math.floor(totalMilliseconds / 3600000);
        const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
        const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
        const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

        return {
            main: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            milliseconds: milliseconds.toString().padStart(2, '0')
        };
    }

    // Record a lap time
    recordLap() {
        if (this.isRunning) {
            this.lapCounter++;
            const lapTime = this.formatTime(this.elapsedTime);
            this.addLapTime(this.lapCounter, `${lapTime.main}.${lapTime.milliseconds}`);
        }
    }

    // Add lap time to display
    addLapTime(lapNumber, time) {
        const lapElement = document.createElement('div');
        lapElement.className = 'lap-time';
        lapElement.innerHTML = `
            <span class="lap-number">Lap ${lapNumber}</span>
            <span>${time}</span>
        `;
        this.lapTimes.insertBefore(lapElement, this.lapTimes.firstChild);
    }

    // Clear all lap times
    clearLapTimes() {
        this.lapTimes.innerHTML = '';
    }

    // Update button states based on stopwatch status
    updateButtonStates() {
        this.startBtn.disabled = this.isRunning;
        this.stopBtn.disabled = !this.isRunning;
        this.lapBtn.disabled = !this.isRunning;
    }

    // Toggle between light and dark themes
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        this.themeToggle.textContent = isDark ? '☀️ LIGHT MODE' : '🌙 DARK MODE';
        
        // To save theme preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Load saved theme preference
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeToggle.textContent = '☀️ LIGHT MODE';
        }
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const stopwatch = new Stopwatch();
    stopwatch.loadTheme();

    // Show keyboard shortcuts hint
    console.log('Keyboard shortcuts:');
    console.log('Spacebar: Start/Stop');
    console.log('R: Reset');
    console.log('L: Record Lap');
});
