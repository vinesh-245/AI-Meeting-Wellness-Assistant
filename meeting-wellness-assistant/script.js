// MindfulMeet - AI Meeting Wellness Assistant
// Interactive JavaScript functionality

class MindfulMeet {
    constructor() {
        this.currentDate = new Date();
        this.wellnessScore = 85;
        this.aiUsageHours = 3;
        this.meetingCount = 6;
        this.burnoutRisk = 35;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateWellnessScore();
        this.updateDate();
        this.startWellnessMonitoring();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // Calendar navigation
        document.getElementById('prevDay')?.addEventListener('click', () => this.navigateDay(-1));
        document.getElementById('nextDay')?.addEventListener('click', () => this.navigateDay(1));

        // Recommendation buttons
        document.querySelectorAll('.btn-apply').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleRecommendation(e));
        });

        // Wellness tool buttons
        document.querySelectorAll('.btn-tool').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleWellnessTool(e));
        });

        // Wellness score click for details
        document.getElementById('wellnessScore')?.addEventListener('click', () => this.showWellnessDetails());
    }

    navigateDay(direction) {
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        this.updateDate();
        this.updateCalendarView();
        this.showNotification(`Viewing ${direction > 0 ? 'next' : 'previous'} day`, 'info');
    }

    updateDate() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = this.currentDate.toLocaleDateString('en-US', options);
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    }

    updateCalendarView() {
        // Simulate different meeting patterns for different days
        const timeline = document.querySelector('.calendar-timeline');
        if (!timeline) return;

        const meetings = this.generateMeetingsForDate(this.currentDate);
        timeline.innerHTML = meetings.map(meeting => {
            if (meeting.type === 'break') {
                return `
                    <div class="time-slot">
                        <span class="time">${meeting.time}</span>
                        <div class="break-suggestion">${meeting.content}</div>
                    </div>
                `;
            } else {
                return `
                    <div class="time-slot">
                        <span class="time">${meeting.time}</span>
                        <div class="meeting ${meeting.stress}">
                            ${meeting.title} 
                            ${meeting.hasAI ? '<span class="ai-tag">AI</span>' : ''}
                            ${meeting.stress === 'high-stress' ? '<span class="stress-indicator">⚠️</span>' : ''}
                        </div>
                    </div>
                `;
            }
        }).join('');
    }

    generateMeetingsForDate(date) {
        const dayOfWeek = date.getDay();
        const meetings = [];

        // Different patterns for different days
        if (dayOfWeek === 1) { // Monday
            meetings.push(
                { time: '9:00 AM', title: 'Team Standup', stress: 'medium-stress', hasAI: false },
                { time: '10:30 AM', title: 'Project Review', stress: 'high-stress', hasAI: true },
                { time: '11:30 AM', type: 'break', content: '💡 Suggested: 15-min mindful break' },
                { time: '2:00 PM', title: 'Client Call', stress: 'medium-stress', hasAI: true },
                { time: '4:00 PM', title: '1:1 with Manager', stress: 'low-stress', hasAI: false }
            );
        } else if (dayOfWeek === 5) { // Friday
            meetings.push(
                { time: '9:00 AM', title: 'Weekly Wrap-up', stress: 'low-stress', hasAI: false },
                { time: '11:00 AM', title: 'Demo Preparation', stress: 'medium-stress', hasAI: true },
                { time: '2:00 PM', type: 'break', content: '🌟 Suggested: Celebration break!' },
                { time: '3:00 PM', title: 'Team Social', stress: 'low-stress', hasAI: false }
            );
        } else {
            // Default pattern
            meetings.push(
                { time: '9:00 AM', title: 'Team Standup', stress: 'high-stress', hasAI: false },
                { time: '10:00 AM', title: 'Client Review', stress: 'medium-stress', hasAI: true },
                { time: '11:00 AM', type: 'break', content: '💡 Suggested: 15-min mindful break' },
                { time: '11:30 AM', title: '1:1 with Sarah', stress: 'low-stress', hasAI: false },
                { time: '2:00 PM', title: 'Board Presentation', stress: 'high-stress', hasAI: true }
            );
        }

        return meetings;
    }

    handleRecommendation(e) {
        const button = e.target;
        const recommendation = button.closest('.recommendation');
        const title = recommendation.querySelector('h4').textContent;

        switch (title) {
            case 'Schedule Buffer Time':
                this.applyBufferTime();
                break;
            case 'Mindful Break':
                this.startBreathingExercise();
                break;
            case 'AI Usage Limit':
                this.setAIReminder();
                break;
        }

        button.textContent = 'Applied ✓';
        button.style.background = '#48bb78';
        setTimeout(() => {
            button.textContent = 'Apply';
            button.style.background = '#667eea';
        }, 2000);
    }

    handleWellnessTool(e) {
        const button = e.target;
        const toolCard = button.closest('.tool-card');
        const title = toolCard.querySelector('h4').textContent;

        switch (title) {
            case 'Breathing Exercise':
                this.startBreathingExercise();
                break;
            case 'Eye Rest':
                this.startEyeRest();
                break;
            case 'AI Usage Tracker':
                this.showAIUsageTracker();
                break;
            case 'Focus Mode':
                this.toggleFocusMode();
                break;
        }
    }

    applyBufferTime() {
        this.showNotification('Buffer time added to your calendar! 10-minute breaks scheduled between meetings.', 'success');
        this.updateWellnessScore(5);
    }

    startBreathingExercise() {
        this.showBreathingModal();
    }

    showBreathingModal() {
        const modal = document.createElement('div');
        modal.className = 'breathing-modal';
        modal.innerHTML = `
            <div class="breathing-content">
                <h3>🌸 Mindful Breathing Exercise</h3>
                <div class="breathing-circle" id="breathingCircle"></div>
                <p id="breathingInstruction">Click to start</p>
                <div class="breathing-controls">
                    <button id="startBreathing" class="btn-breathing">Start</button>
                    <button id="closeBreathing" class="btn-breathing secondary">Close</button>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .breathing-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .breathing-content {
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                width: 90%;
            }
            .breathing-circle {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 20px auto;
                transition: transform 4s ease-in-out;
            }
            .breathing-circle.inhale {
                transform: scale(1.3);
            }
            .breathing-circle.exhale {
                transform: scale(1);
            }
            .breathing-controls {
                margin-top: 20px;
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            .btn-breathing {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            }
            .btn-breathing:not(.secondary) {
                background: #667eea;
                color: white;
            }
            .btn-breathing.secondary {
                background: #e2e8f0;
                color: #4a5568;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        let breathingActive = false;
        let breathingInterval;

        document.getElementById('startBreathing').addEventListener('click', () => {
            if (!breathingActive) {
                this.startBreathingCycle(modal);
            }
        });

        document.getElementById('closeBreathing').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
            if (breathingInterval) clearInterval(breathingInterval);
        });
    }

    startBreathingCycle(modal) {
        const circle = modal.querySelector('#breathingCircle');
        const instruction = modal.querySelector('#breathingInstruction');
        const startBtn = modal.querySelector('#startBreathing');
        
        startBtn.textContent = 'Breathing...';
        startBtn.disabled = true;
        
        let cycle = 0;
        const totalCycles = 5;
        
        const breathingInterval = setInterval(() => {
            if (cycle >= totalCycles * 2) {
                clearInterval(breathingInterval);
                instruction.textContent = 'Great job! You completed the breathing exercise.';
                startBtn.textContent = 'Start Again';
                startBtn.disabled = false;
                this.updateWellnessScore(3);
                this.showNotification('Breathing exercise completed! +3 wellness points', 'success');
                return;
            }
            
            if (cycle % 2 === 0) {
                // Inhale
                circle.className = 'breathing-circle inhale';
                instruction.textContent = 'Breathe in slowly... (4 seconds)';
            } else {
                // Exhale
                circle.className = 'breathing-circle exhale';
                instruction.textContent = 'Breathe out slowly... (4 seconds)';
            }
            
            cycle++;
        }, 4000);
    }

    startEyeRest() {
        this.showNotification('Eye rest reminder set! Look at something 20 feet away for 20 seconds every 20 minutes.', 'info');
        
        // Set up 20-20-20 rule reminders
        setInterval(() => {
            this.showNotification('👁️ Eye break time! Look at something 20 feet away for 20 seconds.', 'info');
        }, 20 * 60 * 1000); // Every 20 minutes
    }

    showAIUsageTracker() {
        const modal = document.createElement('div');
        modal.className = 'ai-tracker-modal';
        modal.innerHTML = `
            <div class="ai-tracker-content">
                <h3>🤖 AI Usage Tracker</h3>
                <div class="ai-stats">
                    <div class="ai-stat">
                        <span class="ai-stat-number">${this.aiUsageHours}h</span>
                        <span class="ai-stat-label">Today's AI Usage</span>
                    </div>
                    <div class="ai-stat">
                        <span class="ai-stat-number">40%</span>
                        <span class="ai-stat-label">Productivity Boost</span>
                    </div>
                    <div class="ai-stat">
                        <span class="ai-stat-number">${this.burnoutRisk}%</span>
                        <span class="ai-stat-label">Burnout Risk</span>
                    </div>
                </div>
                <div class="ai-recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                        <li>Take a 15-minute tech break</li>
                        <li>Switch to manual tasks for the next hour</li>
                        <li>Practice mindful breathing</li>
                    </ul>
                </div>
                <button id="closeAITracker" class="btn-close">Close</button>
            </div>
        `;

        // Add styles for AI tracker modal
        const style = document.createElement('style');
        style.textContent = `
            .ai-tracker-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .ai-tracker-content {
                background: white;
                padding: 40px;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
            }
            .ai-stats {
                display: flex;
                justify-content: space-around;
                margin: 20px 0;
            }
            .ai-stat {
                text-align: center;
            }
            .ai-stat-number {
                display: block;
                font-size: 2rem;
                font-weight: 700;
                color: #667eea;
            }
            .ai-stat-label {
                font-size: 0.9rem;
                color: #718096;
            }
            .ai-recommendations {
                margin: 20px 0;
            }
            .ai-recommendations ul {
                list-style-type: none;
                padding: 0;
            }
            .ai-recommendations li {
                padding: 8px 0;
                border-bottom: 1px solid #e2e8f0;
            }
            .btn-close {
                background: #667eea;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                width: 100%;
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        document.getElementById('closeAITracker').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });
    }

    toggleFocusMode() {
        const isActive = document.body.classList.toggle('focus-mode');
        
        if (isActive) {
            this.showNotification('🎯 Focus mode activated! Notifications blocked for 25 minutes.', 'success');
            
            // Add focus mode styles
            const style = document.createElement('style');
            style.id = 'focus-mode-style';
            style.textContent = `
                body.focus-mode {
                    filter: sepia(20%);
                }
                body.focus-mode .card {
                    opacity: 0.8;
                }
                body.focus-mode .hero-section {
                    background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
                }
            `;
            document.head.appendChild(style);
            
            // Auto-disable after 25 minutes
            setTimeout(() => {
                document.body.classList.remove('focus-mode');
                const focusStyle = document.getElementById('focus-mode-style');
                if (focusStyle) document.head.removeChild(focusStyle);
                this.showNotification('Focus session completed! Great work! 🎉', 'success');
                this.updateWellnessScore(5);
            }, 25 * 60 * 1000);
        } else {
            this.showNotification('Focus mode deactivated.', 'info');
            const focusStyle = document.getElementById('focus-mode-style');
            if (focusStyle) document.head.removeChild(focusStyle);
        }
    }

    setAIReminder() {
        this.showNotification('AI usage reminder set! You\'ll be notified when you reach 4 hours of AI tool usage.', 'info');
    }

    updateWellnessScore(change = 0) {
        this.wellnessScore = Math.max(0, Math.min(100, this.wellnessScore + change));
        const scoreElement = document.getElementById('wellnessScore');
        const scoreLabel = document.querySelector('.score-label');
        
        if (scoreElement) {
            scoreElement.textContent = this.wellnessScore;
            
            // Update score color and label based on value
            if (this.wellnessScore >= 80) {
                scoreLabel.textContent = 'Excellent';
                scoreElement.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
            } else if (this.wellnessScore >= 60) {
                scoreLabel.textContent = 'Good';
                scoreElement.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            } else if (this.wellnessScore >= 40) {
                scoreLabel.textContent = 'Fair';
                scoreElement.style.background = 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)';
            } else {
                scoreLabel.textContent = 'Needs Attention';
                scoreElement.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
            }
        }
        
        // Update burnout risk based on wellness score
        this.burnoutRisk = Math.max(0, 100 - this.wellnessScore);
        const riskFill = document.querySelector('.risk-fill');
        const riskLevel = document.querySelector('.risk-level');
        
        if (riskFill && riskLevel) {
            riskFill.style.width = `${this.burnoutRisk}%`;
            
            if (this.burnoutRisk < 30) {
                riskLevel.textContent = 'Low';
                riskLevel.style.color = '#48bb78';
            } else if (this.burnoutRisk < 60) {
                riskLevel.textContent = 'Moderate';
                riskLevel.style.color = '#ed8936';
            } else {
                riskLevel.textContent = 'High';
                riskLevel.style.color = '#f56565';
            }
        }
    }

    showWellnessDetails() {
        const details = [
            `Meeting Load: ${this.meetingCount} meetings today`,
            `AI Usage: ${this.aiUsageHours} hours`,
            `Break Time: ${Math.max(0, 8 - this.meetingCount)} hours available`,
            `Stress Level: ${this.burnoutRisk < 30 ? 'Low' : this.burnoutRisk < 60 ? 'Moderate' : 'High'}`
        ];
        
        this.showNotification(`Wellness Score Breakdown:\n${details.join('\n')}`, 'info');
    }

    startWellnessMonitoring() {
        // Simulate real-time wellness monitoring
        setInterval(() => {
            // Randomly adjust wellness score based on simulated activities
            const activities = [
                { name: 'Completed a task', change: 1 },
                { name: 'Took a short break', change: 2 },
                { name: 'Long meeting without break', change: -1 },
                { name: 'Used AI tool efficiently', change: 1 },
                { name: 'Excessive screen time', change: -1 }
            ];
            
            if (Math.random() < 0.3) { // 30% chance of activity
                const activity = activities[Math.floor(Math.random() * activities.length)];
                this.updateWellnessScore(activity.change);
            }
        }, 30000); // Check every 30 seconds
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showNotification('Welcome to MindfulMeet! 🧠 Your AI-powered wellness assistant is ready to help you combat burnout while staying productive.', 'success');
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add notification styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 1000;
                    max-width: 300px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: slideIn 0.3s ease;
                }
                .notification-success {
                    background: #48bb78;
                }
                .notification-info {
                    background: #4299e1;
                }
                .notification-warning {
                    background: #ed8936;
                }
                .notification-error {
                    background: #f56565;
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MindfulMeet();
});