class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 32;
        this.speed = 4;
        this.stats = {
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            level: 1
        };
        this.loadSprite();
    }

    loadSprite() {
        this.sprite = new Image();
        this.sprite.src = '/static/assets/character.svg';
    }

    move(dx, dy) {
        const newX = this.x + dx * this.speed;
        const newY = this.y + dy * this.speed;
        
        // マップ境界チェック
        if (newX >= 0 && newX <= 800 - this.size) {
            this.x = newX;
        }
        if (newY >= 0 && newY <= 600 - this.size) {
            this.y = newY;
        }
    }

    render(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.size, this.size);
    }

    updateStats() {
        document.getElementById('hp').textContent = this.stats.hp;
        document.getElementById('mp').textContent = this.stats.mp;
        document.getElementById('level').textContent = this.stats.level;
    }
}
