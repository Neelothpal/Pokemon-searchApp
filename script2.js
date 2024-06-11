const pokemonID = document.getElementById('pokemon-id');
const pokemonName = document.getElementById('pokemon-name');
const spriteContainer = document.getElementById('sprite-container');
const types = document.getElementById('types');
const height = document.getElementById('height');
const weight = document.getElementById('weight');
const hp = document.getElementById('hp');
const attack = document.getElementById('attack');
const defense = document.getElementById('defense');
const specialAttack = document.getElementById('special-attack');
const specialDefense = document.getElementById('special-defense');
const speed = document.getElementById('speed');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
// Get reference to the canvas
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

// Function to fetch JSON from API and draw image

const getPokemon = async () => {
    try {
      const pokemonNameOrId = searchInput.value.toLowerCase();
      const response = await fetch(
        `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemonNameOrId}`
      );
      const data = await response.json();
  
      pokemonName.textContent = `${data.name.toUpperCase()}`;
      pokemonID.textContent = `#${data.id}`;
      weight.textContent = `Weight: ${data.weight}`;
      height.textContent = `Height: ${data.height}`;
      hp.textContent = data.stats[0].base_stat;
      attack.textContent = data.stats[1].base_stat;
      defense.textContent = data.stats[2].base_stat;
      specialAttack.textContent = data.stats[3].base_stat;
      specialDefense.textContent = data.stats[4].base_stat;
      speed.textContent = data.stats[5].base_stat;
  
      types.innerHTML = data.types
        .map(obj => `<span class="type ${obj.type.name}">${obj.type.name}</span>`)
        .join("");
  
      const imageUrl = data.sprites.front_default;
  
      const responseImage = await fetch(imageUrl);
      const blob = await responseImage.blob();
      const reader = new FileReader();
      reader.onloadend = function() {
        const base64data = reader.result;
        const img = new Image();
        img.onload = function() {
          canvas.width = img.width*4;
          canvas.height = img.height*4;
          c.drawImage(img, 0, 0,canvas.width,canvas.height);
          
          const imageData = c.getImageData(0, 0, canvas.width, canvas.height);
          const effect = new Effect(canvas.width, canvas.height, imageData);
          effect.init(c);
          animate(effect);
        };
        img.src = base64data;
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      resetDisplay();
      alert("Pokémon not found");
      console.log(`Pokémon not found: ${err}`);
    }
  };
  
  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.color = color;
      this.size = this.effect.gap;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.01;
      this.friction = 0.98;
      this.dx = 0;
      this.dy = 0;
      this.distance = 0;
      this.force = 0;
      this.angle = 0;
    }
  
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
  
    update() {
      this.dx = this.effect.mouse.x - this.x;
      this.dy = this.effect.mouse.y - this.y;
      this.distance = this.dx * this.dx + this.dy * this.dy;
      this.force = -this.effect.mouse.radius / this.distance;
  
      if (this.distance < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx);
        this.vx += this.force * Math.cos(this.angle);
        this.vy += this.force * Math.sin(this.angle);
      }
  
      this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
      this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }
  }
  
  class Effect {
    constructor(width, height, imageData) {
      this.width = width;
      this.height = height;
      this.particlesArray = [];
      this.imageData = imageData;
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;
      this.gap = 2;
      this.mouse = {
        radius: 4000,
        x: undefined,
        y: undefined
      };
      window.addEventListener("mousemove", event => {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
      });
    }
  
    init(context) {
      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const red = this.imageData.data[index];
          const green = this.imageData.data[index + 1];
          const blue = this.imageData.data[index + 2];
          const alpha = this.imageData.data[index + 3];
          const color = `rgb(${red},${green},${blue})`;
  
          if (alpha > 0) {
            this.particlesArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }
  
    draw(context) {
      this.particlesArray.forEach(particle => particle.draw(context));
    }
  
    update() {
      this.particlesArray.forEach(particle => particle.update());
    }
  }
  
  const animate = effect => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(c);
    effect.update();
    requestAnimationFrame(() => animate(effect));
  };
  
  const resetDisplay = () => {
    canvas.width = 0;
    canvas.height = 0;
    pokemonName.textContent = "";
    pokemonID.textContent = "";
    types.innerHTML = "";
    height.textContent = "";
    weight.textContent = "";
    hp.textContent = "";
    attack.textContent = "";
    defense.textContent = "";
    specialAttack.textContent = "";
    specialDefense.textContent = "";
    speed.textContent = "";
  };
  
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    getPokemon();
  });