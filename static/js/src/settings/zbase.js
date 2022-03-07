class Settings{
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


}