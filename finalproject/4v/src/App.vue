<template>
  <div id="app" ref="appo">
    <div class="wrapper">
      <button type="button" class="mybtn btn btn-light" v-on:click="toggleMenu()">SHOW MENU</button>
        <nav id="sidebar" class="row">

          <div class="col-lg" id="configurtainer">
            <div class="card">
              <div class="card-header" id="headingOne">
                <h5 class="mb-0">
                  <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Camera
                  </button>
                </h5>
              </div>

              <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                <div class="card-body">
                  <div class="form-group row">
                    <div class="input-group mb-3 col-sm">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Camera X:</span>
                      </div>
                      <input type="text" class="form-control" v-model="cameraX">
                    </div>
                    <div class="input-group mb-3 col-sm">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Camera Rotation X:</span>
                      </div>
                      <input type="text" class="form-control" v-model="cameraRotX">
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="input-group mb-3 col-sm">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Camera Y:</span>
                      </div>
                      <input type="text" class="form-control" v-model="cameraY">
                    </div>
                    <div class="input-group mb-3 col-sm">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Camera Rotation Y:</span>
                      </div>
                      <input type="text" class="form-control" v-model="cameraRotY">
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="input-group mb-3 col-sm">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Camera Z:</span>
                      </div>
                      <input type="text" class="form-control" v-model="cameraZ">
                    </div>
                    <div class="input-group mb-3 col-sm">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Camera Rotation Z:</span>
                      </div>
                      <input type="text" class="form-control" v-model="cameraRotZ">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header" id="headingTwo">
                <h5 class="mb-0">
                  <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Shape Creator
                  </button>
                </h5>
              </div>
              <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                <div class="card-body">

                  <ul class="list-group" id="prim-inputs">
                    <li class="list-group-item" >
                      <div class="form-group row">
                        <label for="primitiveSelect" class="col-med col-form-label">Select 3D Shape: </label>
                        <div class="col-sm">
                            <select id="primitiveSelect" v-model="selectedPrimitiveName">
                                <option v-for="(prim, primkey) in primitives" v-bind:key="primkey" v-bind:value="primkey">{{prim.name}}</option>
                            </select>
                        </div>

                      </div>
                    </li>
                    <li class="list-group-item" v-for="(row, rowName) in selectedPrimitive.inputs" v-bind:key="rowName">
                      <div class="row" :id="rowName">
                        <p class="col-sm">{{rowName}}: </p>
                        <div v-for="(inputName, index) in row" class="input-group mb-3 col-sm" v-bind:key="inputName + index">
                          <div class="input-group-prepend">
                            <span class="input-group-text" :id="rowName + index">{{inputName}}:</span>
                          </div>
                          <input type="text" class="form-control" :id="inputName" :aria-describedby="rowName + index">
                        </div>
                      </div>
                    </li>
                  </ul>
                  <button class="btn btn-lg btn-secondary" v-on:click="render()">render</button>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header" id="headingThree">
                <h5 class="mb-0">
                  <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Lights
                  </button>
                </h5>
              </div>
              <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                <div class="card-body">
                    <div class="input-group mb-3 col-sm">
                        <div class="input-group-prepend">
                          <span class="input-group-text">Spotlight Color:</span>
                        </div>
                        <input type="text" class="form-control" v-model="lightColor">
                      </div>
                  Please use a hex value like #ff00ff or #123000!
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header" id="headingFour">
                <h5 class="mb-0">
                  <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    Animations
                  </button>
                </h5>
              </div>
              <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                <div class="card-body">
                  in the works
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg" id="object-list">

            LOOK AT THESE OBJECTS
            <ul class="list-group" id="objectlist">
                <li class="list-group-item" v-for="(obj, objName) in objects3D" v-bind:key="obj">
                  <div class="row" :id="objName">
                    <p class="col-sm">{{objName}}: </p>
                    <p>X: {{getObjPos(obj.m).x}}   Y: {{obj.m.position.y}}   Z: {{obj.m.position.z}}</p>
                  </div>
                </li>
              </ul>
          </div>

          <div id="dismiss">
          <button type="button" class="btn btn-light"  v-on:click="toggleMenu()">HIDE MENU</button>
        </div>
        </nav>
    </div>

    <div id="content">
      <div id="canvastainer">
        <div id='renderer'>

        </div>
      </div>

    </div>

    <p id="infotext">Use WASD to move</p>

  </div>
</template>

<script>

import {utilGL} from './util'
import HelloWorld from './components/HelloWorld'
import 'popper.js'

import 'bootstrap'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  computed: {
    selectedPrimitive () {
      return this.primitives[this.selectedPrimitiveName]
    },
    objects3D: () => { if (this.util) return this.util.objects3D },
    material () { return this.util.defaultMaterial() },
    primitives () { return this.util.primitives }
  },
  created: () => {
    utilGL.init()
  },
  mounted: () => {
    utilGL.initWorld()
  },
  data: function () {
    return {
      scene: undefined,
      camera: undefined,
      cameraX: 0,
      cameraY: 5,
      cameraZ: 10,
      cameraRotX: -0.3,
      cameraRotY: 0,
      cameraRotZ: 0,
      renderer: undefined,
      util: utilGL,
      light: {},
      lightColor: '#0xff0000',
      selectedPrimitiveName: 'cube',
      width: window.innerWidth,
      height: window.innerWidth
    }
  },
  methods: {
    getObjPos: (x) => this.util.getObjectPositionInWorld(x),
    toggleMenu: () => utilGL.toggleMenu(),
    render: () => utilGL.saveIfComplete(this.selectedPrimitive)
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.renderWindow {
    background: white;
}
.row {
    color: black;
}
li h1 {
    color: black;
}
#renderer {
    width: 100vh;
    height: 100vh;
    text-align: center;
}
canvas {
    width: 100vh;
    height: 100vh;
}

.mybtn {
    position: fixed;
    top: 15px;
    left: 15px;

}

#infotext {
    color: white;
    text-align: center;
    position: absolute;
    bottom: 10px;
    width: 100%;
}

wrapper {
    display: block;
}

#sidebar {
    padding: 10px 50px 10px 10px;
    min-width: 550px;
    max-width: 960px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    /* top layer */
    z-index: 9999;
    transition: all 700ms;
    background-color: rgba(150, 150, 150, 0.5);
}
.hidden-sidebar {
    margin-left: -960px;
}

.overlay {
    /* full screen */
    width: 100vw;
    height: 100vh;
    /* transparent black */
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    /* middle layer, i.e. appears below the sidebar */
    z-index: 9998;
}

#dismiss {
/*    width: 35px;
    height: 35px;
  */
  position: absolute;
    /* top right corner of the sidebar */
    top: 10px;
    right: 10px;
    z-index: 10000;

}

</style>
