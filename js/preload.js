function preload() {

    game.stage.backgroundColor = '#3A1528';

    // game.load.baseURL = 'http://examples.phaser.io/assets/';
    // game.load.crossOrigin = 'anonymous';


    game.load.spritesheet('player', './assets/characters/ChikBoy_x32.png', 40, 64);
    game.load.image('granade', './assets/bomb/granade.png');
    game.load.image('head', './assets/characters/head.png');
    game.load.spritesheet('boom', './assets/bomb/explode.png', 64, 64);

    game.load.spritesheet('skull', './assets/characters/skull1.png', 64, 64);

    game.load.image('bg1', './assets/bg/bg.png');
    game.load.image('bg2', './assets/bg/buildings-bg.png');
    game.load.image('bg3', './assets/bg/near-buildings-bg.png');

    game.load.tilemap('map', './assets/tileset/tiles_xport.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'assets/tileset_x64.png');

}