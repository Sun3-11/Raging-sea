uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 fogColor;
uniform float uFogDensity;
uniform float uFogNear;
uniform float uFogFar;

varying float vElevation;
varying vec3 vFoamColor;

varying vec3 vWorldPosition;
varying float vFogFactor;

void main() {
    // fog 
    float fogFactor = smoothstep(uFogNear, uFogFar, vFogFactor);
    vec3 foggedColor = mix(fogColor, gl_FragColor.rgb, fogFactor);

    
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Add foam color
    vec3 finalColor = mix(color, vFoamColor, mixStrength);

    gl_FragColor = vec4(finalColor * foggedColor, 1.0);
}