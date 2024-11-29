class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(400, 300);
        this.map = new Map();
        this.battle = new Battle();
        this.gameState = 'exploring'; // exploring, battle
        
        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
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
            }
        });
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
    new Game();
};
