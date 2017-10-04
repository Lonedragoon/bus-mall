'use strict';

var debug = true;

if(debug) {console.log( 'Defining the random function' );};
var random = function(min, max){
  return( Math.round(Math.random() * (max - min) + min));
};

if(debug) {console.log( 'Item.pool is where all the created Items will go.' );};
Item.pool = [];

if(debug) {console.log( 'Item.recentPool1 is where Items already displayed currently go.' );};
Item.recentPool1 = [];

if(debug) {console.log( 'Item.recentPool2 is where Items displayed last roll go.' );};
Item.recentPool2 = [];

if(debug) {console.log( 'Item.rolls keeps track of how many times the user has been shown Items.' );};
Item.rolls = 0;

if(debug) {console.log( 'Linking the "slots" elements from the DOM' );};
Item.slot1 = document.getElementById('slot1');
Item.slot2 = document.getElementById('slot2');
Item.slot3 = document.getElementById('slot3');
Item.main = document.getElementById('main');

if(debug) {console.log( 'Defining Item constructer.' );};
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
    };
  };
  for(n = 0; n < Item.recentPool2.length; n++) {
    if(itemName === Item.recentPool2[n]) {
      return(true);
    };
  };
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
      if(debug) {console.log(item.name + ' has been used too recently.');};
      i--;
    } else {
      if(i === 0) {
        if(debug) {console.log('Setting slot1 to ' + item.name);};
        slot1.src = item.filepath;
        slot1.alt = item.name;
      } else if(i === 1) {
        if(debug) {console.log('Setting slot2 to ' + item.name);};
        slot2.src = item.filepath;
        slot2.alt = item.name;
      } else if(i === 2) {
        if(debug) {console.log('Setting slot3 to ' + item.name);};
        slot3.src = item.filepath;
        slot3.alt = item.name;
      };
      Item.recentPool1.push(item.name);
      item.seen++;
    };
  };
};

new Item('Bag','resources/bag.jpg');
new Item('Bananna','resources/banana.jpg');
new Item('Bathroom','resources/bathroom.jpg');
new Item('Bendycharge','resources/bendycharge.jpg');
new Item('Breakfast','resources/breakfast.jpg');
new Item('Bubblegum','resources/bubblegum.jpg');

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
            break;
          };
        };
      } else if(Item.rolls === 25) {
        Item.rolls++;
        Item.main.removeEventListener('click', Item.clickHandler);
        Item.main.innerHTML = '';
      };
    };
  };
};

Item.main.addEventListener('click', Item.clickHandler);
