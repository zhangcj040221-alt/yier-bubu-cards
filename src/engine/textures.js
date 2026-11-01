import * as THREE from "three";
// Demo scene texture; can be replaced later by per-card background artwork.
export function backgroundTexture(card){
  const canvas=document.createElement("canvas");canvas.width=720;canvas.height=1050;
  const c=canvas.getContext("2d"),g=c.createLinearGradient(0,0,720,1050);
  card.palette.forEach((v,i)=>g.addColorStop(i/2,v));
  c.fillStyle=g;c.fillRect(0,0,720,1050);
  const glow=c.createRadialGradient(325,360,35,325,360,520);
  glow.addColorStop(0,"#ffffffaa");glow.addColorStop(1,"#ffffff00");
  c.fillStyle=glow;c.fillRect(0,0,720,1050);
  c.strokeStyle="#fff4ecc0";c.lineWidth=13;c.strokeRect(90,90,540,525);
  c.beginPath();c.moveTo(360,90);c.lineTo(360,615);c.moveTo(90,355);c.lineTo(630,355);c.stroke();
  c.fillStyle="#fff0d65a";c.fillRect(0,710,720,66);
  c.fillStyle="#b67b9170";c.fillRect(0,778,720,272);
  for(let i=0;i<48;i++){
    let x=(i*173+41)%720,y=(i*143+23)%1000;
    c.beginPath();c.arc(x,y,1+i%3,0,Math.PI*2);
    c.fillStyle=i%2?"#ffffffb8":"#ffeaafc0";c.fill();
  }
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
}
export function plaqueTexture(card){
  const canvas=document.createElement("canvas");canvas.width=900;canvas.height=270;
  const c=canvas.getContext("2d");
  c.shadowColor="#59364d99";c.shadowBlur=22;
  c.fillStyle="#fffaee";c.strokeStyle="#d5a66e";c.lineWidth=16;
  c.beginPath();c.roundRect(20,18,860,230,74);c.fill();c.stroke();c.shadowBlur=0;
  c.textBaseline="middle";c.textAlign="center";
  c.font="bold 112px 'PingFang SC','Microsoft YaHei',sans-serif";
  c.fillStyle="#864f43";c.fillText(card.title,450,123,730);
  c.font="36px 'PingFang SC','Microsoft YaHei',sans-serif";
  c.fillStyle="#a47c70";c.fillText(card.subtitle,450,207,760);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
}
export function starTexture(){
  const c=document.createElement("canvas");c.width=128;c.height=128;
  const x=c.getContext("2d");x.beginPath();
  for(let i=0;i<10;i++){
    const a=i*Math.PI/5-Math.PI/2,r=i%2?22:55;
    const xx=64+r*Math.cos(a),yy=64+r*Math.sin(a);
    i?x.lineTo(xx,yy):x.moveTo(xx,yy);
  }
  x.closePath();x.shadowBlur=12;x.shadowColor="#fff0a4";x.fillStyle="#ffe1a1";x.fill();
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}