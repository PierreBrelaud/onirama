// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uCl1Prop;
uniform float uCl2Prop;
uniform float uCl3Prop;
uniform float uZoom;
uniform float uSpeed;
uniform float uPosX;

varying vec2 vUv;
varying vec3 vGlobalPosition;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(2.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.5));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main()
{
    float zoom = uZoom;
    vec2 st = vUv.xy/uResolution.xy*zoom;
    float speed = uTime * uSpeed;
    //st += st * abs(sin(uTime*0.1)*3.0);
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*uTime);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*speed);
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*speed);

    float f = fbm(st+r);
    
    vec3 color1 = vec3(
        map(uColor1.r, 0., 255., 0., 1.),
        map(uColor1.g, 0., 255., 0., 1.),
        map(uColor1.b, 0., 255., 0., 1.)
    );
    vec3 color2 = vec3(
        map(uColor2.r, 0., 255., 0., 1.),
        map(uColor2.g, 0., 255., 0., 1.),
        map(uColor2.b, 0., 255., 0., 1.)
    );
    vec3 color3 = vec3(
        map(uColor3.r, 0., 255., 0., 1.),
        map(uColor3.g, 0., 255., 0., 1.),
        map(uColor3.b, 0., 255., 0., 1.)
    );

    if(uColor3.r == 0. && uColor3.g == 255. && uColor3.b == 33.) {
        color = mix(color1,
                color2,
                smoothstep(0., 1., f));
    } else {
        color = mix(color1,
                color2,
                smoothstep(0.35, 0.4, f));
        color = mix(color,
                color3,
                smoothstep(0.4, 0.9, f));
    }

    vec3 pointLightPos = vec3(uPosX,0,-15);
    float diffuseCoefficient = 1.0 - distance(pointLightPos,vGlobalPosition) / 7.;
    color.rgb += diffuseCoefficient * vec3(1, 1, 1) / 0.4;
    
    gl_FragColor = vec4(color.rgb ,1.);
}