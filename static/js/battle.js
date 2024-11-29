class Battle {
    constructor() {
        this.enemy = null;
        this.loadEnemySprite();
        this.selectedCommand = 0; // 0: たたかう, 1: にげる
        this.commands = ['たたかう', 'にげる'];
        this.playerTurn = true;
        this.processingTurn = false; // ターン処理中フラグ
        this.battleResult = null; // 'win', 'lose', 'escape'のいずれか
    }

    loadEnemySprite() {
        this.enemySprite = new Image();
        this.enemySprite.src = '/static/assets/enemy.svg';
    }

    start() {
        this.enemy = {
            hp: 50,
            maxHp: 50,
            name: 'スライム',
            attack: 5
        };
        this.playerTurn = true;
        this.selectedCommand = 0;
        this.processingTurn = false;
    }

    selectNextCommand() {
        if (!this.processingTurn) {
            this.selectedCommand = (this.selectedCommand + 1) % this.commands.length;
        }
    }

    selectPreviousCommand() {
        if (!this.processingTurn) {
            this.selectedCommand = (this.selectedCommand - 1 + this.commands.length) % this.commands.length;
        }
    }

    executeCommand() {
        if (!this.playerTurn || this.processingTurn) return;

        if (this.selectedCommand === 0) { // たたかう
            this.processingTurn = true;
            const damage = Math.floor(Math.random() * 10) + 5;
            this.enemy.hp = Math.max(0, this.enemy.hp - damage);
            this.playerTurn = false;
            
            // 敵の攻撃
            setTimeout(() => {
                try {
                    // 敵のHP確認
                    if (this.enemy.hp <= 0) {
                        this.processingTurn = false;
                        this.battleResult = 'win';
                        return;
                    }

                    const enemyDamage = Math.floor(Math.random() * this.enemy.attack);
                    if (window.gameInstance && window.gameInstance.player) {
                        window.gameInstance.player.stats.hp = Math.max(0, window.gameInstance.player.stats.hp - enemyDamage);
                        window.gameInstance.player.updateStats();
                    }
                    
                    // プレイヤーのHP確認
                    if (window.gameInstance.player.stats.hp <= 0) {
                        this.processingTurn = false;
                        this.battleResult = 'lose';
                        return;
                    }

                    // ターン状態の更新
                    this.playerTurn = true;
                    this.processingTurn = false;
                } catch (error) {
                    console.error('Enemy turn processing error:', error);
                    this.playerTurn = true;
                    this.processingTurn = false;
                }
            }, 1000);
        } else if (this.selectedCommand === 1) { // にげる
            this.processingTurn = true;
            if (Math.random() < 0.5) {
                this.processingTurn = false;
                this.battleResult = 'escape';
                return;
            }
            this.playerTurn = false;
            
            setTimeout(() => {
                this.playerTurn = true;
                this.processingTurn = false;
            }, 1000);
        }
    }

    update() {
        // 戦闘状態の更新
    }

    render(ctx) {
        // 背景
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 800, 600);
        
        // 敵の描画
        ctx.drawImage(this.enemySprite, 350, 200, 100, 100);
        
        // 敵のHP表示
        ctx.fillStyle = '#fff';
        ctx.font = '20px monospace';
        ctx.fillText(`${this.enemy.name} HP: ${this.enemy.hp}/${this.enemy.maxHp}`, 350, 150);

        // コマンドメニューの描画
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 400, 700, 150);

        // コマンドの描画
        ctx.font = '24px monospace';
        this.commands.forEach((command, index) => {
            if (index === this.selectedCommand && !this.processingTurn) {
                ctx.fillStyle = '#ffff00';
                ctx.fillText('▶', 70, 450 + index * 50);
            }
            ctx.fillStyle = '#fff';
            ctx.fillText(command, 100, 450 + index * 50);
        });

        // ターン表示
        if (!this.playerTurn || this.processingTurn) {
            ctx.fillStyle = '#fff';
            ctx.fillText('敵のターン', 350, 350);
        }
    }
}
