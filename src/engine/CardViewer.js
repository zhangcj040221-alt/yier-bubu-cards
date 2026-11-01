import * as THREE from "three";
import {createFoilMaterial} from "./foil.js";
import {backgroundTexture,plaqueTexture,starTexture} from "./textures.js";

const W=3.10,H=4.65;
function rounded(w,h,r){
  const s=new THREE.Shape(),x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
  return s;
}
function face(group,w,h,depth,material){
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);
  m.position.z=depth;group.add(m);return m;
}
function clean(group){
  const textures=new Set(),materials=new Set();
  group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){
    (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{
      materials.add(m);if(m.map)textures.add(m.map);
    });
  }});
  textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());
}

export function createCardViewer(mount){
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"high-performance"});
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.24;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
  mount.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-2.7,2.7,3.3,-3.3,0.1,50);
  camera.position.set(0,0,10);
  scene.add(new THREE.AmbientLight(0xffffff,2));
  const key=new THREE.DirectionalLight(0xffefda,3);
  key.position.set(-3,5,6);scene.add(key);
  const light=new THREE.PointLight(0xaea2ff,45,17);
  light.position.set(3,-1,5);scene.add(light);
  const root=new THREE.Group();scene.add(root);
  let current=null,actor=null,renderId=0,dead=false,tx=0,ty=0;
  const materials=[],clock=new THREE.Clock();
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setCard(card){
    if(current){root.remove(current);clean(current);}
    current=new THREE.Group();root.add(current);materials.length=0;
    const borderBack=new THREE.Mesh(
      new THREE.ShapeGeometry(rounded(W+0.12,H+0.12,0.24)),
      new THREE.MeshBasicMaterial({color:0x523450})
    );
    borderBack.position.z=-0.16;current.add(borderBack);
    const frame=new THREE.Mesh(
      new THREE.ExtrudeGeometry(rounded(W,H,0.21),{
        depth:0.055,bevelEnabled:true,bevelSize:0.038,bevelThickness:0.038,
        bevelSegments:3,curveSegments:12,steps:1}),
      new THREE.MeshPhysicalMaterial({color:0xe5bb8d,metalness:0.75,roughness:0.23,clearcoat:1})
    );
    frame.position.z=-0.10;current.add(frame);
    const paper=new THREE.Mesh(
      new THREE.ShapeGeometry(rounded(2.99,4.51,0.18)),
      new THREE.MeshBasicMaterial({color:0xffecdc})
    );
    paper.position.z=0.005;current.add(paper);

    face(current,2.92,4.42,0.018,new THREE.MeshBasicMaterial({map:backgroundTexture(card)}));
    // Holographic film over the full printed area. Gold frame stays a separate material.
    const foil=createFoilMaterial(card.foil.intensity);
    materials.push(foil);
    face(current,2.92,4.42,0.08,foil);
    const ink=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide});
    actor=face(current,2.55,3.20,0.20,ink);
    actor.position.y=0.31;
    const loadedCard=current;
    new THREE.TextureLoader().load(card.character,
      t=>{if(loadedCard!==current){t.dispose();return;}
        t.colorSpace=THREE.SRGBColorSpace;ink.map=t;ink.needsUpdate=true;},
      undefined,
      e=>console.warn("Missing character art:",card.character,e)
    );
    const topFoil=createFoilMaterial(card.foil.intensity*0.27);
    materials.push(topFoil);
    face(current,2.92,4.42,0.22,topFoil);
    const name=new THREE.MeshBasicMaterial({map:plaqueTexture(card),transparent:true,depthWrite:false});
    const namePlate=face(current,2.35,0.71,0.31,name);
    namePlate.position.y=-1.70;
    const starMat=new THREE.MeshBasicMaterial({map:starTexture(),transparent:true,depthWrite:false});
    for(let i=0;i<card.stars;i++){
      const star=face(current,0.24,0.24,0.33,starMat);
      star.position.set(-0.47+i*0.235,1.95,0.33);
    }
  }
  function setFoil(value){
    const v=THREE.MathUtils.clamp(value,0,1);
    materials.forEach((m,i)=>m.uniforms.uIntensity.value=v*(i===1?0.27:1));
  }
  function resize(){
    const w=Math.max(mount.clientWidth,1),h=Math.max(mount.clientHeight,1);
    renderer.setSize(w,h,false);
    const worldH=Math.max(6.20,3.62/(w/h)),a=w/h;
    camera.left=-worldH*a/2;camera.right=worldH*a/2;
    camera.top=worldH/2;camera.bottom=-worldH/2;camera.updateProjectionMatrix();
  }
  function pointer(e){
    const b=mount.getBoundingClientRect();
    tx=THREE.MathUtils.clamp((e.clientX-b.left)/b.width*2-1,-1,1)*0.24;
    ty=THREE.MathUtils.clamp((e.clientY-b.top)/b.height*2-1,-1,1)*-0.16;
  }
  function center(){tx=0;ty=0;}
  mount.addEventListener("pointermove",pointer,{passive:true});
  mount.addEventListener("pointerleave",center);
  const observer=new ResizeObserver(resize);observer.observe(mount);resize();

  function tick(){
    if(dead)return;renderId=requestAnimationFrame(tick);
    const t=clock.getElapsedTime();
    root.rotation.x+=(ty-root.rotation.x)*0.075;
    root.rotation.y+=(tx-root.rotation.y)*0.075;
    if(actor)actor.position.x=-root.rotation.y*0.25;
    materials.forEach(m=>{
      m.uniforms.uTime.value=reduceMotion?0:t;
      m.uniforms.uTilt.value.set(root.rotation.y,root.rotation.x);
    });
    renderer.render(scene,camera);
  }
  tick();
  return {
    setCard,setFoil,
    dispose(){dead=true;cancelAnimationFrame(renderId);observer.disconnect();
      mount.removeEventListener("pointermove",pointer);
      mount.removeEventListener("pointerleave",center);
      if(current)clean(current);renderer.dispose();renderer.domElement.remove();
    }
  };
}