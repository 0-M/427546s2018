
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
    let material = app.material;
    let mesh = new THREE.Mesh( geometry, material ) ;
    addMesh( geometry, mesh, app.primitives.triangle );
}
function addCube(values) {
    console.log("SHOWING THAT cube");
    let sideLength = values[3];
    let geometry = new THREE.BoxGeometry(sideLength, sideLength, sideLength);
    geometry.translate(values[0], values[1], values[2]);
    let material = app.material;
    let mesh = new THREE.Mesh( geometry, material ) ;
    addMesh( geometry, mesh, app.primitives.cube );
    return mesh;
}
function addSphere(values) {
    console.log("SHOWING THAT sphere");
    let radius = values[3];
    let geometry = new THREE.SphereGeometry(radius, 64, 64);
    geometry.translate(values[0], values[1], values[2]);
//    let material = new THREE.MeshBasicMaterial( { color: 0xffd1dc } );
    let material = app.material;
    let mesh = new THREE.Mesh( geometry, material ) ;
    addMesh( geometry, mesh, app.primitives.sphere );
}
function addPlane(values) {
    console.log("SHOWING THAT plane");
    let sideA = values[3];
    let sideB = values[4];
    let geometry = new THREE.PlaneGeometry(sideA, sideB);
    geometry.translate(values[0], values[1], values[2]);
     geometry.rotateX(-1*Math.PI/2)
    // geometry.rotateY(Math.PI/4);
    // geometry.rotateZ(Math.PI/4);
//    let material = new THREE.MeshBasicMaterial( { color: 0xffd1dc } );
    //let material = getMaterial();
    var texture = new THREE.TextureLoader().load( './brick-bump-map.jpg' );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );
    //var bmap =  THREE.ImageUtils.loadTexture('./brick-bump-map.jpg', {}, function(){})
    let material = new THREE.MeshPhongMaterial({
        color      :  new THREE.Color("rgb(153, 102, 102)"),
        emissive   :  new THREE.Color("rgb(7,3,5)"),
        specular   :  new THREE.Color("rgb(255,113,0)"),
        shininess  :  20,
        bumpMap    :  texture,
        bumpScale  :  0.9,
      });
    material.side = THREE.DoubleSide;
    let mesh = new THREE.Mesh( geometry, material ) ;
    mesh.receiveShadow = true;
    // mesh.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
    addMesh( geometry, mesh, app.primitives.plane );
}

function addMesh(geom, mesh, prim) {
    mesh.updateMatrix();
    mesh.castShadow = true;
    geom.merge(mesh.geometry, mesh.matrix);
    app.scene.add(mesh);
    app.scene.updateMatrixWorld(true);
    prim.count += 1;
    Vue.set(app.objects3D, prim.name + prim.count.toString(), {m: mesh});
}

function getObjectPositionInWorld(mesh) {
    var position = new THREE.Vector3();
    position.getPositionFromMatrix( mesh.matrixWorld );
    return {x: position.x, y: position.y, z: position.z}
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
        add: addTriangle,
        count:0
    },
    sphere : {
        name: "Sphere",
        inputs: {
            "center": ["x", "y", "z"],
            "radius": ["radius"]
        },
        object3D: undefined,
        add: addSphere,
        count:0        
    },
    cube : {
        name: "Cube",
        inputs : {
            "center": ["x", "y", "z"],
            "side": ["length"]
        },
        object3D: undefined,
        add: addCube,
        count:0
    },
    plane : {
        name: "Plane",
        inputs : {
            "center": ["x", "y", "z"],
            "sides": ["length", "width"]
        },
        object3D: undefined,
        add: addPlane,
        count:0
    }
}





function render() {
    console.log("SHOWING THAT ANOTHER VERTX");

    saveIfComplete();

}


