
    // Creates a new canvas element and appends it as a child
    // to the parent element, and returns the reference to
    // the newly created canvas element


    function createCanvas(parent, width, height) {
        $( "canvas" ).remove();
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.context = canvas.node.getContext('2d');
        canvas.node.width = width || 100;
        canvas.node.height = height || 100;
        parent.appendChild(canvas.node);
        return canvas;
    }

    function init(container,image, width, height, fillColor,lines) {
        $('#map-gm').css("background", "url("+image+")");
        $('#map-gm').css("background-size", "contain");
        $('#map-gm').css("background-repeat", "no-repeat"); 
        $('#map-gm').css("background-position", "center"); 
        var canvas = createCanvas(container, width, height);
        var ctx = canvas.context;
        // define a custom fillCircle method
        ctx.fillCircle = function(x, y, radius, fillColor) {
            var gradient = this.createRadialGradient(x, y, 0, x, y,radius);
            gradient.addColorStop(0, 'rgba(0,0,0,.5)');
            gradient.addColorStop(.6, 'rgba(0,0,0,.25)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            this.fillStyle = gradient;
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
        //update past lines

        for (var i in lines){
            var x = lines[i][0] - container.offsetLeft-470;
            var y = lines[i][1] - container.offsetTop;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillCircle(x, y, 15, '#ff0000');
        }
        //bind mouse events
        canvas.node.onmousemove = function(e) {
            if (!canvas.isDrawing) {
               return;
            }
            //just need these (and the custom fillCircle) to run on receive
            var x = e.pageX - this.offsetLeft-470;
            var y = e.pageY - this.offsetTop;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillCircle(x, y, 15, '#ff0000');
            exposeMapPortion(pageId,e.pageX,e.pageY);
        };
        canvas.node.onmousedown = function(e) {
            canvas.isDrawing = true;
        };
        canvas.node.onmouseup = function(e) {
            canvas.isDrawing = false;
        };


    }

   