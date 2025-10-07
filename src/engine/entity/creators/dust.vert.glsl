precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 uModel;// mesh.matrixWorld
uniform mat4 uView;// camera.matrixWorldInverse
uniform mat4 uProj;// camera.projectionMatrix

varying vec3 vWorldPos;
varying vec3 vObjPos;// позиция вершины в object space (для AABB)

void main(){
    vObjPos=position;
    vWorldPos=(uModel*vec4(position,1.)).xyz;
    gl_Position=uProj*uView*vec4(vWorldPos,1.);
}