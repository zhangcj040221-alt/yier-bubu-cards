#!/usr/bin/env python3
"""Extract disjoint RGBA regions into individual cropped antialiased PNGs.
Usage: python tools/slice_sprite_sheet.py INPUT_RGBA.png OUTPUT_DIR
Requires: pillow, numpy, opencv-python-headless.
Touching painted objects remain one component: occluded pixels cannot be recovered.
"""
import json, re, sys
from pathlib import Path
import numpy as np
import cv2
from PIL import Image

def cut(source, destination, threshold=55, minimum_area=500, pad=11):
    image=Image.open(source).convert("RGBA")
    rgb=np.asarray(image).copy()
    height,width=rgb.shape[:2]
    opacity=rgb[:,:,3]
    count,component,stats,_=cv2.connectedComponentsWithStats((opacity>threshold).astype("uint8"),8)
    destination=Path(destination)
    destination.mkdir(parents=True,exist_ok=True)
    results=[]
    regions=[]
    for i in range(1,count):
        x,y,w,h,area=(int(j) for j in stats[i])
        if area>=minimum_area:regions.append((i,x,y,w,h,area))
    regions.sort(key=lambda o:(o[2]//100,o[1]))
    for n,(i,x,y,w,h,area) in enumerate(regions):
        name=f"sprite-{n:03d}.png"
        x0=max(0,x-pad);y0=max(0,y-pad);x1=min(width,x+w+pad);y1=min(height,y+h+pad)
        pixels=rgb[y0:y1,x0:x1].copy()
        isolated=np.uint8(component[y0:y1,x0:x1]==i)*255
        feather=cv2.GaussianBlur(isolated,(3,3),.65)
        pixels[:,:,3]=np.minimum(pixels[:,:,3],feather)
        pixels[pixels[:,:,3]==0,:3]=0
        Image.fromarray(pixels,"RGBA").save(destination/name,optimize=True)
        results.append({"id":name[:-4],"file":name,"bbox":[x0,y0,x1-x0,y1-y0],
                        "anchor":[(x+w/2)/width,(y+h/2)/height],"area":area})
    data={"source":Path(source).name,"canvas":[width,height],"sprites":results,
          "warning":"Touching objects remain combined; manual art check required."}
    (destination/"sprite_manifest.json").write_text(json.dumps(data,indent=2,ensure_ascii=False),encoding="utf8")
    print(f"Extracted {len(results)} sprites")

if __name__=="__main__":
    if len(sys.argv)!=3:raise SystemExit("Usage: python tools/slice_sprite_sheet.py INPUT_RGBA.png OUTPUT_DIR")
    cut(sys.argv[1],sys.argv[2])
