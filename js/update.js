
function update() {
    // console.log(player.x, player.y);

    // game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(skulls, layer);
    game.physics.arcade.collide(granades, layer);
    game.physics.arcade.collide(player, skulls);

    deltaTime = game.time.elapsed / 1000;

    //collision granadas
    game.physics.arcade.overlap(granades, skulls, collisionHandler, null, this);
    

    //-------------------player movement-------------------------------
    player.body.velocity.x = 0;

    if (cursors.left.isDown || A.isDown) {
        //hacia la izquiera
        player.body.velocity.x = -250;
        player.animations.play('run_left');

        facingLeft = true;
    }
    else if (cursors.right.isDown || D.isDown) {
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

    if ((cursors.up.isDown || W.isDown) && (player.body.onFloor() || player.body.touching.down)) {
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


    if (exist) {
        explosionTime += deltaTime;
        if (explosionTime > 3) {
            resetGranade(granade);  
        }
    }
}

function throwGranade() {
    exist = true;
    if (!facingLeft) {
        if (game.time.now > granadeTime) {
            granade = granades.getFirstExists(false);

            if (granade) {
                granade.reset(player.x, player.y + 8);
                granade.body.velocity.x = 200;
                granade.body.velocity.y = -150;
                granade.body.gravity.y = 200;
                granadeTime = game.time.now + 3000;
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
                    granadeTime = game.time.now + 3000;
                }
            }
        }

    }

}

function resetGranade(g) {
    g.kill();
    exist = false;
    explosionTime = 0;
    var explosion = explosions.getFirstExists(false);
    explosion.reset(granade.body.x, granade.body.y);
    explosion.play('kboom', 16, false, true);
}

function collisionHandler(granade, enemy) {

    granade.kill();
    enemy.kill();
    // box.kill();
    exist = false;
    explosionTime = 0;
    var explosion = explosions.getFirstExists(false);
    explosion.reset(granade.body.x, granade.body.y);
    explosion.play('kboom', 16, false, true);
}
