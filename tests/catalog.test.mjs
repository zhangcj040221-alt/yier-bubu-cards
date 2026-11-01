import test from "node:test";
import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {catalog,validateCatalog} from "../src/catalog.js";
test("all cards pass schema",()=>assert.equal(validateCatalog(catalog),true));
test("all referenced images exist",()=>{
  for(const card of catalog){
    const relative=card.character.replace(/^\.\//,"");
    assert.ok(existsSync(new URL("../"+relative,import.meta.url)),relative);
  }
});
test("duplicate IDs are rejected",()=>assert.throws(()=>validateCatalog([catalog[0],catalog[0]])));
test("invalid path rejected",()=>assert.throws(()=>validateCatalog([{...catalog[0],character:"broken.svg"}])));
