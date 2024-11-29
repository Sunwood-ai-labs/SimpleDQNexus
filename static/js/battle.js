class Battle {
    constructor() {
        this.enemy = null;
        this.loadEnemySprite();
    }

    loadEnemySprite() {
        this.enemySprite = new Image();
        this.enemySprite.src = '/static/assets/enemy.svg';
    }

    start() {
        this.enemy = {
            hp: 50,
            maxHp: 50,
            name: 'スライム'
        };
    }

    update() {
        // 戦闘ロジックの更新
    }

    render(ctx) {
        // 戦闘画面の描画
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 800, 600);
        
        // 敵の描画
        ctx.drawImage(this.enemySprite, 350, 200, 100, 100);
        
        // 戦闘メニューの描画
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 400, 700, 150);
        
        ctx.font = '24px monospace';
        ctx.fillText('たたかう', 100, 450);
        ctx.fillText('にげる', 100, 500);
    }
}
