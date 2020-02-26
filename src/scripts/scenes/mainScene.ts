import ExampleObject from '../objects/exampleObject';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private background;
  private ship1;
  private ship2;
  private ship3;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.image(0,0,"background");
    this.background.setOrigin(0,0);

    this.ship1 = this.add.image(this.scale.width/2-50, this.scale.height/2, "ship");
    this.ship2 = this.add.image(this.scale.width/2, this.scale.height/2, "ship2");
    this.ship3 = this.add.image(this.scale.width/2 + 50, this.scale.height/2, "ship3");


    this.add.text(20,20, "Playing game", {
      font: "25px Arial", 
      fill: "yellow"})
  }

  update() {
  }
}
