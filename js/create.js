
var player;
var platforms;
var cursors;
var facingLeft = false;

var bg1;
var bg2;
var bg3;


var skulls;

var granadeButton;
var granades;
var granade;
var granadeTime = 0;
var explosions;

var map;
var layer;
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

    // platforms = game.add.physicsGroup();

    // platforms.create(500, 150, 'platform');
    // platforms.create(-200, 300, 'platform');
    // platforms.create(400, 450, 'platform');

    // platforms.setAll('body.immovable', true);

    //-------------------tiledmap-------------------------
    map = game.add.tilemap('map', 32, 32);
    map.addTilesetImage('tiles');

    layer = map.createLayer(0);
    layer.resizeWorld();

    //map.setCollisionByExclusion([13, 14, 15, 16, 46, 47, 48, 49, 50, 151]);
    map.setCollisionBetween(0, 4);
    // map.createFromTiles(0, -1, "coin");

    //------------------------------granades---------------------------
    granades = game.add.group();
    granades.enableBody = true;
    granades.physicsBodyType = Phaser.Physics.ARCADE;
    granades.createMultiple(20, 'granade');
    granades.setAll('outOfBoundsKill', true);
    granades.setAll('checkWorldBounds', true);


    // for (let i = 0; i < 20; i++) {
    //   var g = granades.create(0, 0, 'granade');
    //   g.name = 'granade' + i;
    //   g.exists = false;
    //   g.visible = false;
    //   g.checkWorldBounds = true;
    //   g.events.onOutOfBounds.add(resetGranade, this);

    // }

    //------------------------player---------------------------------------
    player = game.add.sprite(60, 2430, 'player');
    game.camera.follow(player);

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    // player.body.setSize(x,y,offsetX,offsetY);
    // -------------------animation add-------------------
    player.animations.add('idle_left', [20, 21, 22, 23, 24, 25], 6, true);
    player.animations.add('idle_rigth', [26, 27, 28, 29, 30, 31], 6, true);
    player.animations.add('run_left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
    player.animations.add('run_rigth', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
    player.animations.add('prejump_rigth', [32], 1, true);
    player.animations.add('prejump_left', [33], 1, true);



    //-------------------------skulls-------------------------------------
    skulls = game.add.group();
    skulls.enableBody = true;
    skulls.physicsBodyType = Phaser.Physics.ARCADE;

    createEnemies();

    //-----------------------kbooms-----------------------------------
    explosions = game.add.group();
    explosions.createMultiple(20, 'boom');
    explosions.forEach(setupSkull, this);


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

function createEnemies() {

    var skull = skulls.create(300, 2200, 'skull');
    game.physics.arcade.enable(skull);
    skull.anchor.setTo(0.5, 0);
    skull.body.collideWorldBounds = true;
    skull.body.immovable = true;
    skull.body.gravity.y = 500;

    // skull = game.add.sprite(300, 2200, 'skull')
    // player.anchor.setTo(0.5, 0.5);


    skull.animations.add('idle', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], 11, true);
    skull.animations.add('walk', [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], 13, true);
    skull.animations.add('die', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 15, true);
    skull.animations.add('hit', [15, 16, 17, 18, 19, 20, 21, 22], 8, true);

    skull.animations.play('idle');

}