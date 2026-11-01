precision mediump float;
varying vec2 vUv;
uniform vec2 uTilt;
uniform float uIntensity;
uniform float uTime;
float edgeMask(vec2 uv){
  vec2 a=smoothstep(vec2(0.08,0.13),vec2(0.095,0.15),uv);
  vec2 b=1.0-smoothstep(vec2(0.91,0.87),vec2(0.93,0.89),uv);
  return a.x*a.y*b.x*b.y;
}
vec3 rainbow(float p){return .5+.5*cos(6.283185*(p+vec3(0.,.333,.667)));}
void main(){
  float phi=vUv.x*1.2+vUv.y*1.9+dot(uTilt,vec2(.9,.7))*2.+uTime*.04;
  float stripe=pow(max(0.0,cos(phi*6.6)),20.0);
  float grain=.5+.5*sin(vUv.x*109.+vUv.y*190.);
  float alpha=(.022+stripe*.20+grain*.014)*edgeMask(vUv)*uIntensity;
  vec3 color=mix(vec3(.93,.94,1.),rainbow(phi*.37),.7);
  gl_FragColor=vec4(color,clamp(alpha,0.0,.26));
}