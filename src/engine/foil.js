import * as THREE from "three";
// Prismatic foil belongs on the printed FACE, not the crystal frame.
// One shared shader for all card data, with angle-controlled diffraction.
export function createFoilMaterial(intensity=0.65){
  return new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,side:THREE.DoubleSide,
    uniforms:{uTime:{value:0},uIntensity:{value:intensity},uTilt:{value:new THREE.Vector2()}},
    vertexShader:[
      "varying vec2 vUv;",
      "void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
    ].join("\n"),
    fragmentShader:[
      "varying vec2 vUv;",
      "uniform float uTime;uniform float uIntensity;uniform vec2 uTilt;",
      "vec3 spectral(float p){return 0.5+0.5*cos(6.28318*(p+vec3(0.0,0.33,0.67)));}",
      "void main(){",
      "float a=dot(uTilt,vec2(0.8,0.9));",
      "float p=(vUv.x*1.8+vUv.y*2.5)*0.32+a*0.4+uTime*0.008;",
      "vec3 rgb=mix(vec3(0.96,0.94,1.0),spectral(p),0.72);",
      "float stripe=pow(max(0.,cos((vUv.x+vUv.y*0.7-a*0.8-uTime*0.045)*10.)),20.);",
      "float hatch=0.5+0.5*sin(vUv.x*140.+vUv.y*180.);",
      "float alpha=(0.11+stripe*0.35+hatch*0.025)*uIntensity;",
      "gl_FragColor=vec4(rgb,clamp(alpha,0.,0.5));}"
    ].join("\n")
  });
}