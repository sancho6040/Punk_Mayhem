
//player variables
var player;
var alive;
var lives;
var facingLeft = false;
var hitState = false;

//UI variables
var score = 0;
var scoreString = '';
var scoreText;
var stateText;

//backgounds
var bg1;
var bg2;
var bg3;

//enemies variables
var skulls;

//granades variables
var granadeButton;
var granades;
var granade;
var granadeTime = 0;
var exist = false;
var explosions;
var explosionTime = 0;

//efuntionañ variables
var deltaTime = 0;
var map;
var layer;
var cursors;
var W;
var A;
var D;


function create() {

    //-------------------backgounds-------------------------------------
    bg = game.add.tileSprite(0, 0, 640, 720, 'bg1');
    bg2 = game.add.tileSprite(0, 0, 640, 720, 'bg2');
    bg3 = game.add.tileSprite(0, 0, 640, 720, 'bg3');
    bg.fixedToCamera = true;
    bg2.fixedToCamera = true;


    //-------------------tiledmap-------------------------
    map = game.add.tilemap('map', 32, 32);
    map.addTilesetImage('tiles');

    layer = map.createLayer(0);
    layer.resizeWorld();

    //map.setCollisionByExclusion([13, 14, 15, 16, 46, 47, 48, 49, 50, 151]);
    map.setCollisionBetween(0, 4);
    // map.createFromTiles(105, -1, 'skull');

    //------------------------------granades---------------------------
    granades = game.add.group();
    granades.enableBody = true;
    granades.physicsBodyType = Phaser.Physics.ARCADE;
    granades.createMultiple(20, 'granade');
    granades.setAll('anchor.x', 0.5);
    granades.setAll('anchor.y', 0.5);
    granades.setAll('outOfBoundsKill', true);
    granades.setAll('checkWorldBounds', true);


    //-------------------------skulls-------------------------------------
    skulls = game.add.group();
    skulls.enableBody = true;
    skulls.physicsBodyType = Phaser.Physics.ARCADE;

    createEnemies(370, 2200);//esqueleto 1
    createEnemies(320, 1888);//esqueleto 2
    createEnemies(325, 1568);//esqueleto 3
    createEnemies(424, 1376);//esqueleto 4
    createEnemies(200, 1152);//esqueleto 5
    createEnemies(255, 608);//esqueleto 6
    createEnemies(420, 160);//esqueleto 7
    createEnemies(242, 96);//esqueleto 8

    //------------------------player---------------------------------------
    player = game.add.sprite(60, 2430, 'player');
    game.camera.follow(player);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    alive = true;

    // player.body.setSize(x,y,offsetX,offsetY);
    // -------------------animation add-------------------
    player.animations.add('idle_left', [20, 21, 22, 23, 24, 25], 6, true);
    player.animations.add('idle_rigth', [26, 27, 28, 29, 30, 31], 6, true);
    player.animations.add('run_left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
    player.animations.add('run_rigth', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
    player.animations.add('jump_left', [2], 1, true);
    player.animations.add('jump_rigth', [17], 1, true);
    player.animations.add('prejump_rigth', [34], 1, true);
    player.animations.add('prejump_left', [35], 1, true);
    player.animations.add('dead', [36], 1, true);
    player.animations.add('hit_rigth', [37], 1, true);
    player.animations.add('hit_left', [38], 1, true);



    //-----------------------kbooms-----------------------------------
    explosions = game.add.group();
    explosions.createMultiple(20, 'boom');
    explosions.forEach(setupSkull, this);

    //------------------------UI----------------------------------------
    //----score----
    scoreString = 'Score: ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });
    scoreText.fixedToCamera = true;

    //----lives-----
    lives = game.add.group();
    livesText = game.add.text(game.world.width - 100, 10, 'Lives: ',{font: '34px Arial', fill: '#fff'});
    livesText.fixedToCamera = true;

    for(var i = 0; i < 3; i++){
        var head = lives.create(game.world.width - 100 + (40 * i), 65, 'head');
        head.anchor.setTo(0.5, 0.5);
        head.alpha = 0.7;
        head.fixedToCamera = true;
    }

    //----stateText----
    stateText = game.add.text(game.world.width/2, game.world.width/2, '', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
    stateText.fixedToCamera = true;



    //------------------------input------------------------------------
    cursors = game.input.keyboard.createCursorKeys();
    granadeButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    W = game.input.keyboard.addKey(Phaser.Keyboard.W);
    A = game.input.keyboard.addKey(Phaser.Keyboard.A);
    D = game.input.keyboard.addKey(Phaser.Keyboard.D);

}

function setupSkull(skull){
    skull.anchor.x = 0.5;
    skull.anchor.y = 0.5;
    skull.animations.add('kboom');
}

function createEnemies(x, y) {

    var skull = skulls.create(x, y, 'skull');
    game.physics.arcade.enable(skull);
    skull.anchor.setTo(1, 1);
    skull.body.collideWorldBounds = true;
    skull.body.immovable = true;
    skull.body.gravity.y = 500;
    // skull.body.setSize(64, 64, 0, 0);

    // skull = game.add.sprite(300, 2200, 'skull')
    // player.anchor.setTo(0.5, 0.5);

    

    skull.animations.add('idle', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], 11, true);
    skull.animations.add('walk', [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], 13, true);
    skull.animations.add('die', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 15, true);
    skull.animations.add('hit', [15, 16, 17, 18, 19, 20, 21, 22], 8, true);

    skull.animations.play('idle');

}