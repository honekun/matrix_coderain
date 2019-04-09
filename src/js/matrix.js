import hkc from './hkc';

export default (function() {
	let context;
	let maxcols = 30, rows = 0;
	let width = 0, height = 0;
	let fps, update_speed;
 
	function Stream(x, y, speed, size) {
		this.x = x || hkc.random(0, width);
		this.y = y || 0;
		this.speed = speed || hkc.random(1, 10);
		this.size = size || hkc.random(20, maxcols);
		this.toDelete = false;
		this.nextStream = true;
		this.symbols = [];
		this.totalSymbols = hkc.random(1, 20);
		
		this.generateSymbols = () => {
			let y = this.y;
			for(var s = 0; s <= this.totalSymbols; s++) {
				this.symbols.push(new Symbol(this.x, y, this.speed, this.size));
				y += this.size + 2;
			}
			this.y -= y;
		};

		this.render = () => {
			for(var s = 0; s < this.symbols.length; s++) {
				let symbol = this.symbols[s];
				context.font = this.size + 'px sans-serif';
				context.fillStyle = "rgb(" + 0 + ", " + 255 + ", " + 70 + ")";
				context.fillText(symbol.value, this.x , this.y + (s * this.size));
			}
		};

		let lastDownTime = 0, lastCharChangeTime = 0;
		this.update = (time) => {
			let v = hkc.scale(this.speed, 0, 100, 1, 500);
			if( time - lastDownTime > v) { // min 1 ; max 300
				if(this.y >= height ){
					this.toDelete = true;
				}
				this.y++;
				lastDownTime = time;
			}
			
			this.symbols.forEach((symbol) => {
				v = hkc.scale(symbol.charSpeed, 0, 10, 500, 1500);
				if( time - lastCharChangeTime > v) {// min 200 ; max 1500				
					symbol.setToRandomSymbol();
					lastCharChangeTime = time;
				}
			});
		}

		this.generateSymbols();
	}

	function Symbol(x, y, speed, size) {
		this.value = '';
		this.charSpeed = hkc.random(1, 10);
	
		let lastCharChangeTime = 0, lastDownTime = 0;

		this.setToRandomSymbol = () => {
			this.value = String.fromCharCode(0x30A0 + Math.round(hkc.random(0, 96)));
		};

    	this.setToRandomSymbol();
  	}

	let streams;
	function init() {
		let x = 0, y = 0;
		let s = width / maxcols;
		streams = [];    
		for(let w= 0; w < s; w++){
			streams.push(new Stream(x, y));
			x += s;
		}
  	}

	function setup(_canvas) {
		let canvas = _canvas;
		context = hkc.setup(canvas);
		width = canvas.clientWidth;
		height = canvas.clientHeight;
		fps = 60;
		update_speed = 1000/fps;
		init();
		hkc.startAnimating(draw, fps, 1000);
		hkc.startUpdating(update, update_speed);
	}

	function start(){    
		hkc.startUpdating(update, update_speed);
	}

	function reset() {
		let config = {};
		update_speed = config.speed || 1000/fps;
		
		hkc.stopUpdating();
		init();
	}

	function stop(){
		hkc.stopUpdating();
	}

	function setSpeed(s) {
		update_speed = s;
		stop();
		start();
	}


	function draw() {
		context.fillStyle = "#000000";
		context.fillRect(0, 0, width, height);
		for(let s = 0; s < streams.length; s++){
			streams[s].render();
		}
	}

	let lastUpdateTime;
	function update() {
		var now = performance.now();
		for(let s = streams.length - 1; s >= 0 ; s--){
			streams[s].update(now);
			if(streams[s].nextStream && streams[s].y > height /3) {
				streams[s].nextStream = false;
				streams.push(new Stream(streams[s].x, 0));
			}
			if(streams[s].toDelete){
				streams.splice(s, 1);
			}
		}
		lastUpdateTime = now;
	}

	return {
		setup: setup,
		start: start,
		stop: stop,
		reset: reset,
		running: () => running,
		setSpeed: setSpeed
	};

})();
