
export default (function () {
    let context, width, height;
    let fpsInterval, lastDrawTime, frameCount, lastSampleTime;
    let updateTimerId, running, drawing, draw, update;
    let intervalID, requestID;
    let maxSamples = 2, samples = [];

    return {
        setup,
        startAnimating,
        startUpdating,
        stopUpdating,
        fpsStats,
        scale,
        random,
        make2DArray,
        distanceV2,
        distanceV2fast
    };

    function setup(canvas) {
        if(canvas === undefined || canvas === null ) throw new Error("Falta canvas");
        context = canvas.getContext('2d');
        if (!context) { throw new Error("ERROR context"); }
        width = canvas.clientWidth;
        height = canvas.clientHeight;    
        canvas.width = width;
        canvas.height = height;
        drawing = false;
        running = false;
        return context;
    }

    function startAnimating(drawFunction, fps, sampleFreq) {
        if(drawFunction !== undefined && isFunction(drawFunction)) 
        {
            draw = drawFunction;
        }
        else{
            throw new Error("no es funcion");
        }
        fpsInterval = 1000 / fps;
        lastDrawTime = performance.now();
        lastSampleTime = lastDrawTime;
        frameCount = 0;
        drawing = true;
        animate();
        
        intervalID = setInterval(sampleFps, sampleFreq);
    }

    function animate(now) {
        requestID = requestAnimationFrame(animate);
        
        var elapsed = now - lastDrawTime;
        
        if (elapsed > fpsInterval) {
            lastDrawTime = now - (elapsed % fpsInterval);
            
            drawNextFrame(now);
            
            frameCount++;
        }
    }

    function drawNextFrame(now) {
        if(isFunction(draw)) draw(now);
    }

    function startUpdating(updateFunction, update_speed) {
        if(updateFunction !== undefined && isFunction(updateFunction)) 
        {
            update = updateFunction;
        }
        else{
            throw new Error("no es funcion");
        }
        startupdate(update_speed);
    }

    function startupdate(speed) {
        running = true;
        updateTimerId = setInterval(updateNext, speed); 
    }

    function stopUpdating() {
        running = false;
        if(updateTimerId) clearInterval(updateTimerId);
    }

    function updateNext() {
        if(isFunction(update)) update();
    }

    function fpsStats(){
        
        return {
            frameCount: frameCount,
            lastSampleTime: lastSampleTime,
            fpsInterval: fpsInterval,
        };
    }

    function sampleFps() {
        var now = performance.now();
        if (frameCount > 0) {
            var currentFps =
                (frameCount / (now - lastSampleTime) * 1000).toFixed(2);
            
            frameCount = 0;
            
            samples.push(currentFps);
            if (samples.length > maxSamples + 1) {
                samples.splice(1, samples.length - (maxSamples + 1));
            }
        }
        lastSampleTime = now;
    }

    function isFunction(x) {
        return Object.prototype.toString.call(x) == '[object Function]';
    }

    function scale (num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
      
    function random (min,max) {
    min = min || 0;
    max = max || 1;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;  
    }
      
    function make2DArray(cols, rows) {
        let arr = new Array(cols);
        for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        }
        return arr;
    }
    
    function distanceV2(v1, v2) {
        if(v1 === undefined || v2 === undefined) throw new Error("falta vector");
    
        let p2 = Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2);
    
        return Math.sqrt(p2);
    }
    
    function distanceV2fast(v1, v2) {
        if(v1 === undefined || v2 === undefined) throw new Error("falta vector");
        let p2 = Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2);
    
        return p2;
    }

})();
