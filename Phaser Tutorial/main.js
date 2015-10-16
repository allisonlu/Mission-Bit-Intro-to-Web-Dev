/**
 * JavaScript for our game
 */

// define main state
var main = {
    preload: function() {
        // executed at beginning
        // load game assets here
        
        game.load.image('paddle', 'assets/paddle.png');
        game.load.image('brick', 'assets/brick.png');
    },
    
    create: function() {
        // called after preload
        // set up game, display sprites here
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // paddle
        this.cursor = game.input.keyboard.createCursorKeys();
        this.paddle = game.add.sprite(200, 400, 'paddle');
        game.physics.arcade.enable(this.paddle);
        this.paddle.body.immovable = true;
        
        this.bricks = game.add.group();
        this.bricks.enableBody = true;
        
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                game.add.sprite(55 + i*60, 55 + j*35, 'brick', 0, this.bricks);
            }
        } // end outer for loop
        
        this.bricks.setAll('body.immovable', true);
    },
    
    update: function() {
        // called 60 times per second
        // game logic here
        
        if (this.cursor.right.isDown) {
            this.paddle.body.velocity.x = 350;
        } else if (this.cursor.left.isDown) {
            this.paddle.body.velocity.x = -350;
        } else {
            this.paddle.body.velocity.x = 0;
        } // end if statements
    },
    
    
}; // end main state

// intialize Phaser, start main state
// creates 400x450 black rectangle on screen
var game = new Phaser.Game(400, 450, Phaser.AUTO, "gameDiv"); 
game.state.add("main", main);
game.state.start("main");

