# Branch film prompts

The five films on the homepage's first screen were made with Gemini on 21 Nov 2026. They are placeholders until real footage of each business exists.

Each film has two steps: a 2K start picture (`gemini-nano-banana-2.1`, 16:9), then a 6-second 1080p video from that picture (`gemini-omni-1.2-flash`). At Google's prices that is about $0.67 per film.

To remake one, run these from the project folder, using the prompts below:

```bash
~/gemini-image-mcp/.venv/bin/python ~/gemini-image-mcp/server.py image "START PICTURE PROMPT" --aspect 16:9 --size 2K --name kaolin-frame
```

```bash
~/gemini-image-mcp/.venv/bin/python ~/gemini-image-mcp/server.py video "MOTION PROMPT" --aspect 16:9 --seconds 6 --resolution 1080p --start PATH_TO_THE_PICTURE --name kaolin
```

Save the result here as `kaolin.mp4`, then run `tools/branch-films.sh kaolin`.

**Every start picture prompt ends with:** Photorealistic cinematic film still, 16:9, shot on a full-frame camera, natural light, gentle contrast, rich but natural colour. The main subject sits in the right half of the frame, and the left third of the frame stays calm, soft and uncluttered. No people, no text, no logos, no signs, no watermarks.

**Every motion prompt ends with:** The camera stays completely still on a tripod. Smooth, natural, continuous motion in one unbroken shot. Natural quiet ambient sound only. Do not show any people, text, logos or signs.

## Ghanshyam Silica Sand (`silica`)

**Start picture:** A low wide view of an open silica sand quarry in Kutch, Gujarat, at golden hour. On the right of the frame a thin steady stream of fine bright white silica sand pours from a dark steel conveyor chute onto a tall clean cone of white sand. Behind it, softly out of focus, a tall quarry wall shows clear horizontal bands of white, cream, pink, grey and ochre rock. On the left, pale quarry floor and warm haze.

**Motion:** The fine white sand keeps pouring in a steady stream from the chute and softly piles up on the cone, with small grains rolling down its sides and a little fine dust drifting in the warm light.

## Ghanshyam Kaolin (`kaolin`)

**Start picture:** A kaolin clay refinery in Kutch in soft pale morning light. On the right of the frame thick, opaque, milky white clay slurry flows smoothly over a worn stone weir into a wide settling pond. Chalk white clay banks and pale terraces rise behind it in soft focus. The clay water is silky and bright white with gentle ripples. On the left, the calm white surface of the pond fades into light morning mist.

**Motion:** The thick milky white clay slurry keeps flowing smoothly over the stone weir into the pond, with slow soft ripples spreading across the white surface and thin morning mist drifting.

## Ghanshyam Minerals (`minerals`)

**Start picture:** An open mineral sorting yard in Kutch in warm late afternoon sun. On the right of the frame a slow black rubber conveyor belt carries hand-sorted lumps of pale pink feldspar and clear milky white quartz crystal, their broken faces sparkling in low raking sunlight. Behind it, out of focus, tidy heaps of pink and white stone. On the left, a soft warm blurred background of stone and dust in the light.

**Motion:** The black conveyor belt moves slowly and steadily upward, carrying the lumps of pink feldspar and white quartz along with it, while fine dust drifts through the low sunlight.

## Ghanshyam Processors (`processors`)

**Start picture:** Inside a clean modern mineral grinding plant. On the right of the frame stands a huge horizontal steel ball mill with a bolted ring gear, lit by shafts of daylight from high windows. Very fine white powder drifts through the light beams and a thin stream of white powder falls into a steel hopper. Deep blue grey steel, cool shadows and a polished concrete floor. On the left, the plant interior is dim, calm and softly lit.

**Motion:** The huge ball mill turns slowly and steadily on its ring gear, a thin stream of fine white powder falls into the hopper, and light dust drifts through the shafts of daylight.

## Ghanshyam Farm House (`farm`)

**Start picture:** A family farm in Kutch, Gujarat, at sunset. On the right of the frame long straight rows of young date palms, heavy with hanging bunches of yellow kharek dates, run into the distance, with a few pomegranate trees between them and black drip irrigation lines along dry red brown soil. Warm golden backlight glows through the fronds under a clear desert sky with soft haze. On the left, open soil and glowing sky.

**Motion:** A gentle evening breeze moves the palm fronds and the bunches of yellow dates, soft dust and golden light drift between the rows, and the low sun glows steadily behind the trees.
