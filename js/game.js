// Snake Game Logic targeted for the 404 Page Interactive Easter Egg

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return; // Fail safely if not on 404 page
    const ctx = canvas.getContext('2d');
    
    // Scale properties
    const gridSize = 20; 
    let tileCountX = canvas.width / gridSize;
    let tileCountY = canvas.height / gridSize;

    // Game Objects
    let snake = [
        {x: 10, y: 10}
    ];
    let apple = {x: 15, y: 10};
    let velocity = {x: 0, y: 0}; // Starts stationary
    
    // Scores
    let score = 0;
    let highScore = localStorage.getItem('portfolioSnakeHighScore') || 0;
    
    const uiScore = document.getElementById('score');
    const uiHighScore = document.getElementById('highscore');
    
    if (uiHighScore) uiHighScore.innerText = highScore;

    let isPlaying = false;
    let gameLoopActive = false;

    // Theme Fetcher Mechanism (Pulls var(--accent-cyan) from your primary CSS)
    const getThemeColor = (cssVar, fallback) => {
        let val = getComputedStyle(document.body).getPropertyValue(cssVar).trim();
        return val ? val : fallback;
    };

    function resetGame() {
        snake = [{x: 10, y: 10}, {x: 9, y: 10}]; // Provide a small starter body
        velocity = {x: 0, y: 0};
        score = 0;
        if(uiScore) uiScore.innerText = score;
        spawnApple();
        isPlaying = false;
        
        drawGame(); // Flush canvas one time with initial state
        
        // Draw Overlay Help Text via Canvas
        ctx.fillStyle = getThemeColor('--text-white', '#ffffff');
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.textAlign = "center";
        
        // Slight delay drawing text just to ensure fonts load
        setTimeout(() => {
            ctx.fillText("Press Any Direction to Start", canvas.width / 2, canvas.height / 2 + 60);
        }, 100);
    }

    function spawnApple() {
        apple.x = Math.floor(Math.random() * tileCountX);
        apple.y = Math.floor(Math.random() * tileCountY);
        // Ensure the apple doesn't accidentally spawn internally on the snake's body
        for (let segment of snake) {
            if (segment.x === apple.x && segment.y === apple.y) {
                spawnApple();
                break;
            }
        }
    }

    function update() {
        if (!isPlaying) return;

        // Move snakes logical head calculation
        let headX = snake[0].x + velocity.x;
        let headY = snake[0].y + velocity.y;

        // Wall wrapping (portal mechanic instead of crash wall)
        if (headX < 0) headX = tileCountX - 1;
        if (headX >= tileCountX) headX = 0;
        if (headY < 0) headY = tileCountY - 1;
        if (headY >= tileCountY) headY = 0;

        let newHead = {x: headX, y: headY};

        // Check self-collision (Game Over scenario)
        for (let segment of snake) {
            if (segment.x === newHead.x && segment.y === newHead.y) {
                // Determine new High Score capabilities
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('portfolioSnakeHighScore', highScore);
                    if(uiHighScore) uiHighScore.innerText = highScore;
                }
                resetGame();
                return;
            }
        }

        // Apply new head mapping
        snake.unshift(newHead);

        // Check apple consumption bounding
        if (newHead.x === apple.x && newHead.y === apple.y) {
            score += 10;
            if(uiScore) uiScore.innerText = score;
            spawnApple(); // Expand queue without popping tail
        } else {
            snake.pop(); // Pop tail to maintain scale moving forward
        }
    }

    function drawGame() {
        // Erase canvas cache (Transparency maintained)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Beautiful Premium Apple (Soft Edge Glow)
        ctx.fillStyle = "#ff4757"; // Sharp vibrant Coral
        ctx.beginPath();
        // Slightly shrunk scaling
        ctx.arc(apple.x * gridSize + gridSize/2, apple.y * gridSize + gridSize/2, gridSize/2 - 2, 0, 2 * Math.PI);
        ctx.fill();

        // Draw The Snake Object dynamically styling against Theme
        const snakeColor = getThemeColor('--accent-cyan', '#00d29d'); // Default to cyan if CSS fetch fails
        const headColor = getThemeColor('--text-white', '#ffffff'); // Give head unique contrasting look
        
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? headColor : snakeColor;
            // Draw standard block structure (margin of 1px for visible grid segmentation)
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
            
            // Add subtle glow to the head
            if(index === 0) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = headColor;
                ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
                ctx.shadowBlur = 0; // Reset
            }
        });
    }

    // High performance asynchronous runtime looping at ~10 FPS (100ms)
    function main() {
        if (!gameLoopActive) return; // Kill stale cycles
        
        setTimeout(function onTick() {
            update();
            drawGame();
            
            // Re-call game loop infinitely while active
            if (gameLoopActive) {
                main();
            }
        }, 110); // Standard optimal classic snake tick speed
    }

    // Unified input mapping for Keyboard Event Listener
    window.addEventListener('keydown', e => {
        let key = e.key;
        
        // Track valid gaming strokes
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(key)) {
            // Only prevent auto scrolling when on the 404 page inside the snake canvas
            // We know we are on the 404 because canvas is mounted!
            e.preventDefault(); 
            
            // Trigger activation loop
            if (!isPlaying) {
                isPlaying = true;
                if (!gameLoopActive) {
                    gameLoopActive = true;
                    main();
                }
            }
        }
        
        // Handle vector routing & disallow immediate 180 reversals
        if ((key === 'ArrowUp' || key === 'w') && velocity.y !== 1) { velocity.x = 0; velocity.y = -1; }
        if ((key === 'ArrowDown' || key === 's') && velocity.y !== -1) { velocity.x = 0; velocity.y = 1; }
        if ((key === 'ArrowLeft' || key === 'a') && velocity.x !== 1) { velocity.x = -1; velocity.y = 0; }
        if ((key === 'ArrowRight' || key === 'd') && velocity.x !== -1) { velocity.x = 1; velocity.y = 0; }
    });

    // Touch Support for Mobile / Portrait Viewers
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        e.preventDefault(); // Stop mobile screen dragged refreshes
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;
        
        let dx = touchEndX - touchStartX;
        let dy = touchEndY - touchStartY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe registered
            if (dx > 30 && velocity.x !== -1) { velocity.x = 1; velocity.y = 0; } 
            else if (dx < -30 && velocity.x !== 1) { velocity.x = -1; velocity.y = 0; }
        } else {
            // Vertical swipe registered
            if (dy > 30 && velocity.y !== -1) { velocity.x = 0; velocity.y = 1; } 
            else if (dy < -30 && velocity.y !== 1) { velocity.x = 0; velocity.y = -1; } 
        }
        
        if (!isPlaying && (Math.abs(dx) > 30 || Math.abs(dy) > 30)) {
            isPlaying = true;
            if (!gameLoopActive) {
                gameLoopActive = true;
                main();
            }
        }
    });

    // Fire default initialization rendering frame
    resetGame();
});
