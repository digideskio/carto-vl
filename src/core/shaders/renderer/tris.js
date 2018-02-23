export const VS = `

precision highp float;

attribute vec2 vertexPosition;
attribute vec2 featureID;

uniform vec2 vertexScale;
uniform vec2 vertexOffset;

uniform sampler2D colorTex;

varying lowp vec4 color;

void main(void) {
    color = texture2D(colorTex, featureID);
    vec4 p = vec4(vertexScale*vertexPosition-vertexOffset, 0.5, 1.);
    if (color.a==0.){
        p.x=10000.;
    }
    color.rgb * = color.a;
    gl_Position  = p;
}`;

export const FS = `
precision highp float;

varying lowp vec4 color;

void main(void) {
    gl_FragColor = color;
}`;