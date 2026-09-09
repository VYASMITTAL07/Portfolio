profile.webp — the hero portrait.

This is your photo with the background removed (cut-out, transparent around
you). It was exported at 880 x 1243 and 102 KB, which is why the hero loads
fast; the original 1.1 MB PNG is not worth shipping.

To replace it later
-------------------
1. Take the new photo — half-body, facing camera, evenly lit.
2. Remove the background (remove.bg, Canva's background remover, or Photoshop).
3. Crop tight: no empty space around you, and crop so your body runs right to
   the bottom edge of the image — the hero sits the photo flush on the bottom
   of the circle.
4. Save it as profile.webp, around 900 px wide, and drop it in this folder.

index.html points at profile.webp with profile.png as the fallback source, so
a .png works too if that is easier — just keep the name.

If neither file loads, the hero falls back to a "VM" monogram inside the
circle, so the page never breaks.

The photo renders in full colour. For black and white, add
`filter: grayscale(1);` to `.photo-img` in assets/css/styles.css.
