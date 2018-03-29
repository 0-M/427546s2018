



function render() {
    console.log("SHOWING THAT");
}










function addAnotherVertex() {
    console.log("SHOWING THAT ANOTHER VERTX");

    saveTriangleIfComplete();

}

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
}

var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      numVertices: 12,
      triangles: [],
      vertices: [
            [-1,0,0],
            [1 ,0,0],
            [1 ,1,0],
            [-1,1,0],
            
            [-1,0,0],
            [-1,1,0],
            [ 0,1,-1],
            [ 0,0,-1],

            [ 1,0,0],
            [ 1,1,0],
            [ 0,1,-1],
            [ 0,0,-1]
      ]
    },
    computed: {
        showVertices() {
            var verts = ''
            for (var i=0; i<this.vertices.length; i++) {
                verts += i.toString() + ': ' + this.vertices[i].toString() + '\n\r';
            }
            return verts;
        }
    }
  });

