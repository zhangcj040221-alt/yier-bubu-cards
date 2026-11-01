// Import only locally reviewed art into DRAFTS. No production overwrite.
import {copyFileSync,existsSync,mkdirSync,readFileSync} from "node:fs";
import {resolve,join} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(fileURLToPath(new URL("..",import.meta.url)));
const src=process.argv[2]?resolve(process.argv[2]):null;
if(!src||!process.argv.includes("--draft")) {
  console.error("Usage: node scripts/import-art-pack.mjs <folder> --draft");
  process.exit(2);
}
const names=["background_kitchen_clean.png","character.png","foreground_props_DRAFT.png","foil_on_face_only.png","shared_lower_foil_decor_DRAFT.png","nameplate_reference_with_text.png","frame_from_concept_draft.png","full_approved_C_reference.png","manifest.json"];
for(const name of names){
  if(!existsSync(join(src,name))){console.error("Missing "+name);process.exit(1);}
}
const manifest=JSON.parse(readFileSync(join(src,"manifest.json"),"utf8"));
if(manifest.cardId!=="chef-bubu"||!manifest.status.includes("not-art-approved"))throw Error("Not a recognized DRAFT pack");
const dest=join(root,"assets/cards/chef-bubu/drafts/v2");mkdirSync(dest,{recursive:true});
for(const name of names)copyFileSync(join(src,name),join(dest,name));
console.log("Imported "+names.length+" DRAFT files: "+dest);
console.log("No changes made to catalog or production art.");