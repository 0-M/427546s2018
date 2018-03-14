console.log("doing that");

var canv = $("#fractalCanv")[0];
var ctx = canv.getContext("2d");

function setupCanvas() {
    var canv = $("#wheelCanv")[0];
    canv.width  = 592;
    canv.height = 300; 
    canv.style.width  = '592px';
    canv.style.height = '300px';
    var canv = $("#fractalCanv")[0];    
    canv.width  = 592;
    canv.height = 300; 
    canv.style.width  = '592px';
    canv.style.height = '300px';
    ctx=canv.getContext("2d");    
};

function showFractals() {
    console.log("doing that frac");
    canv = $("#fractalCanv")[0];
    ctx = canv.getContext("2d");
    $('#fractal').show();
    $('#fractalNav').addClass('active');
    $('#wheel').hide();
    $('#wheelNav').removeClass('active');    

};

function showWheels() {
    canv = $("#wheelCanv")[0];
    ctx = canv.getContext("2d");    
    $('#wheel').show();
    $('#wheelNav').addClass('active');    
    $('#fractal').hide();
    $('#fractalNav').removeClass('active');
    let suggestedRadius = Math.min(canv.height, canv.width) * 0.4;
    $('#suggestedRadius').text('Suggested Radius: ' + suggestedRadius.toString());
    console.log("doing that whel");
};

function startFractal() {
    let begin = [canv.width / 4, 3*canv.height/4];
    let end = [(3*canv.width) / 4, 3*canv.height/4];
    let ratio = eval($('#ratio').val());
    let primitive = "line";
    let iterations = parseInt($('#iterations').val());
    console.log("start: ", begin, " end: ", end, " ratio:", ratio, " iterations:", iterations);
    drawFractal(primitive, ratio, iterations, begin, end, true);
};

function drawLine(a, b) {
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);
    ctx.lineTo(b[0],b[1]);
    ctx.stroke();
}

function drawFractal(primitive, ratio, iterations, begin, end, up) {
    if (iterations === 0) {
        switch (primitive) {
            case "line": {
                console.log("drawing line from ",begin, " to ", end);
                drawLine(begin, end);
                break;
            }
            case "arc": {
                console.log("drawing arc from ",begin, " to ", end);
                break;
            }
        }
    } else {
        var count = 0;
        var newUp;
        for (i=0; i<1; i+=ratio ) {
            if (up) {
                newUp = i % 2 ? true : false;
            } else {
                newUp = i % 2 ? false : true;
            }
            let newPoints = pointsOnPrimitive(primitive, begin, end, i, i+ratio, up);
            console.log("recursing: ", iterations, "ratio: ", i, " newPoints: ", newPoints);
            drawFractal(primitive, ratio, iterations-1, newPoints[0], newPoints[1], newUp)
            count += 1;
        }
    }

};

function midpoint(a, b) {
    return [(a[0]+b[0])/2, (a[1]+b[1])/2];
}

function getAngle(a, b) {
    return Math.atan2(b[1]-a[1], b[0]-a[0]);
}

function distanceBetween(a, b) {
    var x = Math.abs(a[0] - b[0]);
    var y = Math.abs(a[1] - b[1]);
    var csq = (x*x)+(y*y);
    // console.log("csq", csq);
    return Math.sqrt(csq);
}

function pointsOnPrimitive(primitive, begin, end, i, j, up) {
    // find two points along primitive
    // console.log("PoP input: ", begin, end, i, j, up);

    var points = [[0,0], [0,0]];
    var angle = getAngle(begin, end);
    var reverseAngle = getAngle(end, begin);
    var mult = up?-1:1;
    var d = distanceBetween(begin, end);

    switch (primitive) {
        case "line": {
            var rtTwo = Math.sqrt(2);
            var length = rtTwo * d; // the whole triangle path length, one side is rt2*(d/2)
            var x = 0;
            var y = 0;
            // console.log("PoP 2: ", angle, reverseAngle, mult, d);
            if (i <= 0.5) {
                // start at begin
                let tempAngle = angle - Math.PI/4;
                x = begin[0] + length*i*Math.cos(tempAngle);
                y = begin[1] + length*i*Math.sin(tempAngle);
            } else {
                let tempAngle = reverseAngle + Math.PI/4;                
                i = 1-i;
                x = begin[0] +length*i*Math.cos(tempAngle);
                y = begin[1] +length*i*Math.sin(tempAngle);
            }
            points[0] = [x,y];

            if (j <= 0.5) {
                let tempAngle = angle - Math.PI/4;
                x = end[0] + length*j*Math.cos(tempAngle);
                y = end[1] + length*j*Math.sin(tempAngle);
            } else {
                j = 1-j
                let tempAngle = reverseAngle - Math.PI/4;
                x = end[0] + length*j*Math.cos(tempAngle);
                y = end[1] + length*j*Math.sin(tempAngle);
            }
            
            points[1] = [x,y];
            
            break;
        }
        case "arc": {
            center = midpoint(begin, end);
            var x = center[0] + radius * Math.cos(2*Math.PI*i + (mult*angle));
            var y = center[1] + radius * Math.sin(2*Math.PI*i + (mult*angle));
            points[0] = [x,y];
            x = center[0] + radius * Math.cos(2*Math.PI*j + (mult*angle));
            y = center[1] + radius * Math.sin(2*Math.PI*j + (mult*angle));
            points[1] = [x,y];
            break;
        }
    }

    // console.log("points on prim: ", points);

    return points;
}; 

function startWheel() {
    let points = 80;
    points = parseInt($("#driverScore").val());
    r = parseInt($("#radius").val());
    makeWheel(points, r);
};

var current;

function makeWheel(score, radius) {

    ctx.clearRect(0, 0, canv.width, canv.height);

    let decScore = score/100;

    let center = [canv.width/2, canv.height/2];

    if (decScore >= 1) {
        ctx.beginPath();
        ctx.arc(center[0],center[1],radius,0,2*Math.PI);
        ctx.stroke();
    } else if (decScore > 0.79) {
        ctx.beginPath();        
        current = ctx.ellipse(center[0], center[1], radius, radius * (score/100), 0,0,2*Math.PI);
        ctx.stroke();
    } else {
        drawRegularPoly(center, radius, score);
    }
};

function drawRegularPoly(center, radius, n) {
    
    ctx.beginPath();
        
    var initialX = center[0] + radius;
    var initialY = center[1];

    ctx.moveTo(initialX, initialY);
    
    for (i=1; i<=n; i++) {
        var x = center[0] + radius * Math.cos(2*Math.PI*i/n);
        var y = center[1] + radius * Math.sin(2*Math.PI*i/n);
        ctx.lineTo(x,y);
    }
    ctx.stroke();
};


setupCanvas();
showWheels();