var app = new Vue({
    el: '#app',
    data: {
        scene : undefined,
        camera : undefined,
        drag : true,
        mouseX: 0,
        mouseY: 0,
        mouseDown: false,
        cameraX: 0,
        cameraY: 3,
        cameraZ: 10,
        currentCameraRot: [0,0,0],
        cameraRotX: -0.3,
        cameraRotY: 0,
        cameraRotZ: 0,
        material: new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, flatShading: true } ),
        renderer : undefined,
        objects3D : {},
        primitives : primitives,
        // light: () => addLight([50,50,50], 0xff0000),
        lightColor : "#0x050505",
        selectedPrimitiveName : "cube",
        width: window.innerWidth,
        height: window.innerWidth
    },
    computed: {
        selectedPrimitive() {
            return this.primitives[this.selectedPrimitiveName]
        }
    },
    methods: {
        getObjPos: getObjectPositionInWorld
    }
});

function getMaterial() {
    let colors = [0xffb3ba, 0xffdfba, 0xffffba, 0xbaffc9, 0xbae1ff, 0xe1f7d5]
    yourcolor = colors[Math.floor(Math.random()*colors.length)]
    yourspec = colors[Math.floor(Math.random()*colors.length)]
    return new THREE.MeshPhongMaterial( { color: yourcolor, specular: yourspec, shininess: 30, flatShading: true } )
}
function setupThree() {
    app.scene = new THREE.Scene();
    // app.scene.background = new THREE.Color( 0x0a000a );
    var texture = new THREE.TextureLoader().load( './brick-bump-map.jpg' );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 10, 10 );
    //app.scene.background = texture;
    app.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    app.renderer = new THREE.WebGLRenderer({ alpha: true});
    app.renderer.shadowMap.enabled = true;
    app.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    app.renderer.setSize(window.innerWidth, window.innerHeight);
    $('#renderer').append( app.renderer.domElement );
    // app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );

}

setupThree();
// var controls = app.controls;

/*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
app.scene.add( cube );
*/

function addLight(pos, color) {
    var group = new THREE.Group();
    let geometry = new THREE.SphereGeometry(3, 64, 64);
    geometry.translate(pos[0], pos[1], pos[2]);
//    let material = new THREE.MeshBasicMaterial( { color: 0xffd1dc } );
    var material = new THREE.MeshPhongMaterial({ emissive: 0xffffff });
    let mesh = new THREE.Mesh( geometry, material ) ;
    mesh.name = "sphero"
    group.add(mesh);
    var light = new THREE.PointLight( color, 100, 100 );
    light.name = "sun";
    light.castShadow = true;            // default false
    light.position.set( pos[0], pos[1], pos[2] );
    group.add(light)
    app.scene.add( group );
    return group;
}
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
app.scene.add( light );

light = addLight([25,5,-65], 0x050505);

var count = 0;
var insideLight = false;
var leftLightCount = 0;
var lightColors = ["ff0000", "00ff00", "ff00ff", "ff00ff", "82e0aa",  "aed6f1" ]

