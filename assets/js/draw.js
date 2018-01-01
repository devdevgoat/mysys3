
    // Creates a new canvas element and appends it as a child
    // to the parent element, and returns the reference to
    // the newly created canvas element


    function createCanvas(parent, width, height) {
        $( "canvas" ).remove();
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.node.setAttribute("id", "dungeonmap");
        canvas.context = canvas.node.getContext('2d');
        canvas.node.width = width || 100;
        canvas.node.height = height || 100;
        parent.appendChild(canvas.node);
        return canvas;
    }

    function init(container,image, width, height,lines) {
        $('#map').css("background", "url("+image+")");
        $('#map').css("background-size", "contain");
        $('#map').css("background-repeat", "no-repeat"); 
        $('#map').css("background-position", "center"); 
        let fillColor = 'rgba(0,0,0)';
        canvas = createCanvas(container, width, height);
        ctx = canvas.context;
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
        for (var i in lines){
            var x = lines[i][0] - container.offsetLeft-470;
            var y = lines[i][1] - container.offsetTop-20;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillCircle(x, y, 15, '#ff0000');
        }


    }

   