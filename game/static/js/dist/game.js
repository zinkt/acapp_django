class AcGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
        <div class="ac-game-menu">
            <div class="ac-game-menu-field">
                <div class="ac-game-menu-field-item ac-game-menu-field-item-single">
                    Single Player
                </div>
                <br>
                <br>
                <div class="ac-game-menu-field-item ac-game-menu-field-item-multi">
                    Multiple Player
                </div>
                <br>
                <br>
                <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                    Settings
                </div>
            </div>
        </div>
        
        `);
        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.ac-game-menu-field-item-single');
        this.$multi = this.$menu.find('.ac-game-menu-field-item-multi');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');
        this.start();
    }

    start(){
        this.add_listening_events();
    }
    add_listening_events(){
        let outer = this;
        this.$single.click(function(){
            outer.hide();
            outer.root.playground.show();            
        });
        this.$multi.click(function(){
            console.log('click multi');
        });
        this.$settings.click(function(){
            console.log('click settings');
        });
    }
    show(){     //显示menu界面
        this.$menu.show()
    }
    hide(){     //隐藏menu界面
        this.$menu.hide()
    }

}let AC_GAME_OBJECTS = [];

class AcGameObject{
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false;
        this.timedelta = 0; //距上一帧时间间隔
    }
    start(){

    }
    update(){

    }
    on_destroy(){   //被删除前

    }
    destroy(){      //删掉该物体
        this.on_destroy();
        for (let i = 0; i < AC_GAME_OBJECTS.length; i++){
            if(AC_GAME_OBJECTS[i] === this){
                AC_GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }
    
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i++){
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

// window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，
// 并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
// 该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘(下一帧)之前执行
requestAnimationFrame(AC_GAME_ANIMATION);class GameMap extends AcGameObject{
    constructor(playground){
        super();
        this.playground = playground;
        this.$canvas = $('<canvas></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }
    start(){
        this.render();

    }
    update(){
        this.render();
    }

    render(){
        this.ctx.fillStyle = "rgba(0,0,0, 0.1)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);

    }

}class Player extends AcGameObject{
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


}class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
        <div class="ac-game-playground"></div>
        
        `);
        // this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, "white", this.height*0.15, true));
        this.start();
    }
    start() {

    }

    show() {
        this.$playground.show();
    }
    hide() {
        this.$playground.hide();
    }
}export class AcGame{
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        // this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }
    start(){

    }
}