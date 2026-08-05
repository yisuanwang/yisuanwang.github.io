Agogic: Performance-Timed Music Tokens for LLM-Native Text-to-Symbolic-Music Generation

Open index.html in a browser. The page is self-contained: all CSS and JavaScript are inline and the
only network requests it makes are the three links in the header (arXiv, GitHub, project page). It
needs no server, no fonts and no internet connection to play.

  index.html   the page
  audio/       67 rendered clips, one General MIDI soundfont, loudness-normalised to -18 LUFS
  midi/        55 MIDI files, the exact generations the page plays and notates

Every clip is a single unedited generation conditioned only on the caption shown next to it, except
where a block is labelled "Real reference" (section 03) or "real performance" (section 05), which are
real music included for comparison and for the model-free tokenizer round trip.

Paper        https://arxiv.org/abs/2608.03999
Code         https://github.com/SparcAI-Inc/Agogic
Project page https://yisuanwang.github.io/Agogic
