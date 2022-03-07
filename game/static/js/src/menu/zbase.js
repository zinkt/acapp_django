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

}