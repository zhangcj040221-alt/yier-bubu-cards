import {catalog,validateCatalog} from "./catalog.js";
import {createCardViewer} from "./engine/CardViewer.js";

validateCatalog(catalog);
const stage=document.getElementById("stage"),buttons=document.getElementById("variants");
const slider=document.getElementById("foil"),out=document.getElementById("level");
try{
  const viewer=createCardViewer(stage);
  stage.querySelector(".loading")?.remove();
  catalog.forEach((card,i)=>{
    const button=document.createElement("button");button.type="button";
    button.textContent=card.edition;
    button.setAttribute("aria-pressed",String(i===0));
    button.addEventListener("click",()=>{
      viewer.setCard(card);viewer.setFoil(Number(slider.value)/100);
      buttons.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
    });
    buttons.appendChild(button);
  });
  viewer.setCard(catalog[0]);
  slider.addEventListener("input",()=>{
    const v=Number(slider.value);out.value=v+"%";out.textContent=v+"%";
    viewer.setFoil(v/100);
  });
}catch(e){
  console.error(e);
  stage.innerHTML='<div class="loading">无法启动 3D 预览。请通过 HTTP 在支持 WebGL 的浏览器中打开。</div>';
}