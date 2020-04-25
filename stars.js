const canvas  = document.getElementById("stars");
const context = canvas.getContext("2d");
const canvas_size=600;
const star_size=2;
const num_stars = 100;
const pos_step_size=.2;
const star_velocity = 3;
const ship_step = 10;
var ship_x = canvas_size*.45 ;
const bullet_velocity = 8;
const bullet_size=4;
const target_velocity = 12.0;
const target_size = 10;
const theta_step = 4.2;
const error = 10;
var ship_speed=0.0;
var mouse_x = 300;

class Star {
    constructor(){
        this.x = canvas_size*Math.random();
        this.y = canvas_size*Math.random();
        this.r = star_size*Math.random();
        this.opacity = Math.random();
        this.velocity = star_velocity * Math.random() + star_velocity*.3;
    }
    update_opacity() {
        var step = 0.1 * (Math.random() - 0.5);
        this.opacity = Math.min(Math.max(this.opacity + step, 0),1);
    }    
    update_position() {
        var step = pos_step_size * (Math.random() - 0.5);
        this.x += step        ;
        this.y += this.velocity;
        if (this.y > canvas_size) {this.y=0; this.x = canvas_size*Math.random()};
    } 
}

class Bullet {
    constructor(x){
        this.x = x;
        this.y = canvas_size - 100;
        this.r = bullet_size;
        this.velocity = bullet_velocity;
    }
   
    update_position() {
        this.y -= this.velocity;
    } 
}

class Target {
    constructor(){
        this.x = canvas_size*Math.random();
        this.y = canvas_size*Math.random();
        this.r = target_size;
        this.theta = 2*Math.PI*Math.random();
        this.x_velocity = target_velocity*(Math.cos(this.theta));
        this.y_velocity = target_velocity*(Math.sin(this.theta));
    }
   
    update_position() {
        this.x += this.x_velocity;//this.x_velocity;
        this.y += this.y_velocity;
        this.x = Math.max(Math.min(this.x, canvas_size), 0)
        this.y = Math.max(Math.min(this.y, canvas_size), 0)
        if (this.x >= canvas_size) {this.x_velocity *=-3; this.x =canvas_size};
        if (this.y >= canvas_size)  {this.y_velocity *=-3; this.y=canvas_size};
        if (this.x <= 0)  {this.x_velocity *=-2; this.x=0};
        if (this.y <= 0)  {this.y_velocity *=-2; this.y=0};

    } 
    
    update_velocity() {
        this.x_velocity += theta_step*(Math.random() - .5);
        this.y_velocity += theta_step*(Math.random() - .5);
        var norm = Math.sqrt(this.x_velocity*this.x_velocity + this.y_velocity*this.y_velocity);
        this.x_velocity = target_velocity * this.x_velocity / norm;
        this.y_velocity = target_velocity * this.y_velocity / norm;

    } 
}


function fill_background(){
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas_size, canvas_size);
    context.font = "60px Arial";
    context.fillStyle = "white";
    context.fillText("Hello " + name, 110, 50);

}

function draw_ship(x,y){
    var image = new Image();
    image.src = "ship.png";
    context.drawImage(image, x, y, 40, 60);
}

function draw_star(star){
    context.fillStyle = 'rgb(250, 250, 250, ' + star.opacity;
    context.beginPath();
    context.arc(star.x, star.y, star.r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

function draw_stars(star_i){ 
    fill_background();
    for (var star of star_i){
        draw_star(star);
    };
    ship_speed = -.05*(ship_x - mouse_x);
    ship_x += ship_speed;
    draw_ship(ship_x, canvas_size -100);
}

function draw_bullet(bullet){
    context.fillStyle = 'rgb(227, 50, 23, 1)';
    context.beginPath();
    context.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

function draw_target(){ 

    var image = new Image();
    image.src = "heart.png";
    context.drawImage(image,target.x, target.y, 60, 60);

    //context.fillStyle = 'rgb(179, 55, 150, 1)';
    //context.beginPath();
    //context.arc(target.x, target.y, target.r, 0, Math.PI*2, false);
    //.closePath();
    //context.fill();
}

function update_target(){
    target.update_position();
    target.update_velocity()
}

function draw_bullets(bullet_i){ 
    for (var bullet of bullet_i){
        draw_bullet(bullet);
    };
}

function update_bullets(bullet_i){
    for (var bullet of bullet_i){
        bullet.update_position()
    }
    for (i=0; i<bullet_i.length; i++){
        if (bullet_i[i].y < 0) {bullet_i.splice(i,1)}
    }
}

function update_stars(star_i){
    for (var star of star_i){
        star.update_opacity()
        star.update_position()
    }
}

function keyRespond(evt){
    switch(evt.keyCode){
        case 32: bullet_i.push(new Bullet(ship_x + 20)); break;
        case 37: ship_x -= ship_step; break; 
        case 39: ship_x += ship_step; break; 


    }
}

function check_target(){
    for (var bullet of bullet_i){
        if ((Math.abs(bullet.x - target.x - 40) < error) && (Math.abs(bullet.y - target.y - 40) < error)){
            alert(name + ", you killed it!");
            clearInterval(game);
        }
    }       
}

function mouseMove(evt){
    let rect = canvas.getBoundingClientRect();
    mouse_x = evt.clientX;
}

function mouseFire(evt){
    if (event.which ===1) {bullet_i.push(new Bullet(ship_x + 20));}
}

function render(){
    draw_stars(star_i);
    draw_bullets(bullet_i);
    draw_target();    
    update_stars(star_i);
    update_bullets(bullet_i);
    update_target();    
    check_target();
}

//window.addEventListener('keydown', keyRespond);
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mousedown', mouseFire);


//generate stars
target = new Target()
bullet_i = [];
star_i = [];
for (var i=0; i< num_stars; i++){
    star_i.push(new Star())
};
let name = prompt('What is your name?');
var data = {
    player: name,
  }  
//var jsonData = JSON.stringify(data);

var game = setInterval(render, 50);