function animate() {
    count++;
    requestAnimationFrame( animate );
    // console.log(app.camera.rotation);
    app.camera.position.x = parseFloat(app.cameraX);
    app.camera.position.y = parseFloat(app.cameraY);
    app.camera.position.z = parseFloat(app.cameraZ);
    app.camera.rotation.x = parseFloat(app.cameraRotX);
    app.camera.rotation.y = parseFloat(app.cameraRotY);
    app.camera.rotation.z = parseFloat(app.cameraRotZ);
    // app.controls.update();
    light.rotation.x += 0.001;



    // do animations
    if (specialcube) {
        specialcube.updateMatrix();
        var rotation = 0.1
        if (parseInt(count/500) % 2) {
            rotation *= -1;
        }
        specialcube.rotateX(rotation);
        specialcube.rotateY(rotation);

        //specialcube.rotation.x += 0.01;
        //specialcube.rotation.y += 0.01;
        worldPos = new THREE.Vector3();
        specialcube.getWorldPosition(worldPos);
        // console.log(worldPos)
        // console.log(specialcube.position)
        //console.log(specialcube.rotation)
        let posdiff = Math.abs(3 - camera.position.x)+Math.abs(3 - camera.position.y)+Math.abs(0-camera.position.z)
        if (posdiff < 2) {
            if (!insideLight){
                app.lightColor = lightColors[Math.floor(Math.random() * lightColors.length)];
                let hex = parseInt(app.lightColor.replace(/^#/, ''), 16);
                light.getObjectByName("sphero").material.emissive.setHex( hex);
                light.getObjectByName("sun").intensity = 5;
                
                insideLight = true;
                leftLightCount = 0;
            }
        } else {
            if (leftLightCount > 25) {
                insideLight = false;
                leftLightCount = 0;
            } else {
                leftLightCount++;
            }
            console.log(posdiff)
        }
    }
    let hex = parseInt(app.lightColor.replace(/^#/, ''), 16);
    light.getObjectByName("sun").color.setHex( hex);
    

    if (app.drag) {

        if (app.mouseDown){        
            let spdy = (app.mouseY - app.mouseStart.y) / 100;
            let spdx = (app.mouseX - app.mouseStart.x) / 100;
            app.mouseStart = {x: app.mouseX, y: app.mouseY};
            let newX = parseFloat(app.cameraRotX) || 0;
            let newY = parseFloat(app.cameraRotY) || 0;
            app.cameraRotX = newX + parseFloat(spdy);
            app.cameraRotY = newY + parseFloat(spdx);
//            Vue.set(app.camera.rotation, "y", app.camera.rotation.y + spdx);
//            Vue.set(app.camera.rotation, "x", app.camera.rotation.x + spdy);
        }
    }

    app.renderer.render( app.scene, app.camera );

}
animate();
let camera = app.camera;
let scene = app.scene;
let renderer = app.renderer;

function toggleMenu() {
    $("#sidebar").toggleClass("hidden-sidebar");
}

toggleMenu()

var specialcube;
function addDefaults() {
    specialcube = addCube([3,3,0,0.5]);
    addSphere([0,0,0,0.5]);
    addPlane([0,-1,0,100,100]);

    vpw = $(window).width();
    vph = $(window).height();
    $('#content').css({'height': vph + 'px','width': vpw + 'px', });
    $('#canvastainer').css({'height': vph + 'px','width': vpw + 'px', });
    $('#renderer').css({'height': vph + 'px','width': vpw + 'px', });
}
addDefaults();

function setupDragging() {
    document.addEventListener('mousemove', function(event) {
        app.mouseX = event.clientX;
        app.mouseY = event.clientY;
    }, false);
    document.body.addEventListener("mousedown", function(event) {
        app.mouseStart = {x: event.clientX, y: event.clientY}
        app.mouseDown = true
    }, false);
    document.body.addEventListener("mouseup", function(event) {
        app.mouseDown = false
    }, false);

    
}
setupDragging();

var keymap = []; 

function setupWalking() {
    window.onkeyup = function (e) {
        keymap[e.keyCode] = e.type == 'keydown'
    }

    window.onkeydown = function (e) {
        keymap[e.keyCode] = e.type == 'keydown'

        var code = e.keyCode ? e.keyCode : e.which;
        if (keymap[65]) { //a key
            // app.cameraX -= 0.1
            moveCameraStrafe(true)
        } else if (keymap[68]) { //d key
            moveCameraStrafe(false)
            
            //app.cameraX += 0.1
        }
        if (keymap[87]) { //w key
            // app.cameraZ -= 0.1;
            moveCameraForward(false);
        } else if (keymap[83]) { //s key
            moveCameraForward(true);
        }

      if (keymap[40]) { // down key
        app.cameraY -= 0.1
      } else if (keymap[38]) { // up key
        app.cameraY += 0.1
      }
    };
}

function moveCameraForward(neg) {
    let cameraVector = new THREE.Vector3()
    app.camera.getWorldDirection(cameraVector)
    let speed = 0.5
    if (neg) {
        cameraVector.multiplyScalar(speed * -1)
    } else {
        cameraVector.multiplyScalar(speed)        
    }
    app.cameraX += cameraVector.x;
    app.cameraY += cameraVector.y;
    app.cameraZ += cameraVector.z;
}


function moveCameraStrafe(neg) {
    let cameraVector = new THREE.Vector3()
    app.camera.getWorldDirection(cameraVector)
    cameraVector.cross(app.camera.up)
    let speed = 0.5
    if (neg) {
        cameraVector.multiplyScalar(speed * -1)
    } else {
        cameraVector.multiplyScalar(speed)        
    }
    app.cameraX += cameraVector.x;
    app.cameraY += cameraVector.y;
    app.cameraZ += cameraVector.z;
}

setupWalking();