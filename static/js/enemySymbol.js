class EnemySymbol {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 32;
        this.speed = 1;
        this.moveCounter = 0;
        this.moveInterval = 60; // フレーム単位での移動間隔
        this.direction = Math.floor(Math.random() * 4); // 0: 上, 1: 右, 2: 下, 3: 左
        this.loadSprite();
    }

    loadSprite() {
        this.sprite = new Image();
        this.sprite.src = '/static/assets/enemy.svg';
    }

    update() {
        this.moveCounter++;
        if (this.moveCounter >= this.moveInterval) {
            this.moveCounter = 0;
            this.direction = Math.floor(Math.random() * 4);
        }

        // 現在の方向に基づいて移動
        switch (this.direction) {
            case 0: // 上
                this.y = Math.max(0, this.y - this.speed);
                break;
            case 1: // 右
                this.x = Math.min(800 - this.size, this.x + this.speed);
                break;
            case 2: // 下
                this.y = Math.min(600 - this.size, this.y + this.speed);
                break;
            case 3: // 左
                this.x = Math.max(0, this.x - this.speed);
                break;
        }
    }

    render(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.size, this.size);
    }

    checkCollision(player) {
        const margin = 5; // 衝突判定の余裕を持たせる
        return (
            this.x < player.x + player.size - margin &&
            this.x + this.size > player.x + margin &&
            this.y < player.y + player.size - margin &&
            this.y + this.size > player.y + margin
        );
    }
}
