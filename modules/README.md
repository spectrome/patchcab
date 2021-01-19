# Patchcab modules

A collection of default basic [Patchcab](https://github.com/spectrome/patchcab) Eurorack style modules made with Web Audio, [Tone.js Web Audio framework](https://github.com/Tonejs/Tone.js/) and [Svelte Javascript framework](https://github.com/sveltejs/svelte).

## Install

Install the modules to your Patchcab setup by running:

```bash
npm install @patchcab/modules
```

## Modules

|                                                                                                                                       |  Module   |                                                                                                                                             |
| :-----------------------------------------------------------------------------------------------------------------------------------: | :-------: | ------------------------------------------------------------------------------------------------------------------------------------------- |
|  <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/adsr.png" alt="ADSR" width="48" height="190" />  | **ADSR**  | An [ADSR](<https://en.wikipedia.org/wiki/Envelope_(music)#ADSR>) (Attack, Decay, Sustain, Release) envelope generator.                      |
| <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/clock.png" alt="Clock" width="48" height="190" /> | **Clock** | A simple clock which provides a callback at the given rate.                                                                                 |
|    <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/fm.png" alt="FM" width="48" height="190" />    |  **FM**   | FM module composed of two oscillators where one oscillator modulates the frequency of a second one.                                         |
|   <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/lfo.png" alt="LFO" width="48" height="190" />   |  **LFO**  | A [low frequency oscillator](https://en.wikipedia.org/wiki/Low-frequency_oscillation) module.                                               |
|  <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/midi.png" alt="MIDI" width="48" height="190" />  | **MIDI**  | **work in progress** module 😬 Currently sends only a trigger signal on keyboard letter Q-M key presses.                                    |
| <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/noise.png" alt="NOISE" width="48" height="190" /> | **NOISE** | A [noise generator](https://en.wikipedia.org/wiki/Noise_generator) module that produces pink, white or brown noise types.                   |
| <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/notes.png" alt="Notes" width="96" height="190" /> | **Notes** | Simple utility module to write down your synth usage instructions or other random stuff.                                                    |
|   <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/osc.png" alt="OSC" width="48" height="190" />   |  **OSC**  | Simple [oscillator](https://en.wikipedia.org/wiki/Electronic_oscillator) module producing sine, square, triangle or sawtooth signal.        |
|   <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/out.png" alt="OUT" width="48" height="190" />   |  **OUT**  | Master ouput module connecting your synth output to your computers audio output.                                                            |
| <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/revrb.png" alt="REVRB" width="48" height="190" /> | **REVRB** | Simple reverb effect module. The response generation is asynchronous, so you have to wait until ready resolves before it will make a sound. |
| <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/scope.png" alt="SCOPE" width="96" height="190" /> | **SCOPE** | Utility module to visualize the waveform of the audio input.                                                                                |
|  <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/seq.png" alt="SEQ" width="256" height="190" />   |  **SEQ**  | A simple 16 step gate [sequencer](https://en.wikipedia.org/wiki/Music_sequencer).                                                           |
|   <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/vcf.png" alt="VCF" width="48" height="190" />   |  **VCF**  | A highpass or lowpass filter to cutoff audio input frequency.                                                                               |
|   <img src="https://raw.githubusercontent.com/spectrome/patchcab/main/modules/modules/vol.png" alt="VOL" width="48" height="190" />   |  **VOL**  | Module to adjust the audio signal volume.                                                                                                   |
