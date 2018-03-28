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
    // console.log("doing that whel");
};

function startFractal() {
    ctx.clearRect(0, 0, canv.width, canv.height);

    let begin = [canv.width / 3, canv.height/2];
    let end = [(2*canv.width) / 3, canv.height/2];
    var ratio = eval($('#ratio').val());
    let primitive = $('#fractal-primitive').val();
    let iterations = parseInt($('#iterations').val());

    console.log("start: ", begin, " end: ", end, " ratio:", ratio, " iterations:", iterations, "  primitive: ", primitive);
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
                let center = midpoint(begin, end);
                let radius = distanceBetween(center, end);
                let startAngle = getAngle([0,0], [center[0]-begin[0], center[1]-begin[1]]);
                let endAngle = getAngle([0,0], [center[0]-end[0], center[1]-end[1]]);
                ctx.beginPath();
                ctx.arc(center[0], center[1], radius, startAngle, endAngle, up);
                ctx.stroke();
                break;
            }
        }
    } else {
        var count = 0;
        var newUp;
        for (var i=0; i<1; i+=ratio ) {
            console.log("looping, i = ", i, " ratio = ", ratio);
            if (up) {
                newUp = count % 2 ? true : false;
            } else {
                newUp = count % 2 ? false : true;
            }
           
            if (primitive === "line") {
                var newPoints = pointsOnPrimitive(primitive, begin, end, i, i+ratio/2, up, true);
                drawFractal(primitive, ratio, iterations-1, newPoints[0], newPoints[1], newUp);
                console.log("recursing: ", iterations, "ratio: ", i, " newPoints: ", newPoints);

                newPoints = pointsOnPrimitive(primitive, begin, end, i+ratio/2, i+ratio, up, false);
                drawFractal(primitive, ratio, iterations-1, newPoints[0], newPoints[1], newUp);
            } else if (primitive === "arc") {
                var newPoints = pointsOnPrimitive(primitive, begin, end, i, i+ratio, up);
                console.log("recursing: ", iterations, "ratio: ", i, " newPoints: ", newPoints);
                drawFractal(primitive, ratio, iterations-1, newPoints[0], newPoints[1], newUp);

//                newPoints = pointsOnPrimitive(primitive, begin, end, i+ratio/2, i+ratio, up, false);
//                drawFractal(primitive, ratio, iterations-1, newPoints[0], newPoints[1], newUp);
            }
            count += 1;
        }
    }

};

function midpoint(a, b) {
    return [(a[0]+b[0])/2, (a[1]+b[1])/2];
}

function getAngle(a, b) {
    return Math.atan2((b[1]-a[1])*-1, (b[0]-a[0]));
}

function distanceBetween(a, b) {
    var x = Math.abs(a[0] - b[0]);
    var y = Math.abs(a[1] - b[1]);
    var csq = (x*x)+(y*y);
    // console.log("csq", csq);
    return Math.sqrt(csq);
}

function pointsOnPrimitive(primitive, begin, end, i, j, up, positive) {
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
            //var length = rtTwo * d; // the whole triangle path length, one side is rt2*(d/2)
            var length = rtTwo * (d/2);
            var x = 0;
            var y = 0;
            // console.log("PoP 2: angle: ", angle, "reverse:", reverseAngle, d );
            if (positive) {
                // start at begin
                points[0] = begin;

                let tempAngle = angle - (mult*Math.PI/4);
                x = begin[0] + length*Math.cos(tempAngle);
                y = begin[1] + length*Math.sin(tempAngle);
                points[1] = [x,y];

            } else {
                let tempAngle = reverseAngle + (mult*Math.PI/4);
                // console.log("tempAngle neg ", tempAngle);
                                
                i = 1-i;
                j = 1-j;

                x = end[0] + length*Math.cos(tempAngle);
                y = end[1] + length*Math.sin(tempAngle);
                points[0] = [x,y];

                points[1] = end;
            }            
            break;
        }
        case "arc": {
            center = midpoint(begin, end);
            let radius = distanceBetween(begin, center);
            var x = center[0] + radius * Math.cos(Math.PI*i + (mult*angle));
            var y = center[1] + radius * Math.sin(Math.PI*i + (mult*angle));
            points[0] = [x,y];
            let x2 = center[0] + radius * Math.cos(Math.PI*j + (mult*angle));
            let y2 = center[1] + radius * Math.sin(Math.PI*j + (mult*angle));
            points[1] = [x2,y2];
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


function runUnitTests() {
    console.log("midpoint  5,5  10,10: ", midpoint([5,5],[10,10]));
    console.log("distanceBetween  5,5  15,15: ", distanceBetween([5,5],[15,15]));
    console.log("getAngle  5,5  10,10: ", getAngle([5,5],[10,10]));
    console.log("getAngle  5,5  10,0: ", getAngle([5,5],[10,0]));
}


setupCanvas();
showWheels();

runUnitTests();