class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.player = new Player(400, 300);
        this.map = new Map();
        this.battle = new Battle();
        this.gameState = 'exploring'; // exploring, battle
        
        this.setupEventListeners();
        this.gameLoop();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth - 8; // Subtract border width
        const containerHeight = container.clientHeight;
        const aspectRatio = 4/3;
        
        let width = containerWidth;
        let height = width / aspectRatio;
        
        if (height > containerHeight) {
            height = containerHeight;
            width = height * aspectRatio;
        }
        
        this.canvas.width = 800;  // 内部解像度は固定
        this.canvas.height = 600;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
    }

    setupEventListeners() {
        // キーボードイベント
        window.addEventListener('keydown', (e) => {
            if (this.gameState === 'exploring') {
                switch(e.key) {
                    case 'ArrowUp':
                        this.player.move(0, -1);
                        break;
                    case 'ArrowDown':
                        this.player.move(0, 1);
                        break;
                    case 'ArrowLeft':
                        this.player.move(-1, 0);
                        break;
                    case 'ArrowRight':
                        this.player.move(1, 0);
                        break;
                    case 'Enter':
                        document.getElementById('status-window').classList.toggle('hidden');
                        break;
                }
            } else if (this.gameState === 'battle') {
                switch(e.key) {
                    case 'ArrowUp':
                        this.battle.selectPreviousCommand();
                        break;
                    case 'ArrowDown':
                        this.battle.selectNextCommand();
                        break;
                    case 'Enter':
                        const result = this.battle.executeCommand();
                        if (result === 'win' || result === 'lose' || result === 'escape') {
                            this.gameState = 'exploring';
                        }
                        break;
                }
            }
        });

        // ゲームコントロール
        const buttons = {
            'btn-up': [0, -1],
            'btn-down': [0, 1],
            'btn-left': [-1, 0],
            'btn-right': [1, 0]
        };

        Object.entries(buttons).forEach(([id, [dx, dy]]) => {
            const button = document.getElementById(id);
            if (button) {
                const movePlayer = (e) => {
                    e.preventDefault();
                    if (this.gameState === 'exploring') {
                        this.player.move(dx, dy);
                        button.style.transform = 'scale(0.95)';
                        button.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                    }
                };

                const resetButton = () => {
                    button.style.transform = '';
                    button.style.backgroundColor = '';
                };

                button.addEventListener('touchstart', movePlayer);
                button.addEventListener('mousedown', movePlayer);
                button.addEventListener('touchend', resetButton);
                button.addEventListener('mouseup', resetButton);
                button.addEventListener('mouseleave', resetButton);
            }
        });

        document.getElementById('btn-menu')?.addEventListener('click', () => {
            document.getElementById('status-window').classList.toggle('hidden');
        });

        document.getElementById('btn-action')?.addEventListener('click', () => {
            if (this.gameState === 'battle') {
                const result = this.battle.executeCommand();
                if (result === 'win' || result === 'lose' || result === 'escape') {
                    this.gameState = 'exploring';
                }
            }
        });

        // タッチイベントの無効化（スクロール防止）
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('#game-container')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    update() {
        if (this.gameState === 'exploring') {
            // ランダムエンカウント判定
            if (Math.random() < 0.005) {
                this.gameState = 'battle';
                this.battle.start();
            }
        } else if (this.gameState === 'battle') {
            this.battle.update();
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'exploring') {
            this.map.render(this.ctx);
            this.player.render(this.ctx);
        } else if (this.gameState === 'battle') {
            this.battle.render(this.ctx);
        }
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ゲーム開始
window.onload = () => {
    window.gameInstance = new Game();
};
