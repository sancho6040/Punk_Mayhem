
var game = new Phaser.Game(640, 720, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {

  game.stage.backgroundColor = '#3A1528';

  // game.load.baseURL = 'http://examples.phaser.io/assets/';
  // game.load.crossOrigin = 'anonymous';


  game.load.spritesheet('player', './assets/Chick-Boy/ChikBoy_x32.png', 40, 64);
  game.load.image('granade', './assets/bomb/granade.png');
  game.load.spritesheet('boom', './assets/bomb/explode.png', 32, 32);

  game.load.image('bg1', './assets/bg/bg.png');
  game.load.image('bg2', './assets/bg/buildings-bg.png');
  game.load.image('bg3', './assets/bg/near-buildings-bg.png');

  game.load.tilemap('map', './assets/tileset/tiles_xport.csv', null, Phaser.Tilemap.CSV);
  game.load.image('tiles', 'assets/tileset_x64.png');

}

var player;
var platforms;
var cursors;
var facingLeft = false;

var bg1;
var bg2;
var bg3;

var pig;

var granadeButton;
var granades;
var granade;
var granadeTime = 0;

var map;
var layer;


function create() {

  //-------------------backgounds-------------------------------------
  bg = game.add.tileSprite(0, 0, 640, 720, 'bg1');
  bg2 = game.add.tileSprite(0, 0, 640, 720, 'bg2');
  bg3 = game.add.tileSprite(0, 0, 640, 720, 'bg3');
  bg.fixedToCamera = true;
  bg2.fixedToCamera = true;
  bg3.fixedToCamera = true;

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


  for (let i = 0; i < 20; i++) {
    var g = granades.create(0, 0, 'granade');
    g.name = 'granade' + i;
    g.exists = false;
    g.visible = false;
    g.checkWorldBounds = true;
    g.events.onOutOfBounds.add(resetGranade, this);

  }

  //-------------------------pigs-------------------------------------
  pigs = game.add.group();
  pigs.enableBody = true;
  pigs.physicsBodyType = Phaser.Physics.ARCADE;

  pigs.create(450, 400, 'pig');

  //------------------------player---------------------------------------
  player = game.add.sprite(60, 2430, 'player');
  game.camera.follow(player);

  game.physics.arcade.enable(player);

  player.body.collideWorldBounds = true;
  player.body.gravity.y = 500;

  // player.body.setSize(x,y,offsetX,offsetY);

  // ---------------animation add-------------------
  player.animations.add('idle_left', [20, 21, 22, 23, 24, 25], 6, true);
  player.animations.add('idle_rigth', [26, 27, 28, 29, 30, 31], 6, true);
  player.animations.add('run_left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
  player.animations.add('run_rigth', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
  player.animations.add('prejump_rigth', [32], 1, true);
  player.animations.add('prejump_left', [33], 1, true);

  //------------------------input------------------------------------
  cursors = game.input.keyboard.createCursorKeys();
  granadeButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {
  // console.log(player.x, player.y);

  // game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(player, layer);

  //collision granadas
  game.physics.arcade.overlap(granades, pigs, collisionHandler, null, this);

  //-------------------player movement-------------------------------
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    //hacia la izquiera
    player.body.velocity.x = -250;
    player.animations.play('run_left');

    facingLeft = true;
  }
  else if (cursors.right.isDown) {
    //hacia la derecha
    player.body.velocity.x = 250;
    player.animations.play('run_rigth');

    facingLeft = false;
  }
  else {
    if (facingLeft) {
      player.animations.play('idle_left');
    } else {
      player.animations.play('idle_rigth');
    }
  }

  if (cursors.up.isDown && (player.body.onFloor() || player.body.touching.down)) {
    //salto
    player.body.velocity.y = -400;
  }

  //-------------------player shoot-----------------------------------

  if (granadeButton.isDown) {
    throwGranade();
    if (facingLeft) {
      //animacion haca la izquierda
    } else {
      //animacion hacia la derecha
    }

  }
}

function throwGranade() {
  if (!facingLeft) {
    if (game.time.now > granadeTime) {
      granade = granades.getFirstExists(false);

      if (granade) {
        granade.reset(player.x, player.y + 8);
        granade.body.velocity.x = 200;
        granade.body.velocity.y = -150;
        granade.body.gravity.y = 200;
        granadeTime = game.time.now + 200;
      }
    }
  } else {
    if (game.time.now > granadeTime) {
      if (game.time.now > granadeTime) {
        granade = granades.getFirstExists(false);

        if (granade) {
          granade.reset(player.x, player.y + 8);
          granade.body.velocity.x = -200;
          granade.body.velocity.y = -150;
          granade.body.gravity.y = 200;
          granadeTime = game.time.now + 200;
        }
      }
    }

  }

}

function resetGranade(granade) {
  granade.kill();
}

function collisionHandler(bullet, enemy) {

  bullet.kill();
  enemy.kill();
  // box.kill();
}
