// Data-only: every character uses this same rendering engine.
export const catalog=[
  {id:"chef-bubu",title:"厨师布",subtitle:"开心料理时间",
   edition:"C · 暖阳料理",character:"./assets/cards/chef-bubu/character.svg",
   stars:5,palette:["#ffd2af","#a58cdb","#fcefc8"],foil:{intensity:0.65,speed:0.5}},
  {id:"chef-bubu-night",title:"厨师布",subtitle:"星夜试色",
   edition:"C · 星光料理",character:"./assets/cards/chef-bubu/character.svg",
   stars:5,palette:["#a29ce1","#37467e","#ecc5da"],foil:{intensity:0.65,speed:0.5}}
];
export function validateCatalog(cards){
  if(!Array.isArray(cards)||cards.length===0)throw Error("Catalog is empty");
  const ids=new Set();
  for(const c of cards){
    if(!c.id||!/^[a-z0-9-]+$/.test(c.id)||ids.has(c.id))throw Error("Duplicate/invalid card ID: "+c.id);
    ids.add(c.id);
    if(!c.title||!c.character?.startsWith("./assets/cards/"))throw Error("Missing title/art: "+c.id);
    if(c.palette?.length!==3||c.palette.some(v=>!/^#[a-f\d]{6}$/i.test(v)))throw Error("Invalid palette: "+c.id);
    if(!Number.isInteger(c.stars)||c.stars<1||c.stars>5)throw Error("Invalid stars: "+c.id);
    if(!Number.isFinite(c.foil?.intensity)||c.foil.intensity<0||c.foil.intensity>1)throw Error("Invalid foil: "+c.id);
  }
  return true;
}