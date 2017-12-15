var gameHeight = 600;
var gameWidth = 800;
var playerWidth = 50;
var playerHeight = 50;
var game = new Phaser.Game(gameWidth,gameHeight,Phaser.CANVAS,'gameDiv');
var spaceField,
    BgSpeedY,
    player,
    cursors,
    bullets,
    bulletTime = 0,
    fireButton,
    enemies,
    score = 0,
    scoreText,
    winText;


var mainState = {
  preload: function(){
    game.load.image('starfield', 'assets/bg.png');
    game.load.image('player', 'assets/player.gif');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('booom', 'assets/booom.png');
  },
  create: function(){
    spaceField = game.add.tileSprite(0,0,game.width,game.height,'starfield');
    BgSpeedY = 2;

    player = game.add.sprite(game.world.centerX - 0, game.world.centerY + 200 ,'player');
    player.width = playerWidth;
    player.height = playerHeight;

    game.physics.enable(player,Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    enemies =  game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    createEnemies();


    scoreText = game.add.text(20,30,'Score: ',{font:'32px Arial', fill: '#fff'});
    winText = game.add.text(game.world.centerX - 100,game.world.centerY - 60,'You win',{font:'32px Arial', fill: '#fff'});
    overText = game.add.text(game.world.centerX - 100,game.world.centerY - 60,'Game Over',{font:'32px Arial', fill: '#ff0000'});
    overText.visible = false;
    winText.visible = false;
  },
  update: function(){
    game.physics.arcade.overlap(bullets, enemies, collisionHandler,null,this);
    game.physics.arcade.overlap(player, enemies, OverHandler,null,this);
    player.body.velocity.x = 0;
    spaceField.tilePosition.y += BgSpeedY;
    if(cursors.left.isDown){
      //console.log(player.body.position.x);
      if(player.body.position.x > 0)
        player.body.velocity.x = -300;
    }
    if(cursors.right.isDown){
      //console.log(player.body.position.x, player.scale.x);
      if(player.body.position.x < (gameWidth - playerWidth))
        player.body.velocity.x = 300;
    }

    if(fireButton.isDown){
      fireBullet();
    }

    scoreText.text = `Score: ${score}`;

    if(score == 4000){
      winText.visible = true;
      scoreText.visible = false;
    }
  }
}
function fireBullet(){
  if(game.time.now > bulletTime){
    bullet = bullets.getFirstExists(false);
    if(bullet){
      bullet.reset(player.x+ 24, player.y);
      bullet.body.velocity.y = -400;
      bulletTime = game.time.now + 100;
    }
  }
}

function createEnemies(){
  for(var y=0; y<4;y++){
    for(var x=0;x<10;x++){
      var enemy = enemies.create(x*48,y*50,'enemy');
    }
  }

  enemies.x = 100;
  enemies.y = 50;

  var tween = game.add.tween(enemies).to({x:200},2000,Phaser.Easing.Linear.None,true,0,1000,true);
  tween.onRepeat.add(descend, this);
}

function descend(){
  enemies.y += 20;
}

function collisionHandler(bullet,enemy){
  bullet.kill();
  enemy.kill();
  score += 100;
}

function OverHandler(){
  bullets.kill();
  overText.visible = true;
  player.loadTexture('booom', 0);
  setInterval(function(){player.kill();},1000);
  console.log(enemies.y);
  console.log(player.y);
  //enemies.animations.stop();
}
game.state.add('mainState',mainState);
game.state.start('mainState');
