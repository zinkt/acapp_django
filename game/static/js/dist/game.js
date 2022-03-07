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
        this.hide();
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
        });
        this.$settings.click(function(){
            outer.root.settings.logout_on_remote();
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

}class Particle extends AcGameObject{
    constructor(playground, x,y,radius, vx, vy, color, speed, move_length){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.friction = 0.9;
        this.eps = 1;
        this.move_length = move_length;
    }
    start(){

    }
    update(){
        if(this.move_length < this.eps || this.speed < this.eps){
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta /1000)
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y, this.radius, 0, Math.PI*2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
    
}class Player extends AcGameObject{
    constructor(playground, x, y, radius, color, speed, is_me){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.speed = speed;
        this.is_me = is_me;
        this.color = color;
        this.eps = 0.1;
        this.friction = 0.9;
        this.chill_time = 0;
        this.cur_skill = null;
        if(is_me){
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
        }
    }
    start(){
        if(this.is_me){
            this.add_listening_events();
            
        }else{
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }
    add_listening_events(){
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu",function(){
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e){
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which === 3){
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            }else if(e.which === 1){
                if(outer.cur_skill === "fireball"){
                    outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                    return false;
                }
                outer.cur_skill = null;
            }
        });
        $(window).keydown(function(e){
            if(e.which === 81){     //q
                outer.cur_skill = "fireball";
                return false;
            }
        })
    }
    shoot_fireball(tx, ty){
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.4;
        let move_length = this.playground.height;
        new FireBall(this.playground, this, x,y,radius,vx,vy, color, speed, move_length, this.playground.height * 0.01 );

    }
    get_dist(x1,y1,x2,y2){
        let dx = x1-x2;
        let dy = y1-y2;
        return Math.sqrt(dx*dx + dy*dy);
    }
    move_to(tx, ty){
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }
    is_attacked(angle, damage){
        //粒子效果
        for(let i = 0; i < 12 + Math.random() * 5; i++){
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 5;
            let move_length = this.radius * Math.random()*10;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        //伤害处理
        this.radius -= damage;
        if(this.radius < this.eps){
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.9   //被击中后减速
        


    }

    update(){
        this.chill_time += this.timedelta / 1000;
        if(!this.is_me && this.chill_time > 3 && Math.random() < 1/300.0){
            let player = this.playground.players[0];
            this.shoot_fireball(player.x, player.y);
        }
        if(this.damage_speed > this.eps){
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }
        else{
            if(this.move_length < this.eps){
                this.move_length = 0;
                this.vx = this.vy = 0;
                if(!this.is_me){
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            }else{
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }

        this.render();
    }
    render(){
        if(this.is_me){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }else{
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }


}class FireBall extends AcGameObject{
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage){
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }
    start(){

    }
    update(){
        if(this.move_length < this.eps){
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
        for(let i = 0; i < this.playground.players.length; i++){
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player)){
                this.attack(player);
            }
        }
        this.render();
    }
    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }


    attack(player){
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle,this.damage)
        this.destroy();
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
        this.hide();
        
        
        
        this.start();
    }
    get_random_color(){
        let colors = ["blue", "red", "pink", "green", "yellow"];
        return colors[Math.floor(Math.random() * 5)];
    }


    start() {

    }

    show() {
        this.$playground.show();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, "white", this.height*0.2, true));
        for(let i = 0; i < 5; i++){
            this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, this.get_random_color(), this.height*0.2, false))
        }
    }
    hide() {
        this.$playground.hide();
    }
}class Settings{
    constructor(root){
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";
        this.$settings = $(`
            <div class="ac-game-settings">
                <div class="ac-game-settings-login">
                    <div class="ac-game-settings-title">
                        Login
                    </div>
                    <div class="ac-game-settings-username">
                        <div class="ac-game-settings-item">
                            <input type="text" placeholder="Username">
                        </div>
                    </div>
                    <div class="ac-game-settings-password">
                        <div class="ac-game-settings-item">
                            <input type="password" placeholder="Password">
                        </div>
                    </div>

                    <div class="ac-game-settings-submit">
                        <div class="ac-game-settings-item">
                            <button>Sign in</button>
                        </div>
                    </div>

                    <div class="ac-game-settings-errormsg">
                        
                    </div>

                    <div class="ac-game-settings-option">
                        Register
                    </div>
                    <br>
                    <div class="ac-game-settings-acwing">
                        <img width="30" src="https://app1739.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                    </div>

                </div>

                <div class="ac-game-settings-register">
                    <div class="ac-game-settings-title">
                        Register
                    </div>
                    <div class="ac-game-settings-username">
                        <div class="ac-game-settings-item">
                            <input type="text" placeholder="Username">
                        </div>
                    </div>
                    <div class="ac-game-settings-password-first">
                        <div class="ac-game-settings-item">
                            <input type="password" placeholder="Password">
                        </div>
                    </div>
                    <div class="ac-game-settings-password-second">
                        <div class="ac-game-settings-item">
                            <input type="password" placeholder="Confirm passowrd">
                        </div>
                    </div>
                    <div class="ac-game-settings-submit">
                        <div class="ac-game-settings-item">
                            <button>Sign up</button>
                        </div>
                    </div>

                    <div class="ac-game-settings-errormsg">
                        
                    </div>

                    <div class="ac-game-settings-option">
                        Login
                    </div>
                    <br>
                    <div class="ac-game-settings-acwing">
                        <img width="30" src="https://app1739.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                    </div>


                </div>
            
            </div>
        `);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_errormsg = this.$login.find(".ac-game-settings-errormsg");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_errormsg = this.$register.find(".ac-game-settings-errormsg");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');

        this.root.$ac_game.append(this.$settings);

        this.start();

    }
    start(){
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            this.getinfo_web();
        }
        this.add_listening_events();

    }
    add_listening_events(){
        let outer = this;

        // login界面
        this.$login_register.click(function() { //login --> register
            outer.register();
        });
        this.$login_submit.click(function(){
            outer.login_on_remote();
        });

        //register界面
        this.$register_login.click(function() { //register --> login
            outer.login();
        });
        this.$register_submit.click(function(){
            outer.register_on_remote();
        });

        //acwing
        this.$acwing_login.click(function(){
            outer.acwing_login();
        });
    }
    acwing_login(){
        $.ajax({
            url: "https://app1739.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(resp){
                console.log(resp);
                if (resp.result === "success"){
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }
    login_on_remote(){  //登录到远程服务器
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_errormsg.empty();
        $.ajax({
            url: "https://app1739.acapp.acwing.com.cn/settings/login/",
            type:"GET",
            data:{
                username: username,
                password: password,
            },
            success: function(resp){
                if(resp.result === "success"){
                    location.reload();
                }else{
                    outer.$login_errormsg.html(resp.result);
                }
            }
        });
    }
    register_on_remote(){
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_errormsg.empty();
        $.ajax({
            url: "https://app1739.acapp.acwing.com.cn/settings/register/",
            type:"GET",
            data:{
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp){
                if(resp.result === "success"){
                    location.reload();
                }else{
                    outer.$register_errormsg.html(resp.result);
                }
            }
        });
    }
    logout_on_remote(){
        if (this.platform === "ACAPP") return false;

        $.ajax({
            url: "https://app1739.acapp.acwing.com.cn/settings/logout/",
            type: "GET",
            success: function(resp){
                if (resp.result === "success"){
                    location.reload();
                }
            }
        });
    }



    login(){    //打开登陆界面
        this.$register.hide();
        this.$login.show();
    }
    register(){ //open ...
        this.$login.hide();
        this.$register.show();
    }
    getinfo_acapp() {
        let outer = this;

        // $.ajax({
        //     url: "https://app1739.acapp.acwing.com.cn/settings/getinfo/",
        //     type: "GET",
        //     success: function(resp) {
        //         if (resp.result === "success") {
        //             outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
        //         }
        //     }
        // });
    }
    getinfo_web() {
        let outer = this;

        $.ajax({
            url: "https://app1739.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }




    // getinfo(){
    //     let outer = this;
    //     $.ajax({
    //         url: "https://app1739.acapp.acwing.com.cn/settings/getinfo/",
    //         type : "GET",
    //         data : {
    //             platform : outer.platform,
    //         },
    //         success : function(resp){
    //             if(resp.result === "success"){
    //                 outer.hide();
    //                 outer.root.menu.show();
    //             }else{
    //                 outer.login();
    //             }
    //         }
    //     });
    // }
    hide(){
        this.$settings.hide();
    }
    show(){
        this.$settings.show();
    }


}export class AcGame{
    constructor(id, AcWingOS) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS;
        this.menu = new AcGameMenu(this);
        this.settings = new Settings(this);

        this.playground = new AcGamePlayground(this);

        this.start();
    }
    start(){

    }
}