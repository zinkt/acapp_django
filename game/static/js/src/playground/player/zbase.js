class Player extends AcGameObject{
    constructor(playground, x, y, radius, color, speed, is_me){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.vy = 1;
        this.radius = radius;
        this.speed = speed;
        this.is_me = is_me;
        this.color = color;
        this.cps = 0.1;
    }
    start(){
        if(this.is_me){
            this.add_listening_events();
        }
    }
    add_listening_events(){
        this.playground.game_map.$canvas.on("contextmenu",function(){
            return false;
        });
    }

    update(){
        this.x += this.vx;
        this.y += this.vy;

        this.render();
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }


}