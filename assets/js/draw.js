
    // Creates a new canvas element and appends it as a child
    // to the parent element, and returns the reference to
    // the newly created canvas element


    function createCanvas(parent, width, height) {
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.context = canvas.node.getContext('2d');
        canvas.node.width = width || 100;
        canvas.node.height = height || 100;
        parent.appendChild(canvas.node);
        return canvas;
    }

    function init(container,image, width, height, fillColor) {
        $('#map').css("background", "url("+image+")");
        var canvas = createCanvas(container, width, height);
        var ctx = canvas.context;
        // define a custom fillCircle method
        ctx.fillCircle = function(x, y, radius, fillColor) {
            this.fillStyle = fillColor;
            this.beginPath();
            this.moveTo(x, y);
            this.arc(x, y, radius, 0, Math.PI * 2, false);
            this.fill();
        };
        ctx.clearTo = function(fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(0, 0, width, height);
        };
        ctx.clearTo(fillColor || "#ddd");
        
        // bind mouse events
        // canvas.node.onmousemove = function(e) {
        //     if (!canvas.isDrawing) {
        //        return;
        //     }
        //     //just need these (and the custom fillCircle) to run on receive
        //     var x = e.pageX - this.offsetLeft-(1690);
        //     var y = e.pageY - this.offsetTop;
        //     ctx.globalCompositeOperation = 'destination-out';
        //     ctx.fillCircle(x, y, 30, '#ff0000');
        //     console.log('{x:'+e.pageX+'/y:'+e.pageY+'}[x2:'+x+'/y2:'+y+']')
        // };
        // canvas.node.onmousedown = function(e) {
        //     canvas.isDrawing = true;
        // };
        // canvas.node.onmouseup = function(e) {
        //     canvas.isDrawing = false;
        // };


    }

   