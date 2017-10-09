'use strict';

var debug = true;

if(debug) {console.log( 'Defining the random function' );}
var random = function(min, max){
  return( Math.round(Math.random() * (max - min) + min));
};

if(debug) {console.log( 'Item.pool is where all the created Items will go.' );}
if(localStorage.pool){
  Item.pool = JSON.parse(localStorage.pool);
}else{
  Item.pool = [];
}

if(debug) {console.log( 'Item.recentPool1 is where Items already displayed currently go.' );}
Item.recentPool1 = [];

if(debug) {console.log( 'Item.recentPool2 is where Items displayed last roll go.' );}
Item.recentPool2 = [];

if(debug) {console.log( 'Item.rolls keeps track of how many times the user has been shown Items.' );}
Item.rolls = 0;

if(debug) {console.log( 'Linking the "slots" elements from the DOM' );}
Item.slot1 = document.getElementById('slot1');
Item.slot2 = document.getElementById('slot2');
Item.slot3 = document.getElementById('slot3');
Item.main = document.getElementById('main');

if(debug) {console.log( 'Defining Item constructer.' );}
function Item(name,filepath){
  this.name = name;
  this.filepath = filepath;
  this.seen = 0;
  this.clicked = 0;
  Item.pool.push(this);
}

Item.duplicateCheck = function(itemName) {
  for(var n = 0; n < Item.recentPool1.length; n++) {
    if(itemName === Item.recentPool1[n]) {
      return(true);
    }
  }
  for(n = 0; n < Item.recentPool2.length; n++) {
    if(itemName === Item.recentPool2[n]) {
      return(true);
    }
  }
  return(false);
};

// displayItems function added to Item constructer
Item.displayItems = function() {
  for(var o = 0; o < Item.recentPool2.length; o++){
    Item.recentPool2.splice(o,1);
    o--;
  }
  for( o = 0; o < Item.recentPool1.length; o++){
    Item.recentPool2.push(Item.recentPool1[o]);
    Item.recentPool1.splice(o,1);
    o--;
  }
  for(var i = 0; i < 3; i++) {
    var itemIndex = random(0,Item.pool.length - 1);
    var item = Item.pool[itemIndex];
    if(Item.duplicateCheck(item.name)) {
      if(debug) {console.log(item.name + ' has been used too recently.');}
      i--;
    } else {
      if(i === 0) {
        if(debug) {console.log('Setting slot1 to ' + item.name);}
        Item.slot1.src = item.filepath;
        Item.slot1.alt = item.name;
      } else if(i === 1) {
        if(debug) {console.log('Setting Item.slot2 to ' + item.name);}
        Item.slot2.src = item.filepath;
        Item.slot2.alt = item.name;
      } else if(i === 2) {
        if(debug) {console.log('Setting Item.slot3 to ' + item.name);}
        Item.slot3.src = item.filepath;
        Item.slot3.alt = item.name;
      }
      Item.recentPool1.push(item.name);
      item.seen++;
    }
  }
};

if(Item.pool.length === 0){
  new Item('R2D2 Bag','resources/bag.jpg');
  new Item('Banana','resources/banana.jpg');
  new Item('Ipad Caddy','resources/bathroom.jpg');
  new Item('Charger Stand','resources/bendycharge.jpg');
  new Item('Stupid Boots','resources/boots.jpg');
  new Item('Breakfast Cooker','resources/breakfast.jpg');
  new Item('Meatball Gum','resources/bubblegum.jpg');
  new Item('Butt Biscuits','resources/buttbiscuit.jpg');
  new Item('Butter Gun','resources/corngun.jpg');
  new Item('Stupid Chair','resources/chair.jpg');
  new Item('Č̻̼̦͚͔̇̉ͬt̩̬ͬͮ̈̂̔͌͞h͚̪ͤͭ̅̄ͧu̴ͦ̍l̡͍̗͎̤̼͚̒̽͑ǘ̩͎͔̮̳̪̐͛ͯ̓̈ͪ̕ ̱̬͗̽͌̾̇ͮ̌D̆̐̌ͥ̋̎҉̻͎ǫ͍̫ͤl̳̪̼̺͛̊ͅḷ̭̫̙̺̹̮͂ͤ̑','resources/cthulhu.jpg');
  new Item('DuckDog','resources/dog-duck.jpg');
  new Item('Dragon Meat','resources/dragon.jpg');
  new Item('Child Protectiver Field','resources/forcefield.jpg');
  new Item('Gummi Corn','resources/gummicorn.png');
  new Item('Stupid Pen','resources/pen.jpg');
  new Item('Handa','resources/handipanda.jpg');
  new Item('Chilly Juice','resources/penguinbox.jpg');
  new Item('Pet Sweep','resources/pet-sweep.jpg');
  new Item('Pizza Shears','resources/scissors.jpg');
  new Item('Clown Mask','resources/serialkillermask.png');
  new Item('Shark Joke','resources/shark.jpg');
  new Item('Baby Joke','resources/sweep.png');
  new Item('Star Wars Joke','resources/tauntaun.jpg');
  new Item('Unicorn Meat','resources/unicorn.jpg');
  new Item('Tentacle Stick','resources/usb.gif');
  new Item('Art','resources/water-can.jpg');
  new Item('Stupid Wine Glass','resources/wine-glass.jpg');
}

Item.displayItems();
//listener should listen for any of the three slots, from there I can grab the item name and trigger the frefresh.
Item.clickHandler = function(event) {
  // if(debug){console.log(event.target.id);};
  if(event.target.id && event.target.id != 'main' && event.target.id != 'button'){
    if(event.target.id === 'skip'){
      Item.displayItems();
    } else {
      if(Item.rolls < 25){
        Item.rolls++;
        Item.displayItems();
        for(var i = 0; i < Item.pool.length; i++){
          if(Item.pool[i].name === event.target.alt){
            Item.pool[i].clicked++;
            if(debug){console.log(Item.pool[i].name + ' has been clicked ' + Item.pool[i].clicked + ' times.');}
            break;
          }
        }
      } else if(Item.rolls === 25) {
        Item.rolls++;
        localStorage.pool = JSON.stringify(Item.pool);
        Item.main.removeEventListener('click', Item.clickHandler);
        Item.main.innerHTML = '';
        if(debug){console.log('creating canvas');}
        Item.canvas = document.createElement('canvas');
        Item.canvas.setAttribute('id','canvas');
        Item.canvas.setAttribute('width','600');
        Item.canvas.setAttribute('height','480');
        Item.main.appendChild(Item.canvas);
        var labels = [];
        var dataset = [];
        for(i = 0; i < Item.pool.length; i++){
          labels.push(Item.pool[i].name);
          dataset.push(Item.pool[i].clicks);
        }
        var ctx = Item.canvas.getContext('2d');
        if(debug){console.log('chaaaaart');}
        new Chart(ctx,{
          type: 'bar',
          data: {
            labels: labels,
            datasets:[{
              label: 'Intrest Ratio',
              backgroundColor: 'rgb(179,214,113)',
              borderColor: 'rgb(255, 99, 132)',
              data: dataset
            }]
          }
        });
      }
    }
  }
};

Item.main.addEventListener('click', Item.clickHandler);
