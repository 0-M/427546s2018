
function saveIfComplete() {
    
    if (!app.selectedPrimitive) { 
        return;
    }

    var values = [];
    for (var row in app.selectedPrimitive.inputs) {
        let inputsForRow = app.selectedPrimitive.inputs[row]
        for (var input in inputsForRow) {
            var val = parseFloat($("#"+row).find("input#"+ inputsForRow[input]).val());
            if (val !== NaN) {
                values.push(val);
            } else {
                return;
            }
        }
    }
    app.selectedPrimitive.add(values);
}


function addTriangle(values) {
    var a = new THREE.Vector3(values[0], values[1], values[2]);
    var b = new THREE.Vector3(values[3], values[4], values[5]);
    var c = new THREE.Vector3(values[6], values[7], values[8]);

    let shape = new THREE.Shape();

    shape.moveTo(values[0], values[1], values[2]);
    shape.lineTo(values[3], values[4], values[5]);
    shape.lineTo(values[6], values[7], values[8]);
    shape.lineTo(values[0], values[1], values[2]);
    
    let geometry = new THREE.ShapeGeometry( shape );
    let material = new THREE.MeshBasicMaterial( { color: fdfd96 } );
    let mesh = new THREE.Mesh( geometry, material ) ;
    app.scene.add( mesh );

}
function addCube(values) {
    console.log("SHOWING THAT v");
    let sideLength = values[3];
    let geometry = new THREE.BoxGeometry(sideLength, sideLength, sideLength);
    geometry.translate(values[0], values[1], values[2]);
    let material = new THREE.MeshBasicMaterial( { color: 0x099ff } );
    let mesh = new THREE.Mesh( geometry, material ) ;
    app.scene.add( mesh );

}
function addSphere(values) {
    console.log("SHOWING THAT c");
    let radius = values[3];
    let geometry = new THREE.SphereGeometry(radius, 64, 64);
    geometry.translate(values[0], values[1], values[2]);
    let material = new THREE.MeshBasicMaterial( { color: 0xffd1dc } );
    let mesh = new THREE.Mesh( geometry, material ) ;
    app.scene.add( mesh );
}

var primitives = {
    triangle : {
        name: "Triangle",
        inputs: {
            "point1": ["x1", "y1", "z1"],
            "point2": ["x2", "y2", "z2"],
            "point3": ["x3", "y3", "z3"]
        },
        object3D: undefined,
        add: addTriangle        
    },
    sphere : {
        name: "Sphere",
        inputs: {
            "point": ["x", "y", "z"],
            "radius": ["radius"]
        },
        object3D: undefined,
        add: addSphere        
    },
    cube : {
        name: "Cube",
        inputs : {
            "point": ["x", "y", "z"],
            "side": ["length"]
        },
        object3D: undefined,
        add: addCube
    }
}





function render() {
    console.log("SHOWING THAT ANOTHER VERTX");

    saveIfComplete();

}
/*
function saveTriangleIfComplete() {
    var x1, x2, x3, y1, y2, y3, z1, z2, z3;
    x1 = parseInt($('#point1').find('#xinput').val());
    y1 = parseInt($('#point1').find('#yinput').val());
    z1 = parseInt($('#point1').find('#zinput').val());

    x2 = parseInt($('#point2').find('#xinput').val());
    y2 = parseInt($('#point2').find('#yinput').val());
    z2 = parseInt($('#point2').find('#zinput').val());

    x3 = parseInt($('#point3').find('#xinput').val());
    y3 = parseInt($('#point3').find('#yinput').val());
    z3 = parseInt($('#point3').find('#zinput').val());
   
    if (
        (x1 !== null && y1 !== null && z1 !== null) &&
        (x2 !== null && y2 !== null && z2 !== null) &&
        (x3 !== null && y3 !== null && z3 !== null) 
    ) {
        addTriangle(x1, y1, z1, x2, y2, z2, x3, y3, z3);
    }
}

function addTriangle(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    app.triangles.push(
        [[x1, y1, z1],
        [x2, y2, z2],
        [x3, y3, z3]]
    );
}*/

var app = new Vue({
    el: '#app',
    data: {
        scene : undefined,
        camera : undefined,
        renderer : undefined,
        objects3D : [],
        primitives : primitives,
        selectedPrimitiveName : "triangle"
    },
    computed: {
        selectedPrimitive() {
            return this.primitives[this.selectedPrimitiveName]
        }
    }
});

function setupThree() {
    app.scene = new THREE.Scene();
    app.camera = new THREE.PerspectiveCamera( 75, 300/300, 0.1, 1000 );
    app.renderer = new THREE.WebGLRenderer();
    app.renderer.setSize(300, 300);
    $('#renderer').append( app.renderer.domElement );
}

setupThree();

/*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
app.scene.add( cube );
*/







app.camera.position.z = 5;


function animate() {
    requestAnimationFrame( animate );
    
    // do animations
    // app.objects3D[0].rotation.x += 0.01;
    // app.objects3D[0].rotation.y += 0.01;
    app.renderer.render( app.scene, app.camera );

}
animate();
let camera = app.camera;
let scene = app.scene;
let renderer = app.renderer;