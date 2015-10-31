/*global Phaser*/
/*jslint sloppy:true, browser: true, devel: true, eqeq: true, vars: true, white: true*/
var game;

function startGame() {
    // Initialize Phaser
    game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameDiv');

    // And finally we tell Phaser to add and start our 'main' state
    game.state.add('main', mainState);
    game.state.start('main');
}

/* makePipePair function
 * creates pipe obstacles on top and bottom of game world
 * with helper functions addPhysics and positionPipes
 * @param group The group we're making into pipes
 * @param offsetX 
 * @param3
 */
function makePipePair(group, offsetX) {
    var top = group.create(0, 0, 'pipe_top');
    var bottom = group.create(0, 0, 'pipe_bottom');
    top.anchor.set(0, 1);
    
    var spacing = 100;
    
    /* addPhysics 
     * enables Phaser physics methods for each pipe
     * @param pipe The pipe to enable physics on 
     */
    function addPhysics(pipe) {
        game.physics.enable(pipe);
        pipe.body.immovable = true;
        pipe.body.allowGravity = false;
        pipe.body.velocity.x = -200;
    }
    
    /* positionPipes
     * places pipes of random sizes 
     * @param top The image of top pipe
     * @param bottom The images of bottom pipe
     */
    function positionPipes(top, bottom) {
        var center = game.rnd.integerInRange(50, game.world.height - 50);
        var left = game.world.width;
        top.x = left;
        bottom.x = left;
        // recall: spacing = 100;
        top.y = center - spacing;
        bottom.y = center + spacing;
    }
    
    // call addPhysics, call positionPipes
    addPhysics(top);
    addPhysics(bottom);
    positionPipes(top, bottom);
    top.x += offsetX;
    bottom.x += offsetX;
    
} //end makePipePair




var mainState = {
    // Here we add all the functions we need for our state
    // For this project we will just have 3 functions
    preload: function () {
        // This function will be executed at the beginning
        // That's where we load the game's assets
        
        game.load.spritesheet('bird', 'images/bird_sheet.png', 68, 48);
        game.load.image('floor', 'images/floor.png');
        game.load.image('pipe_top', 'images/pipe_top.png');
        game.load.image('pipe_bottom', 'images/pipe_bottom.png');
        
    },
    
    
    create: function () {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.

        // Create a game sprite from the logo image positioned
        // at the center of the game world
        this.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'bird');
        // The position of the sprite should be based on the
        // center of the image (default is top-left)
        this.sprite.anchor.setTo(0.5, 0.5);
        
        
        this.sprite.animations.add('flap', [0,1,2,1], 10, true);
        this.sprite.animations.play('flap');
        
        game.physics.enable(this.sprite);
        game.physics.arcade.gravity.y = 150;
        // stops bird from falling off screen 
        this.sprite.body.collideWorldBounds = true;
    
        this.floor = game.add.tileSprite(0, game.world.height - 40, game.world.width, game.world.height, 'floor');
        this.floor.tileScale.set(0.5);
        
        /* TODO: 
         * add obstacles group
         * make the floor an obstacle too
         * enable physics on floor (make it stationary and allow gravity)
         * make pipes, then make pipe pairs (as obstacles)
         */
        
        this.obstacles = game.add.group();
        this.obstacles.add(this.floor);
        game.physics.enable(this.floor);
        this.floor.body.immovable = true;
        this.floor.body.allowGravity = false;
        
        // make a bunch of pipez
        var pipeSpacing = 400;
        var numPipes = 10;
        for (var i = 0; i < numPipes; i++) {
            makePipePair(this.obstacles, i * pipeSpacing);
        }
        
        // Change background color to a gray color
        game.stage.backgroundColor = '#00CCFF';
        
        // keep space from scrolling the page
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        
    }, // end create
    
    
    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic
        
        if (this.spaceKey.justDown) {
            this.sprite.body.velocity.y = -200;
        }
        
        // illusion of movement, by panning the floor
        this.floor.tilePosition.x -= 500;
        
//        if your sprite collides with any obstacle, game is over
        if (game.physics.arcade.collide(this.sprite, this.obstacles)) {
            console.log("Game Over");
            game.paused = true;
            
            var response = confirm("Restart?");
            if (response == true) {
                location.reload();
            }
            else if (response == false) {
                window.close();
            }
                
        }
        
        
    } // end update
    
}; // end main state

startGame();
