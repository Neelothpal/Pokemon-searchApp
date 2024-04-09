const canvas = document.querySelector("canvas");
canvas.height = 777;
canvas.width = 1535;
const c = canvas.getContext("2d");
let innerHeight = 777;
let innerWidth = 1535;



var mouse = {
    x: undefined,
    y: undefined,
}

window.addEventListener('mousemove',(event)=>{
    mouse.x = event.x;
    mouse.y = event.y;
})

var maxRadius = 40;

var colorArray = [
    "#000814ff",
    "#001d3dff",
    "#003566ff",
    "#ffc300ff",
    "#ffd60aff",
];

function Circle(x,y,dx,dy,radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random()*colorArray.length)];

    this.draw = function() {
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle =this.color;
    c.fill();
    }
    this.update = function() {
        if(this.x+this.radius >innerWidth-radius || this.x-this.radius<0) {
            this.dx = -this.dx;
        };
        if(this.y+this.radius >innerHeight || this.y-this.radius<0) {
            this.dy = -this.dy;
        };
        this.x += this.dx;
        this.y += this.dy;
        this.draw();

        //interactivity

        if(mouse.x-this.x<50 && mouse.x-this.x >-50 && mouse.y-this.y<50 &&  mouse.y-this.y>-50) {
            if(this.radius<maxRadius) {
                this.radius +=1;
            }
        }
        else if(this.radius>this.minRadius){
            this.radius -=1;
        }
    }
}
let circleArray = [];


function init() {
    circleArray=[];
    for(let i =0; i<900; i++){
        let radius = Math.random()*5+1;
        let x = Math.random()*(innerHeight - radius *2)+radius;
        let y = Math.random()*(innerWidth - radius *2)+radius;
        let dx = Math.random()-0.5;
        let dy = Math.random()-0.5;
        circleArray.push(new Circle(y,x,dx,dy,radius));
    };
};

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight);
    for(let i=0;i<circleArray.length;i++){
        circleArray[i].update();
    }
    
};
init();
animate();