The fonts in this folder have been hacked solely for use with Satori, which
generates our OG images. THEY ARE NOT TO BE USED FOR ANY OTHER PURPOSE.

Specifically: the glyphs have been altered, so that some of the alternate
character styles and ligatures appear as the default version of the character
instead. (Example: the uppercase "I" ordinarily does not have the horizontal
bars on top and bottom; these font files have been edited so that the default
does.)

On the site, we simply enable the OpenType features to swap out the character,
via CSS. But with Satori, that's not an option, and so we have to hack apart the
font.

This could potentially cause instability and/or rendering issues if these fonts
were used elsewhere—they may or may not be "valid" font files—which is why we
want to stick with using these files only in Satori, which seems to read them
just fine.
