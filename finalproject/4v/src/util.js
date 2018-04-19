
import * as THREE from 'three'
import $ from 'jquery'

class UtilGL {
  init () {
    this.material = this.defaultMaterial()
    this.mouseX = 0
    this.mouseY = 0
    this.mouseDown = false
    this.drag = true
  }

  doThat (please) {
    console.log('neat!')
  }

  saveIfComplete (selectedPrimitive) {
    var values = []
    for (var row in selectedPrimitive.inputs) {
      let inputsForRow = selectedPrimitive.inputs[row]
      for (var input in inputsForRow) {
        var val = parseFloat($('#' + row).find('input#' + inputsForRow[input]).val())
        if (!isNaN(val)) {
          values.push(val)
        } else {
          return
        }
      }
    }
    selectedPrimitive.add(values)
  }

  addTriangle (values) {
    let shape = new THREE.Shape()

    shape.moveTo(values[0], values[1], values[2])
    shape.lineTo(values[3], values[4], values[5])
    shape.lineTo(values[6], values[7], values[8])
    shape.lineTo(values[0], values[1], values[2])

    let geometry = new THREE.ShapeGeometry(shape)
    let material = this.material
    let mesh = new THREE.Mesh(geometry, material)
    this.addMesh(mesh, this.primitives.triangle)
  }
  addCube (values) {
    console.log('SHOWING THAT cube')
    let sideLength = values[3]
    let geometry = new THREE.BoxGeometry(sideLength, sideLength, sideLength)
    geometry.translate(values[0], values[1], values[2])
    let material = this.material
    let mesh = new THREE.Mesh(geometry, material)
    this.addMesh(mesh, this.primitives.cube)
  }
  addSphere (values) {
    console.log('SHOWING THAT sphere')
    let radius = values[3]
    let geometry = new THREE.SphereGeometry(radius, 64, 64)
    geometry.translate(values[0], values[1], values[2])
    //    let material = new THREE.MeshBasicMaterial( { color: 0xffd1dc } );
    let material = this.material
    let mesh = new THREE.Mesh(geometry, material)
    this.addMesh(mesh, this.primitives.sphere)
  }

  addMesh (mesh, prim) {
    this.scene.add(mesh)
    this.scene.updateMatrixWorld(true)
    prim.count += 1
    this.objects3D[prim.name + prim.count.toString()] = {m: mesh}
    // app.objects3D = this.objects3D
  }

  getObjectPositionInWorld (mesh) {
    var position = new THREE.Vector3()
    position.getPositionFromMatrix(mesh.matrixWorld)
    return {x: position.x, y: position.y, z: position.z}
  }

  primitives = {
    triangle: {
      name: 'Triangle',
      inputs: {
        'point1': ['x1', 'y1', 'z1'],
        'point2': ['x2', 'y2', 'z2'],
        'point3': ['x3', 'y3', 'z3']
      },
      objects3D: undefined,
      add: this.addTriangle,
      count: 0
    },
    sphere: {
      name: 'Sphere',
      inputs: {
        'point': ['x', 'y', 'z'],
        'radius': ['radius']
      },
      objects3D: undefined,
      add: this.addSphere,
      count: 0
    },
    cube: {
      name: 'Cube',
      inputs: {
        'point': ['x', 'y', 'z'],
        'side': ['length']
      },
      objects3D: undefined,
      add: this.addCube,
      count: 0
    }
  }

  render () {
    console.log('SHOWING THAT ANOTHER VERTX')

    this.saveIfComplete()
  }

  setupThree () {
    this.objects3D = {}
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    $('#renderer').append(this.renderer.domElement)
  }

  /* var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
app.scene.add( cube );
*/

  addLight (pos, color) {
    var light = new THREE.PointLight(color, 1000, 100)
    light.position.set(pos[0], pos[1], pos[2])
    this.scene.add(light)
    return light
  }

  animate () {
    requestAnimationFrame(() => { this.animate() })
    // console.log(this.camera.rotation);this.animate
    this.camera.position.x = parseFloat(this.cameraX)
    this.camera.position.y = parseFloat(this.cameraY)
    this.camera.position.z = parseFloat(this.cameraZ)
    this.camera.rotation.x = parseFloat(this.cameraRotX)
    this.camera.rotation.y = parseFloat(this.cameraRotY)
    this.camera.rotation.z = parseFloat(this.cameraRotZ)
    // do animations
    // this.objects3D[0].rotation.x += 0.01;
    // this.objects3D[0].rotation.y += 0.01;
    if (this.lightColor !== undefined) {
      let hex = parseInt(this.lightColor.replace(/^#/, ''), 16)
      this.light.color.setHex(hex)
    }

    if (this.drag) {
      if (this.mouseDown) {
        let spdy = (this.mouseY - this.mouseStart.y) / 100
        let spdx = (this.mouseX - this.mouseStart.x) / 100
        this.mouseStart = {x: this.mouseX, y: this.mouseY}
        let newX = parseFloat(this.cameraRotX) || 0
        let newY = parseFloat(this.cameraRotY) || 0
        this.cameraRotX = newX + parseFloat(spdy)
        this.cameraRotY = newY + parseFloat(spdx)
        //            Vue.set(this.camera.rotation, "y", this.camera.rotation.y + spdx);
        //            Vue.set(this.camera.rotation, "x", this.camera.rotation.x + spdy);
      }
    }

    this.renderer.render(this.scene, this.camera)
  }

  toggleMenu () {
    $('#sidebar').toggleClass('hidden-sidebar')
  }

  addDefaults () {
    this.addSphere([0, 0, 0, 0.5])
  }

  setupDragging () {
    document.addEventListener('mousemove', function (event) {
      this.mouseX = event.clientX
      this.mouseY = event.clientY
    }, false)
    document.body.addEventListener('mousedown', function (event) {
      this.mouseStart = {x: event.clientX, y: event.clientY}
      this.mouseDown = true
    }, false)
    document.body.addEventListener('mouseup', function (event) {
      this.mouseDown = false
    }, false)
  }

  setupWalking () {
    window.onkeydown = function (e) {
      var code = e.keyCode ? e.keyCode : e.which
      if (code === 65) { // a key
        this.cameraX -= 0.1
      } else if (code === 68) { // d key
        this.cameraX += 0.1
      }

      if (code === 87) { // w key
        this.cameraZ -= 0.1
      } else if (code === 83) { // s key
        this.cameraZ += 0.1
      }

      if (code === 40) { // w key
        this.cameraY -= 0.1
      } else if (code === 38) { // s key
        this.cameraY += 0.1
      }
    }
  }

  initWorld () {
    this.setupThree()

    this.light = new THREE.AmbientLight(0x404040) // soft white light
    this.scene.add(this.light)

    // attach to window

    window.light = this.addLight([50, 50, 50], 0xff0000)
    window.camera = this.camera
    window.scene = this.scene
    window.renderer = this.renderer
    this.animate()

    this.addDefaults()
    this.setupDragging()
    this.setupWalking()
  }
  defaultMaterial () {
    return new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, flatShading: true })
  }
}

export let utilGL = new UtilGL()
