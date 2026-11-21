# The About film

The film beside "Who we are" shows an excavator loading a parked dump truck. It was made with Gemini on 21 Nov 2026 and is a placeholder until real footage of the group's own machines exists.

The machines have the orange look of Hitachi equipment, as the client asked, but carry no maker's name, logo or badge. Showing a company's logo needs that company's permission. Film of the group's own machine can show it.

## The story, and where it stands

| Shot | File | From picture | To picture | Length | Cost | State |
|---|---|---|---|---|---|---|
| The excavator loads the truck | `truck-load.mp4` | `truck-full.jpg` | `truck-full.jpg` | 10 s | $1.04 | Made and on the site |
| The same, remade so the truck starts empty | `truck-load.mp4` | `truck-empty.jpg` | `truck-full.jpg` | 10 s | $1.04 | Waiting for Gemini credit |
| The full truck drives away | `truck-leave.mp4` | `truck-full.jpg` | `truck-gone.jpg` | 6 s | $0.62 | Waiting for Gemini credit |
| The next truck backs in | `truck-arrive.mp4` | `truck-gone.jpg` | `truck-empty.jpg` | 6 s | $0.62 | Waiting for Gemini credit |

Each shot starts on the exact picture the one before it ended on, so the film can loop forever with no jump. In the shot on the site today the truck already holds sand at the start, and the back of the excavator looks pale for about three seconds while it turns. The remake is meant to fix both.

`tools/about-film.sh` uses the leaving and arriving shots as soon as both files are here, with no code changes.

## To make the remaining shots

Add Gemini credit, then run these from the project folder, one at a time, with the prompts below. Save each result here under the file name in the table, then run `tools/about-film.sh`.

```bash
~/gemini-image-mcp/.venv/bin/python ~/gemini-image-mcp/server.py video "LOAD PROMPT" --aspect 9:16 --seconds 10 --resolution 1080p --start generated-images/about/truck-empty.jpg --end generated-images/about/truck-full.jpg --name truck-load
```

```bash
~/gemini-image-mcp/.venv/bin/python ~/gemini-image-mcp/server.py video "LEAVE PROMPT" --aspect 9:16 --seconds 6 --resolution 1080p --start generated-images/about/truck-full.jpg --end generated-images/about/truck-gone.jpg --name truck-leave
```

```bash
~/gemini-image-mcp/.venv/bin/python ~/gemini-image-mcp/server.py video "ARRIVE PROMPT" --aspect 9:16 --seconds 6 --resolution 1080p --start generated-images/about/truck-gone.jpg --end generated-images/about/truck-empty.jpg --name truck-arrive
```

## The pictures

`truck-full.jpg` is the original 2K picture. `truck-empty.jpg` and `truck-gone.jpg` are Gemini edits of it, pasted back over the original through a soft mask, so everything except the sand or the truck stays identical from picture to picture.

**Original picture:** Photorealistic cinematic film still, vertical composition, of an open silica sand quarry in Kutch, Gujarat, at golden hour. A large modern hydraulic crawler excavator with a bright orange body, boom and arm, black steel tracks and a dark steel toothed bucket stands on the left side of the frame, in three-quarter view. Right beside it, on the right side of the frame, a heavy orange six-wheel tipper dump truck is parked and completely still, seen from its rear three-quarter, with its tall open steel dump body partly filled with pale sand. The excavator's boom rises and its arm reaches across to the right, holding the bucket, heaped with pale sand, directly above the open dump body of the truck. In front of the excavator on the ground lies a low heap of loose pale soil that it has been digging from. Behind both machines, softly out of focus, a tall quarry wall shows clear horizontal bands of white, cream, pink, grey and ochre rock. Warm low sunlight from the side, a little fine dust in the air, realistic scuffs and dust on the paint and metal. Both machines are fully in frame and fill the middle of the picture, with quarry wall above and sandy ground below. Natural colour, gentle contrast, shot on a full-frame camera. No people visible, sun glare on the glass of both cabs, no text, no logos, no brand names, no numbers, no number plates, no decals, no signs, no watermarks.

**Empty truck edit:** Edit this exact photo. Change one thing only: the truck's open steel dump body is now completely empty, with no sand in it, so you can see its clean, dusty steel floor and inner walls. Keep everything else exactly the same, pixel for pixel: the same truck in the same place, the same excavator in the same pose, the same bucket, heap of soil, ground, quarry wall, light, colours, framing and focus. No people, no text, no logos, no numbers, no number plates.

**No truck edit:** Edit this exact photo. Change one thing only: remove the orange dump truck completely, as if it has driven away. Where it stood, show the same sandy ground with faint tyre tracks, and behind it the same quarry wall continuing naturally. Keep everything else exactly the same, pixel for pixel: the same excavator in the same pose, the same bucket, heap of soil, ground, quarry wall, light, colours, framing and focus. No people, no vehicles other than the excavator, no text, no logos, no numbers.

## The motion prompts

**Load:** One continuous locked-off shot from a tripod; the camera never moves. The orange dump truck stays parked and completely still the whole time: its wheels, cab and dump body do not move at all. Its dump body begins empty. The excavator's tracks stay planted on the ground. The excavator performs one smooth, realistic loading cycle and ends exactly as it began. Its upper body turns smoothly a quarter turn to the left, carrying the boom, arm and empty bucket down to the heap of pale soil. The toothed bucket digs into the heap and curls, scooping a full, heavy load. The boom lifts it with a little loose soil trickling from the edge, and the upper body turns smoothly back to the right until the bucket is over the truck's dump body. The bucket slowly opens and pours a big load of sand into the truck, where it piles up into a full heap above the sides with a soft puff of dust. The excavator's paint stays the same bright orange at every angle, with no change in colour or brightness as it turns. Realistic weight, slow and powerful hydraulic motion, natural soil physics, warm golden light. Natural machine and soil sound. Do not show any people, text, logos, numbers or markings.

**Leave:** One continuous locked-off shot from a tripod; the camera never moves. The orange dump truck, now fully loaded with its heap of pale sand, pulls away: it rolls forward slowly, gathers speed and drives smoothly to the right and out of the frame, with its wheels turning, its body sitting low under the heavy load and a light trail of dust rising behind it. The excavator stays parked in exactly this pose with its bucket raised and does not move at all. The heap of soil, the ground and the quarry wall stay exactly the same. After the truck has left the frame, only its dust settles. Natural engine and gravel sound. Do not show any people, text, logos, numbers or markings.

**Arrive:** One continuous locked-off shot from a tripod; the camera never moves. An empty orange dump truck of the same model slowly reverses into the frame from the right, rear end first, with its wheels turning and a little dust rising, and brakes smoothly to a stop exactly in the loading spot beside the excavator, where it stays completely still. The excavator stays parked in exactly this pose with its bucket raised and does not move at all. The heap of soil, the ground and the quarry wall stay exactly the same. Natural engine and gravel sound. Do not show any people, text, logos, numbers or markings.

The earlier film of the excavator digging alone is in `review/retired/about-excavator-dig/`.
