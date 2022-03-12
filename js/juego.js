
var game = new Phaser.Game(640, 720, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {

  game.stage.backgroundColor = '#3A1528';

  // game.load.baseURL = 'http://examples.phaser.io/assets/';
  // game.load.crossOrigin = 'anonymous';


  game.load.tilemap('map', 'assets/tiles/tile_class_EXPORT.csv', null, Phaser.Tilemap.CSV);
  game.load.spritesheet('player', './assets/Skeleton/SpriteSheets/spritesheet.png', 99.13, 98);
  game.load.image('platform', './assets/Main/Objects/Obj-Big-Wood-Platform-01.png');
  game.load.image('granade', './assets/bomb/granade2.png');
  game.load.spritesheet('kaboom', './assets/bomb/explode.png', 32, 32);64

  game.load.image('tiles', 'assets/tiles/platformer_tiles.png');
}

var player;
var platforms;
var cursors;
var facingLeft = false;

var pig;

var granadeButton;
var granades;
var granade;
var granadeTime = 0;

var map;
var layer;


function create() {

  player = game.add.sprite(300, 4500, 'player');
  game.camera.follow(player);

  game.physics.arcade.enable(player);

  player.body.collideWorldBounds = true;
  player.body.gravity.y = 500;

  // player.body.setSize(x,y,offsetX,offsetY);

  // ---------------animation add-------------------
  player.animations.add('idle', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], 13, true);
  player.animations.add('walk', [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], 13, true);
  player.animations.add('hit', [16, 17, 18, 19, 20, 21, 22, 23], 13, true);
  player.animations.add('die', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 13, true);

  


  // platforms = game.add.physicsGroup();

  // platforms.create(500, 150, 'platform');
  // platforms.create(-200, 300, 'platform');
  // platforms.create(400, 450, 'platform');

  // platforms.setAll('body.immovable', true);

  //-------------------tiledmap-------------------------
  map = game.add.tilemap('map', 50, 50);
  map.addTilesetImage('tiles');

  layer = map.createLayer(0);
  layer.resizeWorld();

  //map.setCollisionByExclusion([13, 14, 15, 16, 46, 47, 48, 49, 50, 151]);
  map.setCollisionBetween(0, 107);
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
   //------------------------input------------------------------------

  cursors = game.input.keyboard.createCursorKeys();
  granadeButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

  
  // game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(player, layer);
  
  //collision granadas
  game.physics.arcade.overlap(granades, pigs, collisionHandler, null, this); 

  //-------------------player movement-------------------------------
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    //hacia la izquiera
    player.body.velocity.x = -250;
    player.animations.play('walk');
    player.scale.x = -1;

    facingLeft = true;
  }
  else if (cursors.right.isDown) {
    //hacia la derecha
    player.body.velocity.x = 250;
    player.animations.play('walk');
    player.scale.x = 1;

    facingLeft = false;
  }
  else {
    player.animations.play('idle');
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
  }else{
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
