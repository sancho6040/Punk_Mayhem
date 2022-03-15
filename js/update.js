
function update() {
    // console.log(player.x, player.y);

    // gcollision plataformas;
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(skulls, layer);
    game.physics.arcade.collide(granades, layer);

    //collision entidades
    // game.physics.arcade.collide(player, skulls);
    game.physics.arcade.overlap(player, skulls, damageEnemy, null, this);

    deltaTime = game.time.elapsed / 1000;

    //collision granadas
    game.physics.arcade.overlap(granades, skulls, collisionHandler, null, this);


    //-------------------player movement-------------------------------

    if (alive) {
        if (cursors.left.isDown || A.isDown) {
            //hacia la izquiera
            player.body.velocity.x = -250;
            player.animations.play('run_left');
            hitState = false
            facingLeft = true;
        }
        else if (cursors.right.isDown || D.isDown) {
            //hacia la derecha
            player.body.velocity.x = 250;
            player.animations.play('run_rigth');
            hitState = false
            facingLeft = false;
        }
        else {
            if (!hitState) {
                player.body.velocity.x = 0;

                if (facingLeft) {
                    player.animations.play('idle_left');
                } else {
                    player.animations.play('idle_rigth');
                }
            }
        }

        if ((cursors.up.isDown || W.isDown) && (player.body.onFloor() || player.body.touching.down)) {
            //salto
            player.body.velocity.y = -400;
        }

        //-------------------player shoot-----------------------------------

        if (granadeButton.isDown) {
            throwGranade();
        }


        if (exist) {
            explosionTime += deltaTime;
            if (explosionTime > 3) {
                resetGranade(granade);
            }

            if (explosionTime > 1) {
                //collision granadas jugador
                game.physics.arcade.overlap(player, granades, damageGranade, null, this)
            }
        }
    }else{
        //si el jugador muere se queda quieto
        player.body.velocity.x = 0;
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

    score += 10;
    scoreText.text = scoreString + score;
    console.log(scoreText);

    granade.kill();
    enemy.kill();
    exist = false;
    explosionTime = 0;
    var explosion = explosions.getFirstExists(false);
    explosion.reset(granade.body.x, granade.body.y);
    explosion.play('kboom', 16, false, true);
}

function damageEnemy(player, enemie) {
    hitState = true;

    live = lives.getFirstAlive();
    console.log("lives -1");
    if (live) {
        live.kill();
    }

    if (facingLeft) {
        //animacion haca la izquierda
        player.animations.play('hit_left');
        player.body.velocity.x = 250;
    } else {
        //animacion hacia la derecha
        player.animations.play('hit_rigth');
        player.body.velocity.x = -250;
    }

    if (lives.countLiving() < 1) {
        player.animations.play('dead');
        alive = false;

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        // game.input.onTap.addOnce(restart, this);
    }


}

function damageGranade(player, granade) {
    hitState = true;


    if (facingLeft) {
        //animacion haca la izquierda
        player.animations.play('hit_left');
        player.body.velocity.x = 250;
    } else {
        //animacion hacia la derecha
        player.animations.play('hit_rigth');
        player.body.velocity.x = -250;
    }

    granade.kill();
    var explosion = explosions.getFirstExists(false);
    explosion.reset(granade.body.x, granade.body.y);
    explosion.play('kboom', 16, false, true);

}
