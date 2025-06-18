import Phaser from "phaser";
export default class CollectingStarsScene extends Phaser.Scene {
  constructor() {
    super("collecting-stars-scene");
  }
  init() {
    this.platforms = [];
    this.player = undefined;
    this.stars= undefined
    this.cursor = undefined
    this.scoreText = undefined;
    this.score = 0;
    this.bombs = undefined
  }

  preload() {
//------WRITE CODE BELLOW-----//
this.load.image("ground", "images/platform.jpg");
this.load.image("star", "images/star.png");
this.load.image("sky", "images/1.png");
this.load.image("cloud", "images/4.png");
this.load.image("air", "images/3.png");
this.load.image("bomb", "images/bomb.png");
//-----WRITE CODE BELLOW-----//
this.load.spritesheet('dude', 'images/dude.png', {
    frameWidth: 32,
    frameHeight: 48
 });
 //-------------------------//
  }
  create() {
    this.add.image(400, 300, 'sky').setScale(2);
    this.add.image(400, 300, 'cloud').setScale(2);
     this.add.image(400, 300, 'air').setScale(2);
    this.platforms=this.physics.add.staticGroup()
    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");
    this.platforms.create(400, 600, "ground").setScale(4).refreshBody();
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 9,
      setXY: { x: 50, y: 0, stepX: 70 },
    });
    this.physics.add.collider(this.stars, this.platforms);
    this.stars.children.iterate(function (child) {
      // @ts-ignore
      child.setBounceY(0.5);
    });
    this.cursor = this.input.keyboard.createCursorKeys();
    //animation to the left
this.anims.create({
  key: "left", //--->nama animasi
  frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }), //--->frame yang digunakan
  frameRate: 10, //--->kecepatan berpindah antar frame
  repeat: -1, //--->mengulangi animasi terus menerus
});
//animation idle
this.anims.create({
  key: "turn",
  frames: [{ key: "dude", frame: 4 }],
  frameRate: 20,
});
//animation to the right
this.anims.create({
  key: "right",
  frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
  frameRate: 10,
  repeat: -1,
});
this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

/*
this.player = Overlap (tumpang tindih) antara properti player dengan stars
this.collectStar = Method yang dipanggil ketika player dan stars overlap
*/
this.scoreText = this.add.text(16, 16, "Score : 0", {
  fontSize: "32px",
  fill: "yellow",
});
this.bombs = this.physics.add.group({
  key: "bomb",
  repeat: 5,
  setXY: { x: 30, y: 0, stepX: 120 },
});
this.physics.add.collider(this.bombs, this.platforms);
this.physics.add.overlap(this.player, this.bombs, this.gameOver, null, this);
  }
  update() {
    if (this.cursor.left.isDown) { 
      //Jika keyboard panah kiri ditekan
        this.player.setVelocity(-200, 200);
      //Kecepatan x : -200
      //Kecepatan y : 200
      //(bergerak ke kiri dan turun kebawah seolah terkena gaya gravitasi)
        this.player.anims.play("left", true);
      } else if (this.cursor.right.isDown) {
        this.player.setVelocity(200, 200);
        this.player.anims.play("right", true);
      //Memanggil nama animasi.True artinya animasi forever looping
      } else {
        this.player.setVelocity(0, 0);
        this.player.anims.play("turn");
      }
      if (this.cursor.up.isDown) {
        this.player.setVelocity(0, -200);  
        this.player.anims.play("turn");
      }
      
      /* Kecepatan X = 0
         kecepatan y = -200*/
         if (this.score >= 100) {
          this.physics.pause();
          this.add.text(200, 200, "You win!!!", {
            fontSize: "70px",
            fill: "yellow",
          });
        }
  }
  collectStar(player, star){
    star.destroy()
    this.score += 10; 
    this.scoreText.setText('Score : '+this.score);
}
gameOver(player, bomb){
  this.physics.pause()
  this.add.text( 150,200,'Game Over!!!', { 
  fontSize: '70px', fill:'black' })
}

}