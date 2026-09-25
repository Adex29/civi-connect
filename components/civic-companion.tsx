"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import {
  Heart,
  Star,
  Leaf,
  RefreshCw,
  Zap,
  Lightbulb,
  GraduationCap,
  Crown,
  Glasses,
  Search,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Rocket,
  RotateCw,
  Music,
  Smile,
  Flame,
  FileText,
  Monitor,
} from "lucide-react";

interface CivicCompanionProps {
  studentName?: string;
  className?: string;
}

type CiviPart = "sprout" | "visor" | "leftHand" | "rightHand" | "core" | "body";

type CiviGesture = "single" | "double" | "multi" | "hold";

type CiviExpression =
  | "normal"
  | "happy"
  | "stars"
  | "hearts"
  | "wink"
  | "cool"
  | "surprised"
  | "focused"
  | "dizzy"
  | "matrix"
  | "sleepy";

export type CiviHat =
  | "none"
  | "grad"
  | "detective"
  | "crown"
  | "goggles"
  | "hardHat"
  | "wizard"
  | "chef"
  | "headphones"
  | "cowboy"
  | "astronaut"
  | "flowerCrown"
  | "cap"
  | "topHat";

export type CiviTrick =
  | "none"
  | "rocket"
  | "juggle"
  | "headspin"
  | "sneeze"
  | "breakdance"
  | "magic";

// BRAWL STARS SPROUT STICKY PAPER FACES
export type CiviStickyFace =
  | "sproutDefault"
  | "derp"
  | "catSmile"
  | "shocked"
  | "angry"
  | "sleepy"
  | "heartEyes"
  | "cool"
  | "crying"
  | "dead"
  | "dizzy"
  | "mustache"
  | "wink"
  | "smug";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  type: "star" | "leaf" | "sparkle" | "heart" | "zap" | "bulb" | "flower" | "confetti" | "paper";
  color: string;
}

export interface HatMeta {
  id: CiviHat;
  name: string;
  icon: string;
  desc: string;
}

export const HATS_COLLECTION: HatMeta[] = [
  { id: "none", name: "Sleek Robot", icon: "✨", desc: "Clean ceramic chassis" },
  { id: "grad", name: "Graduation Cap", icon: "🎓", desc: "Academic excellence & civic leadership" },
  { id: "detective", name: "Detective Sleuth", icon: "🕵️", desc: "Digital evidence investigation" },
  { id: "crown", name: "Civic Crown", icon: "👑", desc: "Exemplary community stewardship" },
  { id: "goggles", name: "Cyber VR Goggles", icon: "🥽", desc: "Next-generation simulation online" },
  { id: "hardHat", name: "Builder Helmet", icon: "👷", desc: "Community planning & public works" },
  { id: "wizard", name: "Sorcerer of Truth", icon: "🧙‍♂️", desc: "Magic of facts, logic & justice" },
  { id: "chef", name: "Master Chef Toque", icon: "🧑‍🍳", desc: "Cooking up fresh civic solutions" },
  { id: "headphones", name: "DJ Headphones", icon: "🎧", desc: "Tuned to student voices" },
  { id: "cowboy", name: "Sheriff Stetson", icon: "🤠", desc: "Protecting community integrity" },
  { id: "astronaut", name: "Space Helmet", icon: "🚀", desc: "Exploring new civic frontiers" },
  { id: "flowerCrown", name: "Blossom Wreath", icon: "🌸", desc: "Environmental care & blooming unity" },
  { id: "cap", name: "Snapback Cap", icon: "🧢", desc: "Streetwise civic action & youth energy" },
  { id: "topHat", name: "Magician Silk Hat", icon: "🎩", desc: "Transforming challenges into triumphs" },
];

export interface TrickMeta {
  id: CiviTrick;
  name: string;
  icon: string;
  desc: string;
}

export const TRICKS_COLLECTION: TrickMeta[] = [
  { id: "rocket", name: "Rocket Blast-Off", icon: "🚀", desc: "Dual thruster flight & hover" },
  { id: "juggle", name: "Orb Juggling", icon: "🤹", desc: "Juggles 3 glowing civic energy orbs" },
  { id: "headspin", name: "360° Head Spin", icon: "🌀", desc: "Cartoon head twist with dizzy stars" },
  { id: "sneeze", name: "Confetti Cannon", icon: "🤧", desc: "Pollen sneeze with massive confetti explosion" },
  { id: "breakdance", name: "Breakdance Spin", icon: "🕺", desc: "Handstand windmill with cool sunglasses" },
  { id: "magic", name: "Magic Star Summon", icon: "🎩", desc: "Conjures a glowing star from the hat" },
];

export interface StickyFaceMeta {
  id: CiviStickyFace;
  name: string;
  ascii: string;
  desc: string;
}

export const STICKY_FACES_COLLECTION: StickyFaceMeta[] = [
  { id: "sproutDefault", name: "Classic Sprout", ascii: "( • ‿ • )", desc: "Iconic Brawl Stars Sprout smile & pink blush" },
  { id: "derp", name: "Goofy Derp", ascii: "( ᐛ 👅 )", desc: "Goofy mismatched eyes and tongue out" },
  { id: "catSmile", name: "Cat Smile :3", ascii: "( ^ ω ^ )", desc: "Cute squinting kitty smile" },
  { id: "shocked", name: "Shocked Gasp", ascii: "( ﾟ O ﾟ )", desc: "Hollow wide eyes & sweat drop" },
  { id: "angry", name: "Fierce Pout", ascii: "( > д < )", desc: "Determined warrior marker eyebrows" },
  { id: "sleepy", name: "Zzz Snoozing", ascii: "( — ‿ — )", desc: "Peaceful nap with floating zzz" },
  { id: "heartEyes", name: "Adoring Hearts", ascii: "( ♥ ‿ ♥ )", desc: "Bold red marker hearts" },
  { id: "cool", name: "Marker Shades", ascii: "( ⌐■_■ )", desc: "Cool marker sunglasses & smirk" },
  { id: "crying", name: "Teary Pout", ascii: "( ╥ ﹏ ╥ )", desc: "Marker teardrop streams" },
  { id: "dead", name: "K.O. Knockout", ascii: "( X _ X )", desc: "Playful defeated cross eyes" },
  { id: "dizzy", name: "Spiral Hypno", ascii: "( @ _ @ )", desc: "Hypnotic marker swirlies" },
  { id: "mustache", name: "Sir Gentleman", ascii: "( • moustache • )", desc: "Dapper handlebar mustache" },
  { id: "wink", name: "Cheeky Wink", ascii: "( ^ ‿ • )", desc: "Playful wink & grin" },
  { id: "smug", name: "Smug Champion", ascii: "( ¬ ‿ ¬ )", desc: "Confident knowing smirk" },
];

// ---------------------------------------------------------------------
// PROCEDURAL WEB AUDIO SYNTHESIZER FOR CIVI (Zero External Assets)
// ---------------------------------------------------------------------
class CiviAudioSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getMuted() {
    return this.isMuted;
  }

  // 1. Playful pop / blip (Single tap)
  playPop(pitchMultiplier = 1) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const startFreq = 440 * pitchMultiplier;
      const endFreq = 780 * pitchMultiplier;

      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }

  // 2. Chime / Bloom (Uplifting arpeggio for double tap / bloom)
  playChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
      });
    } catch {}
  }

  // 3. High-five / Fist bump (Impactful snap + tone)
  playHighFive() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);

      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = "sine";
      snapOsc.frequency.setValueAtTime(1200, ctx.currentTime);
      snapOsc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.06);
      snapGain.gain.setValueAtTime(0.08, ctx.currentTime);
      snapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start();
      snapOsc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  // 4. Matrix / Cyber equalizer (Futuristic cyber sweep)
  playCyber() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [400, 600, 900, 1200, 1600, 2200];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.035);

        gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.035 + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.035);
        osc.stop(ctx.currentTime + idx * 0.035 + 0.09);
      });
    } catch {}
  }

  // 5. Overdrive / Heart Hyper-drive (Resonant rising energy pulse)
  playOverdrive() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {}
  }

  // 6. Supernova Blast (Fanfare + rumble for hold release)
  playSupernova() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = "sine";
      bass.frequency.setValueAtTime(120, ctx.currentTime);
      bass.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.6);
      bassGain.gain.setValueAtTime(0.18, ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);
      bass.start();
      bass.stop(ctx.currentTime + 0.7);

      const chord = [523.25, 783.99, 1046.5, 1318.51];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.09, ctx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65 + idx * 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.04);
        osc.stop(ctx.currentTime + 0.75);
      });
    } catch {}
  }

  // 7. Backflip whoosh
  playWhoosh() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  }

  // 8. Petting / Purr (Cute vibrating coo)
  playPet() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  }

  // 9. Costume snap / pop
  playCostume() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      [680, 1100].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.12);
      });
    } catch {}
  }

  // 10. Multi-tap frenzy / combo
  playCombo(count: number) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const baseFreq = 500 + Math.min(count, 8) * 60;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  // 11. Charging hum step
  playChargeStep(progress: number) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const freq = 200 + (progress / 100) * 600;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {}
  }

  // 12. Rocket Blast-Off Thrusters
  playRocket() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.5);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.4);
    } catch {}
  }

  // 13. Energy Juggling Chimes
  playJuggle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.25);
      });
    } catch {}
  }

  // 14. Confetti Sneeze
  playSneeze() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const inhale = ctx.createOscillator();
      const inGain = ctx.createGain();
      inhale.type = "sine";
      inhale.frequency.setValueAtTime(260, ctx.currentTime);
      inhale.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.35);
      inGain.gain.setValueAtTime(0.04, ctx.currentTime);
      inGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.3);
      inGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
      inhale.connect(inGain);
      inGain.connect(ctx.destination);
      inhale.start();
      inhale.stop(ctx.currentTime + 0.4);

      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const pop = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        pop.type = "triangle";
        pop.frequency.setValueAtTime(650, this.ctx.currentTime);
        pop.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.18);
        popGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
        pop.connect(popGain);
        popGain.connect(this.ctx.destination);
        pop.start();
        pop.stop(this.ctx.currentTime + 0.25);
      }, 420);
    } catch {}
  }

  // 15. Breakdance Funk Beat
  playBreakdance() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      [0, 0.22, 0.44, 0.66].forEach((timeOffset, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i % 2 === 0 ? "sine" : "sawtooth";
        const freq = i % 2 === 0 ? 120 : 340;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + timeOffset + 0.12);
        gain.gain.setValueAtTime(0.14, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.18);
      });
    } catch {}
  }

  // 16. Magic Star Chime
  playMagic() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const freqs = [659.25, 830.61, 987.77, 1318.51, 1661.22];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
      });
    } catch {}
  }

  // 17. Sticky Paper Slap / Rustle Sound (Sprout Brawl Stars style)
  playPaperSlap() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Crisp noise burst for paper flutter/slap
      const bufferSize = Math.floor(ctx.sampleRate * 0.045);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1600, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      // Soft paper thud
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = "sine";
      thud.frequency.setValueAtTime(190, ctx.currentTime);
      thud.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.06);
      thudGain.gain.setValueAtTime(0.14, ctx.currentTime);
      thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      thud.connect(thudGain);
      thudGain.connect(ctx.destination);
      thud.start();
      thud.stop(ctx.currentTime + 0.08);
    } catch {}
  }
}

// Deep randomized dialogue pools for every interaction mode
const DIALOGUE_MATRIX: Record<CiviPart, Record<CiviGesture, string[]>> = {
  sprout: {
    single: [
      "Growing fresh civic ideas together! 🌱",
      "Nurturing our community roots! 🌿",
      "Photosynthesis of student leadership! ☀️",
    ],
    double: [
      "🌸 Flower of Leadership bloomed! Your ideas are in full flower!",
      "A blossoming vision for our community! 🌺",
      "Look at that golden civic bloom! Pure brilliance! 🌼",
    ],
    multi: [
      "🌲 SPROUT FRENZY! We're planting an entire community forest!",
      "Rapid growth detected! Unstoppable civic expansion! 🌿⚡",
    ],
    hold: [
      "☀️ SOLAR CHARGED! Solar civic energy absorbed at 100%! ⚡",
      "Sunbeam power fully focused! Radiating positive change! 🌟",
    ],
  },
  visor: {
    single: [
      "Scanning for community solutions... 100% match! 🔍",
      "Wink! You're looking sharp and mission-ready! 😉",
      "Idea detected: Brilliant civic strategy incoming! 💡",
      "Analyzing digital evidence with precision! 📊",
    ],
    double: [
      "💻 MATRIX MODE: Decoding community evidence at lightspeed!",
      "Cyber-hacker vision engaged: All data streams verified! 🌐⚡",
      "Disco Rave on the visor! Celebrating student innovation! 🪩✨",
    ],
    multi: [
      "🌀 DIZZY MODE! Whoa, everything is spinning in civic harmony!",
      "Whoosh! Spiral eyes activated! So much data! 😵‍💫💫",
    ],
    hold: [
      "🧠 DEEP SCAN COMPLETE: Civic Leadership potential is OVER 9,000! 🌟",
      "Certified Future Community Leader! Your vision is unmatched! 🏆✨",
    ],
  },
  leftHand: {
    single: [
      "High five, Citizen! Teamwork makes the dream work! ✋",
      "Solidarity and collaboration lead the way! 🤝",
    ],
    double: [
      "👊 FIST BUMP OF SOLIDARITY! Power in unity! ⚡",
      "Electric fist bump! Together we can solve anything! ⚡🤝",
    ],
    multi: [
      "👏👏👏 RAPID APPLAUSE! A huge round of applause for you!",
      "Standing ovation for our dedicated student citizen! 🎉👏",
    ],
    hold: [
      "🛡️ CIVIC POWER SHIELD! Standing firm for the public interest!",
      "Holding the line with integrity and evidence! 💪✨",
    ],
  },
  rightHand: {
    single: [
      "Big thumbs up for your dedication! 👍",
      "Waving huge cheers at our future leader! 👋",
    ],
    double: [
      "✌️ VICTORY 'V'! Peace, fairness, and progress for all!",
      "Two thumbs up! You're exceeding every expectation! 🌟👍",
    ],
    multi: [
      "🎉 CELEBRATION WAVE! Sending rainbow cheers across campus! 🌈👋",
      "Citizen of the day right here! Take a bow! 🏆✨",
    ],
    hold: [
      "🚀 CIVIC ROCKETS IGNITED! Blasting off to new milestones!",
      "Full thrusters engaged! Propelling our community forward! 🚀🔥",
    ],
  },
  core: {
    single: [
      "Civic heart beating strong and true! 💖",
      "Leading with warm empathy and sharp evidence! 🧡",
    ],
    double: [
      "⚡ HYPER-DRIVE OVERDRIVE! Core energy running at maximum efficiency!",
      "Civic reactor spinning at 100%! Ready for any community challenge! 🔥",
    ],
    multi: [
      "🌈 RAINBOW PRISM CORE! Radiating hope, inclusion, and justice!",
      "Multi-spectrum energy unlocked! Every perspective matters! 🌟",
    ],
    hold: [
      "💥 SUPERNOVA MEGA BLAST! Unprecedented student empowerment!",
      "BURST OF CIVIC INSPIRATION! Illuminating the path for everyone! 🎆✨",
    ],
  },
  body: {
    single: [
      "Hehehe, that tickles! Ready for community action! 😄",
      "Giggle mode activated! Joy is the engine of service! 🎈",
    ],
    double: [
      "🤸‍♂️ FULL 360° AERIAL BACKFLIP! Flipping civic challenges into wins!",
      "Somersault of triumph! Celebrating democratic excellence! 🏆✨",
    ],
    multi: [
      "🦘 JUMPING BEAN HOP! Bouncing with endless civic enthusiasm!",
      "Hop, skip, and a leap toward community progress! 🌟",
    ],
    hold: [
      "🫧 PROTECTIVE BUBBLE SHIELD! Guarding student rights and community voice!",
      "Sanctuary of learning and collaboration deployed! 🛡️✨",
    ],
  },
};

export function CivicCompanion({ studentName = "Citizen", className = "" }: CivicCompanionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioSynth = useRef<CiviAudioSynth>(new CiviAudioSynth());

  // Interactive facial expression
  const [currentExpression, setCurrentExpression] = useState<CiviExpression>("normal");
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showFlowerBloom, setShowFlowerBloom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Brawl Stars Sprout Sticky Paper Face System
  const [faceStyle, setFaceStyle] = useState<"sticky" | "digital">("sticky");
  const [currentStickyFace, setCurrentStickyFace] = useState<CiviStickyFace>("sproutDefault");
  const [stickySlapAnim, setStickySlapAnim] = useState<boolean>(false);
  const [showFacesDrawer, setShowFacesDrawer] = useState<boolean>(false);

  // Costumes & Wardrobe (14 Hats!)
  const [currentHat, setCurrentHat] = useState<CiviHat>("none");
  const [showWardrobeDrawer, setShowWardrobeDrawer] = useState(false);
  const [showTricksDrawer, setShowTricksDrawer] = useState(false);

  // INDIVIDUAL PART MOTION STATES (Parts actually move!)
  const [sproutMotion, setSproutMotion] = useState<string>("");
  const [leftHandMotion, setLeftHandMotion] = useState<string>("");
  const [rightHandMotion, setRightHandMotion] = useState<string>("");
  const [visorMotion, setVisorMotion] = useState<string>("");
  const [coreMotion, setCoreMotion] = useState<string>("");
  const [bodyMotion, setBodyMotion] = useState<string>("");

  // TRICKS & STUNTS
  const [activeTrick, setActiveTrick] = useState<CiviTrick>("none");
  const [isJuggling, setIsJuggling] = useState<boolean>(false);
  const [isRocketFiring, setIsRocketFiring] = useState<boolean>(false);

  // Smooth LERP Gaze tracking
  const targetGaze = useRef({ x: 0, y: 0 });
  const currentGaze = useRef({ x: 0, y: 0 });
  const [smoothGaze, setSmoothGaze] = useState({ x: 0, y: 0 });

  // Hold & Multi-Click Recognition Trackers
  const [isCharging, setIsCharging] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0);
  const clickTracker = useRef<{ part: CiviPart | ""; count: number; timer: NodeJS.Timeout | null }>({
    part: "",
    count: 0,
    timer: null,
  });
  const holdTracker = useRef<{
    timer: NodeJS.Timeout | null;
    interval: NodeJS.Timeout | null;
    part: CiviPart | "";
    startTime: number;
  }>({
    timer: null,
    interval: null,
    part: "",
    startTime: 0,
  });
  const petTracker = useRef<{ count: number; lastX: number; timer: NodeJS.Timeout | null }>({
    count: 0,
    lastX: 0,
    timer: null,
  });

  // Speech bubble state
  const [speechText, setSpeechText] = useState("Ready to make a real difference today! ✨");
  const [speechFading, setSpeechFading] = useState(false);
  const [cheerCount, setCheerCount] = useState(0);

  const [particles, setParticles] = useState<Particle[]>([]);
  const gradientId = useId().replace(/:/g, "");

  // 60fps Butter-smooth LERP Spring Loop
  useEffect(() => {
    let animFrameId: number;
    const renderLoop = () => {
      const dx = targetGaze.current.x - currentGaze.current.x;
      const dy = targetGaze.current.y - currentGaze.current.y;

      currentGaze.current.x += dx * 0.085;
      currentGaze.current.y += dy * 0.085;

      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        setSmoothGaze({
          x: Number(currentGaze.current.x.toFixed(4)),
          y: Number(currentGaze.current.y.toFixed(4)),
        });
      }
      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  // Natural spontaneous blinking cycle
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const blinkCycle = () => {
      const nextInterval = 3200 + Math.random() * 2600;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          if (Math.random() < 0.25) {
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                blinkCycle();
              }, 130);
            }, 110);
          } else {
            blinkCycle();
          }
        }, 160);
      }, nextInterval);
    };

    blinkCycle();
    return () => clearTimeout(timeoutId);
  }, []);

  // Ambient spontaneous glance / idle motion
  useEffect(() => {
    const idleTimer = setInterval(() => {
      if (!isHovered && currentExpression === "normal" && activeTrick === "none") {
        const rands: CiviExpression[] = ["happy", "wink", "normal"];
        const chosen = rands[Math.floor(Math.random() * rands.length)];
        setCurrentExpression(chosen);
        setTimeout(() => setCurrentExpression("normal"), 1500);
      }
    }, 9500);

    return () => clearInterval(idleTimer);
  }, [isHovered, currentExpression, activeTrick]);

  // Smooth mouse coordinates relative to container & pet detection
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);

    targetGaze.current = {
      x: Math.max(-1, Math.min(1, dx)),
      y: Math.max(-1, Math.min(1, dy)),
    };

    // Petting / Scrubbing detection: moving cursor rapidly back & forth across head
    const diffX = e.clientX - petTracker.current.lastX;
    petTracker.current.lastX = e.clientX;

    if (Math.abs(diffX) > 12 && Math.abs(dy) < 0.4) {
      petTracker.current.count += 1;
      if (petTracker.current.count > 10) {
        petTracker.current.count = 0;
        triggerPettingReaction();
      }
    }

    if (petTracker.current.timer) clearTimeout(petTracker.current.timer);
    petTracker.current.timer = setTimeout(() => {
      petTracker.current.count = 0;
    }, 600);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetGaze.current = { x: 0, y: 0 };
    cancelHold();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Trigger speech with smooth fade
  const updateSpeech = (text: string) => {
    setSpeechFading(true);
    setTimeout(() => {
      setSpeechText(text);
      setSpeechFading(false);
    }, 140);
  };

  // Spawn localized particles from specific part coordinates
  const spawnParticles = (
    originX: number,
    originY: number,
    count: number,
    types: Particle["type"][],
    colors: string[]
  ) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = 26 + Math.random() * 34;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 16,
        size: 13 + Math.random() * 8,
        rot: Math.random() * 360,
        type: types[i % types.length],
        color: colors[i % colors.length],
      });
    }

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 950);
  };

  // Petting Reaction
  const triggerPettingReaction = () => {
    audioSynth.current.playPet();
    if (faceStyle === "sticky") {
      equipStickyFace("heartEyes");
    } else {
      setCurrentExpression("hearts");
    }
    setVisorMotion("animate-part-visor-tilt");
    updateSpeech(`Aww, that tickles! Thank you for the care, ${studentName}! 🥰`);
    spawnParticles(0, -20, 7, ["heart", "sparkle"], ["#F43F5E", "#FB7185", "#FDA4AF"]);
    setTimeout(() => {
      if (faceStyle === "digital") setCurrentExpression("normal");
      setVisorMotion("");
    }, 2000);
  };

  // Slap a new Sprout sticky note face
  const slapNextStickyFace = () => {
    audioSynth.current.playPaperSlap();
    setStickySlapAnim(true);
    setVisorMotion("animate-part-visor-nod");
    const currentIndex = STICKY_FACES_COLLECTION.findIndex((f) => f.id === currentStickyFace);
    const nextIndex = (currentIndex + 1) % STICKY_FACES_COLLECTION.length;
    const nextFace = STICKY_FACES_COLLECTION[nextIndex];
    setCurrentStickyFace(nextFace.id);

    const stickySayings = [
      `New sticky note slapped: ${nextFace.name}! ${nextFace.ascii} 📝`,
      `Sprout Brawl Stars style: ${nextFace.desc}! ✏️`,
      `Hand-drawn marker expression: ${nextFace.ascii} ✨`,
      `Fresh yellow sticky note applied with love! 💛`,
    ];
    updateSpeech(stickySayings[Math.floor(Math.random() * stickySayings.length)]);
    spawnParticles(0, -15, 6, ["sparkle", "star"], ["#FEF08A", "#FDE047", "#10B981"]);

    setTimeout(() => {
      setStickySlapAnim(false);
      setVisorMotion("");
    }, 500);
  };

  const equipStickyFace = (faceId: CiviStickyFace) => {
    audioSynth.current.playPaperSlap();
    setStickySlapAnim(true);
    setVisorMotion("animate-part-visor-nod");
    setCurrentStickyFace(faceId);
    const meta = STICKY_FACES_COLLECTION.find((f) => f.id === faceId);
    if (meta) {
      updateSpeech(`Slapped on ${meta.name} sticky note! ${meta.ascii} 📝`);
    }
    spawnParticles(0, -15, 8, ["sparkle", "star"], ["#FEF08A", "#FDE047", "#38BDF8"]);
    setTimeout(() => {
      setStickySlapAnim(false);
      setVisorMotion("");
    }, 500);
  };

  // -----------------------------------------------------------------
  // GESTURE RECOGNITION (Single, Double, Multi, Hold)
  // -----------------------------------------------------------------
  const handleMouseDownOnPart = (part: CiviPart) => {
    holdTracker.current.startTime = Date.now();
    holdTracker.current.part = part;

    // Start hold timer (> 450ms triggers hold charge)
    holdTracker.current.timer = setTimeout(() => {
      setIsCharging(true);
      setChargeProgress(10);
      audioSynth.current.playChargeStep(10);

      // Charge progression interval
      holdTracker.current.interval = setInterval(() => {
        setChargeProgress((prev) => {
          const next = prev >= 100 ? 100 : prev + 25;
          audioSynth.current.playChargeStep(next);
          return next;
        });
      }, 120);
    }, 450);
  };

  const cancelHold = () => {
    if (holdTracker.current.timer) clearTimeout(holdTracker.current.timer);
    if (holdTracker.current.interval) clearInterval(holdTracker.current.interval);
    holdTracker.current.timer = null;
    holdTracker.current.interval = null;
    setIsCharging(false);
    setChargeProgress(0);
  };

  const handleMouseUpOnPart = (part: CiviPart, e: React.MouseEvent) => {
    e.stopPropagation();
    const holdDuration = Date.now() - holdTracker.current.startTime;
    cancelHold();

    // If held for > 450ms, this is a HOLD gesture!
    if (holdDuration >= 450) {
      executeGesture(part, "hold");
      return;
    }

    // Otherwise, calculate Single, Double, or Multi clicks
    if (clickTracker.current.part === part) {
      clickTracker.current.count += 1;
    } else {
      clickTracker.current.part = part;
      clickTracker.current.count = 1;
    }

    if (clickTracker.current.timer) clearTimeout(clickTracker.current.timer);

    // Multi-tap check (3+ rapid taps triggers immediately)
    if (clickTracker.current.count >= 3) {
      const cnt = clickTracker.current.count;
      clickTracker.current.count = 0;
      executeGesture(part, "multi", cnt);
      return;
    }

    // Wait 280ms to distinguish Single vs Double click
    clickTracker.current.timer = setTimeout(() => {
      if (clickTracker.current.count === 2) {
        executeGesture(part, "double");
      } else if (clickTracker.current.count === 1) {
        executeGesture(part, "single");
      }
      clickTracker.current.count = 0;
      clickTracker.current.timer = null;
    }, 280);
  };

  // -----------------------------------------------------------------
  // EXECUTE GESTURE (Moving the actual SVG parts!)
  // -----------------------------------------------------------------
  const executeGesture = (part: CiviPart, gesture: CiviGesture, count = 1) => {
    setCheerCount((prev) => prev + 1);

    const pool = DIALOGUE_MATRIX[part][gesture];
    const speech = pool[Math.floor(Math.random() * pool.length)];
    updateSpeech(speech);

    switch (part) {
      case "sprout": {
        if (gesture === "single") {
          audioSynth.current.playPop(1.2);
          setSproutMotion("animate-part-sprout-whip");
          if (faceStyle === "sticky") equipStickyFace("sproutDefault");
          else setCurrentExpression("happy");
          spawnParticles(0, -75, 7, ["leaf", "sparkle"], ["#10B981", "#34D399", "#A7F3D0"]);
          setTimeout(() => setSproutMotion(""), 850);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1600);
        } else if (gesture === "double") {
          audioSynth.current.playChime();
          setSproutMotion("animate-part-sprout-stretch");
          setShowFlowerBloom(true);
          if (faceStyle === "sticky") equipStickyFace("catSmile");
          else setCurrentExpression("stars");
          spawnParticles(0, -85, 12, ["flower", "leaf", "sparkle"], ["#F59E0B", "#10B981", "#EC4899", "#FDE047"]);
          setTimeout(() => {
            setShowFlowerBloom(false);
            setSproutMotion("");
          }, 2400);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 2200);
        } else if (gesture === "multi") {
          audioSynth.current.playCombo(count);
          setSproutMotion("animate-part-sprout-hula");
          if (faceStyle === "sticky") equipStickyFace("derp");
          else setCurrentExpression("surprised");
          spawnParticles(0, -75, 16, ["leaf", "sparkle", "flower"], ["#059669", "#10B981", "#34D399", "#FCD34D"]);
          setTimeout(() => setSproutMotion(""), 1200);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1800);
        } else if (gesture === "hold") {
          audioSynth.current.playSupernova();
          setSproutMotion("animate-part-sprout-stretch");
          if (faceStyle === "sticky") equipStickyFace("heartEyes");
          else setCurrentExpression("focused");
          spawnParticles(0, -75, 18, ["zap", "star", "leaf"], ["#F59E0B", "#FDE047", "#10B981", "#FFFFFF"]);
          setTimeout(() => setSproutMotion(""), 1100);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 2000);
        }
        break;
      }

      case "visor": {
        if (faceStyle === "sticky") {
          // In sticky paper mode, clicking the visor slaps on the next Sprout face!
          slapNextStickyFace();
          return;
        }

        if (gesture === "single") {
          audioSynth.current.playPop(1.5);
          setVisorMotion("animate-part-visor-tilt");
          const rands: CiviExpression[] = ["stars", "hearts", "wink", "cool", "focused", "surprised"];
          const available = rands.filter((x) => x !== currentExpression);
          const next = available[Math.floor(Math.random() * available.length)];
          setCurrentExpression(next);
          spawnParticles(0, -15, 6, ["sparkle", "star"], ["#2DD4BF", "#38BDF8", "#F59E0B"]);
          setTimeout(() => setVisorMotion(""), 900);
          setTimeout(() => setCurrentExpression("normal"), 2200);
        } else if (gesture === "double") {
          audioSynth.current.playCyber();
          setVisorMotion("animate-part-visor-nod");
          setCurrentExpression("matrix");
          spawnParticles(0, -15, 12, ["zap", "sparkle"], ["#2DD4BF", "#10B981", "#38BDF8"]);
          setTimeout(() => setVisorMotion(""), 850);
          setTimeout(() => setCurrentExpression("normal"), 2500);
        } else if (gesture === "multi") {
          audioSynth.current.playCombo(count);
          setVisorMotion("animate-part-visor-spin360");
          setCurrentExpression("dizzy");
          spawnParticles(0, -15, 10, ["star", "sparkle"], ["#A855F7", "#EC4899", "#38BDF8"]);
          setTimeout(() => setVisorMotion(""), 1000);
          setTimeout(() => setCurrentExpression("normal"), 2400);
        } else if (gesture === "hold") {
          audioSynth.current.playCyber();
          setTimeout(() => audioSynth.current.playChime(), 350);
          setVisorMotion("animate-part-visor-nod");
          setCurrentExpression("focused");
          spawnParticles(0, -15, 16, ["star", "zap", "bulb"], ["#FDE047", "#38BDF8", "#10B981", "#FFFFFF"]);
          setTimeout(() => setCurrentExpression("stars"), 1200);
          setTimeout(() => {
            setVisorMotion("");
            setCurrentExpression("normal");
          }, 2600);
        }
        break;
      }

      case "leftHand": {
        if (gesture === "single") {
          audioSynth.current.playHighFive();
          setLeftHandMotion("animate-part-left-highfive");
          if (faceStyle === "sticky") equipStickyFace("sproutDefault");
          else setCurrentExpression("happy");
          spawnParticles(-85, 10, 7, ["sparkle", "star"], ["#10B981", "#F59E0B", "#FCD34D"]);
          setTimeout(() => setLeftHandMotion(""), 800);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1500);
        } else if (gesture === "double") {
          audioSynth.current.playHighFive();
          setLeftHandMotion("animate-part-left-fistbump");
          if (faceStyle === "sticky") equipStickyFace("wink");
          else setCurrentExpression("wink");
          spawnParticles(-85, 10, 10, ["zap", "star"], ["#F59E0B", "#FCD34D", "#38BDF8"]);
          setTimeout(() => setLeftHandMotion(""), 750);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1600);
        } else if (gesture === "multi") {
          audioSynth.current.playCombo(count);
          setLeftHandMotion("animate-part-left-clap");
          setRightHandMotion("animate-part-right-clap");
          if (faceStyle === "sticky") equipStickyFace("catSmile");
          else setCurrentExpression("stars");
          spawnParticles(-85, 10, 14, ["sparkle", "star", "heart"], ["#10B981", "#38BDF8", "#EC4899"]);
          setTimeout(() => {
            setLeftHandMotion("");
            setRightHandMotion("");
          }, 1000);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1800);
        } else if (gesture === "hold") {
          audioSynth.current.playOverdrive();
          setLeftHandMotion("animate-part-left-fistbump");
          if (faceStyle === "sticky") equipStickyFace("angry");
          else setCurrentExpression("focused");
          spawnParticles(-85, 10, 14, ["zap", "sparkle"], ["#38BDF8", "#2DD4BF", "#FFFFFF"]);
          setTimeout(() => setLeftHandMotion(""), 1000);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 2000);
        }
        break;
      }

      case "rightHand": {
        if (gesture === "single") {
          audioSynth.current.playPop(1.4);
          setRightHandMotion("animate-part-right-thumbsup");
          if (faceStyle === "sticky") equipStickyFace("sproutDefault");
          else setCurrentExpression("stars");
          spawnParticles(85, 10, 7, ["star", "sparkle"], ["#14B8A6", "#38BDF8", "#F59E0B"]);
          setTimeout(() => setRightHandMotion(""), 800);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1500);
        } else if (gesture === "double") {
          audioSynth.current.playChime();
          setRightHandMotion("animate-part-right-peace");
          if (faceStyle === "sticky") equipStickyFace("catSmile");
          else setCurrentExpression("happy");
          spawnParticles(85, 10, 12, ["star", "heart", "sparkle"], ["#EC4899", "#38BDF8", "#10B981"]);
          setTimeout(() => setRightHandMotion(""), 800);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1600);
        } else if (gesture === "multi") {
          audioSynth.current.playCombo(count);
          setRightHandMotion("animate-part-right-wave");
          if (faceStyle === "sticky") equipStickyFace("derp");
          else setCurrentExpression("stars");
          spawnParticles(85, 10, 15, ["star", "leaf", "sparkle"], ["#F59E0B", "#10B981", "#38BDF8"]);
          setTimeout(() => setRightHandMotion(""), 1000);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1800);
        } else if (gesture === "hold") {
          executeTrick("rocket");
        }
        break;
      }

      case "core": {
        audioSynth.current.playPop(0.9);
        setCoreMotion("animate-part-core-pulse");
        if (gesture === "single") {
          if (faceStyle === "sticky") equipStickyFace("heartEyes");
          else setCurrentExpression("hearts");
          spawnParticles(0, 48, 8, ["heart", "sparkle"], ["#F43F5E", "#F59E0B", "#FDA4AF"]);
          setTimeout(() => setCoreMotion(""), 900);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1800);
        } else if (gesture === "double") {
          audioSynth.current.playOverdrive();
          if (faceStyle === "sticky") equipStickyFace("cool");
          else setCurrentExpression("stars");
          spawnParticles(0, 48, 14, ["zap", "heart", "star"], ["#F59E0B", "#EF4444", "#FDE047"]);
          setTimeout(() => setCoreMotion(""), 900);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 2000);
        } else if (gesture === "multi") {
          audioSynth.current.playCombo(count);
          if (faceStyle === "sticky") equipStickyFace("catSmile");
          else setCurrentExpression("happy");
          spawnParticles(0, 48, 16, ["star", "sparkle", "heart"], ["#EC4899", "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"]);
          setTimeout(() => setCoreMotion(""), 900);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 2200);
        } else if (gesture === "hold") {
          audioSynth.current.playSupernova();
          if (faceStyle === "sticky") equipStickyFace("shocked");
          else setCurrentExpression("stars");
          spawnParticles(0, 48, 22, ["heart", "star", "zap", "leaf"], ["#F59E0B", "#EF4444", "#10B981", "#38BDF8", "#FDE047"]);
          setTimeout(() => setCoreMotion(""), 1200);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 2400);
        }
        break;
      }

      case "body": {
        if (gesture === "single") {
          audioSynth.current.playPop(1.0);
          setBodyMotion("animate-part-body-jelly");
          if (faceStyle === "sticky") equipStickyFace("sproutDefault");
          else setCurrentExpression("happy");
          spawnParticles(0, 0, 8, ["sparkle", "star"], ["#10B981", "#F59E0B", "#38BDF8"]);
          setTimeout(() => setBodyMotion(""), 800);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1600);
        } else if (gesture === "double") {
          audioSynth.current.playWhoosh();
          setBodyMotion("animate-civi-backflip");
          if (faceStyle === "sticky") equipStickyFace("cool");
          else setCurrentExpression("stars");
          spawnParticles(0, 0, 14, ["star", "sparkle", "leaf"], ["#10B981", "#F59E0B", "#EC4899", "#38BDF8"]);
          setTimeout(() => setBodyMotion(""), 900);
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 2000);
        } else if (gesture === "multi") {
          executeTrick("breakdance");
        } else if (gesture === "hold") {
          executeTrick("sneeze");
        }
        break;
      }
    }
  };

  // -----------------------------------------------------------------
  // TRICKS EXECUTION ENGINE (6 Stunts!)
  // -----------------------------------------------------------------
  const executeTrick = (trickId: CiviTrick) => {
    if (trickId === "none") return;
    setActiveTrick(trickId);
    setCheerCount((prev) => prev + 2);

    switch (trickId) {
      case "rocket": {
        setIsRocketFiring(true);
        setBodyMotion("animate-trick-rocket");
        setLeftHandMotion("animate-part-left-fistbump");
        setRightHandMotion("animate-part-right-thumbsup");
        if (faceStyle === "sticky") equipStickyFace("shocked");
        else setCurrentExpression("surprised");
        audioSynth.current.playRocket();
        updateSpeech("3... 2... 1... CIVI ROCKET BLAST-OFF! 🚀🔥");
        spawnParticles(0, 30, 18, ["zap", "star"], ["#EF4444", "#F59E0B", "#FDE047"]);

        setTimeout(() => {
          setIsRocketFiring(false);
          setBodyMotion("");
          setLeftHandMotion("");
          setRightHandMotion("");
          setActiveTrick("none");
          if (faceStyle === "sticky") equipStickyFace("sproutDefault");
          else setCurrentExpression("happy");
        }, 1600);
        break;
      }

      case "juggle": {
        setIsJuggling(true);
        if (faceStyle === "sticky") equipStickyFace("catSmile");
        else setCurrentExpression("stars");
        setLeftHandMotion("animate-part-left-wave");
        setRightHandMotion("animate-part-right-wave");
        audioSynth.current.playJuggle();
        updateSpeech("Juggling community priorities with precision balance! 🤹✨");

        setTimeout(() => {
          setIsJuggling(false);
          setLeftHandMotion("");
          setRightHandMotion("");
          setActiveTrick("none");
          if (faceStyle === "sticky") equipStickyFace("sproutDefault");
          else setCurrentExpression("happy");
          updateSpeech("Catch! Community harmony achieved! 🎉");
        }, 3200);
        break;
      }

      case "headspin": {
        setVisorMotion("animate-part-visor-spin360");
        audioSynth.current.playCyber();
        updateSpeech("Whoaaaa! 360° Civic Data Spin! A little dizzy! 🌀😵‍💫");

        setTimeout(() => {
          if (faceStyle === "sticky") equipStickyFace("dizzy");
          else setCurrentExpression("dizzy");
          spawnParticles(0, -30, 8, ["star", "sparkle"], ["#F59E0B", "#A855F7", "#38BDF8"]);
        }, 600);

        setTimeout(() => {
          setVisorMotion("");
          setActiveTrick("none");
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1500);
        }, 1200);
        break;
      }

      case "sneeze": {
        setBodyMotion("animate-trick-sneeze");
        setSproutMotion("animate-part-sprout-whip");
        if (faceStyle === "sticky") equipStickyFace("shocked");
        else setCurrentExpression("wink");
        audioSynth.current.playSneeze();
        updateSpeech("Ah... Ah... ACHOOOO! 🤧🎉");

        setTimeout(() => {
          spawnParticles(0, -10, 24, ["confetti", "star", "flower", "heart"], [
            "#EF4444",
            "#F59E0B",
            "#10B981",
            "#3B82F6",
            "#EC4899",
            "#FDE047",
          ]);
          if (faceStyle === "sticky") equipStickyFace("derp");
          else setCurrentExpression("surprised");
        }, 420);

        setTimeout(() => {
          setBodyMotion("");
          setSproutMotion("");
          setActiveTrick("none");
          if (faceStyle === "sticky") equipStickyFace("sproutDefault");
          else setCurrentExpression("happy");
          updateSpeech("Phew! Excuse my civic pollen burst! 🌸✨");
        }, 1400);
        break;
      }

      case "breakdance": {
        setBodyMotion("animate-trick-breakdance");
        audioSynth.current.playBreakdance();
        if (faceStyle === "sticky") equipStickyFace("cool");
        else setCurrentExpression("cool");
        setRightHandMotion("animate-part-right-thumbsup");
        updateSpeech("Drop the community beat! Windmill freeze pose! 🕺🕶️");
        spawnParticles(0, 20, 14, ["sparkle", "star"], ["#06B6D4", "#EC4899", "#F59E0B"]);

        setTimeout(() => {
          setBodyMotion("");
          setRightHandMotion("");
          setActiveTrick("none");
          setTimeout(() => {
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1600);
        }, 1400);
        break;
      }

      case "magic": {
        setRightHandMotion("animate-part-right-point");
        audioSynth.current.playMagic();
        if (faceStyle === "sticky") equipStickyFace("catSmile");
        else setCurrentExpression("stars");
        updateSpeech("Presto! Conjuring community solutions from the hat! 🎩✨");
        spawnParticles(0, -40, 16, ["star", "sparkle"], ["#FDE047", "#F59E0B", "#FFFFFF"]);

        setTimeout(() => {
          setCoreMotion("animate-part-core-pulse");
          setRightHandMotion("");
          setActiveTrick("none");
          setTimeout(() => {
            setCoreMotion("");
            if (faceStyle === "digital") setCurrentExpression("normal");
          }, 1200);
        }, 1200);
        break;
      }
    }
  };

  // Equip a specific hat from wardrobe
  const equipHat = (hatId: CiviHat) => {
    setCurrentHat(hatId);
    audioSynth.current.playCostume();
    if (faceStyle === "digital") setCurrentExpression("happy");
    setVisorMotion("animate-part-visor-nod");
    spawnParticles(0, -50, 10, ["sparkle", "star"], ["#F59E0B", "#10B981", "#38BDF8"]);

    const meta = HATS_COLLECTION.find((h) => h.id === hatId);
    if (meta) {
      updateSpeech(`${meta.icon} Equipped ${meta.name}! ${meta.desc}!`);
    }

    setTimeout(() => {
      setVisorMotion("");
      if (faceStyle === "digital") setCurrentExpression("normal");
    }, 1800);
  };

  // Cycle to next / prev hat
  const cycleHatDirection = (delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentIndex = HATS_COLLECTION.findIndex((h) => h.id === currentHat);
    const nextIndex = (currentIndex + delta + HATS_COLLECTION.length) % HATS_COLLECTION.length;
    equipHat(HATS_COLLECTION[nextIndex].id);
  };

  // Cycle to next / prev sticky face (Brawl Stars Sprout)
  const cycleStickyFaceDirection = (delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFaceStyle("sticky");
    audioSynth.current.playPaperSlap();
    setStickySlapAnim(true);
    setVisorMotion("animate-part-visor-nod");
    const currentIndex = STICKY_FACES_COLLECTION.findIndex((f) => f.id === currentStickyFace);
    const nextIndex = (currentIndex + delta + STICKY_FACES_COLLECTION.length) % STICKY_FACES_COLLECTION.length;
    const nextFace = STICKY_FACES_COLLECTION[nextIndex];
    setCurrentStickyFace(nextFace.id);
    updateSpeech(`Slapped on ${nextFace.name}! ${nextFace.ascii} 📝`);
    spawnParticles(0, -15, 6, ["sparkle", "star"], ["#FEF08A", "#FDE047", "#10B981"]);
    setTimeout(() => {
      setStickySlapAnim(false);
      setVisorMotion("");
    }, 500);
  };

  // Parallax Depth Coordinates
  const bodyTiltDeg = smoothGaze.x * 4.5;
  const visorOffsetX = smoothGaze.x * 6.5;
  const visorOffsetY = smoothGaze.y * 4.2;
  const crownTiltDeg = -smoothGaze.x * 3.5;

  const currentHatMeta = HATS_COLLECTION.find((h) => h.id === currentHat) || HATS_COLLECTION[0];
  const currentStickyMeta = STICKY_FACES_COLLECTION.find((f) => f.id === currentStickyFace) || STICKY_FACES_COLLECTION[0];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`civi-svg-root relative flex flex-col items-center justify-between select-none outline-none w-full max-w-[340px] h-[415px] mx-auto rounded-3xl border border-primary/15 bg-card/60 p-3 shadow-sm backdrop-blur-xs transition-colors duration-300 ${className}`}
      style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
      aria-label="Civi: Your interactive civic companion"
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Motivational & Reactive Speech Bubble (Rigid Fixed Height) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 h-13 w-full max-w-[315px] shrink-0 flex items-center justify-center">
        <div
          className="relative w-full h-full rounded-2xl border border-primary/25 bg-card/95 px-3.5 py-1.5 shadow-md backdrop-blur-md dark:border-primary/30 dark:bg-card/90 flex items-center justify-between cursor-pointer select-none transition-all hover:scale-[1.02] active:scale-95"
          onClick={() => {
            if (faceStyle === "sticky") slapNextStickyFace();
            else executeGesture("visor", "single");
          }}
          title="Tap to cycle affirmations & faces!"
          style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              {faceStyle === "sticky" ? (
                <span className="text-xs">📝</span>
              ) : currentExpression === "hearts" ? (
                <Heart className="size-3 text-rose-500 animate-pulse fill-current" />
              ) : currentExpression === "stars" ? (
                <Star className="size-3 text-amber-500 fill-current animate-spin" style={{ animationDuration: "3s" }} />
              ) : isCharging ? (
                <Zap className="size-3 text-amber-500 animate-bounce fill-current" />
              ) : (
                <Star className="size-3 text-secondary animate-pulse" />
              )}
            </span>
            <p
              className={`text-xs font-semibold leading-tight text-foreground line-clamp-2 min-w-0 transition-opacity duration-150 ${
                speechFading ? "opacity-0" : "opacity-100"
              }`}
            >
              {isCharging ? `Charging Civic Power... ${chargeProgress}% ⚡` : speechText}
            </p>
          </div>
          <RefreshCw className="size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-300 hover:rotate-180 hover:text-primary ml-1.5" />

          {/* Speech Bubble Arrow Pointer */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-3 rotate-45 border-b border-r border-primary/20 bg-card dark:border-primary/30" />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Interactive Mascot Graphic Container (Fixed 250px Viewport) */}
      {/* ------------------------------------------------------------- */}
      <div className="group relative flex h-[250px] w-full items-center justify-center shrink-0">
        {/* Ambient Halo Radiance */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute size-52 rounded-full bg-gradient-to-tr from-primary/25 via-emerald-400/20 to-secondary/20 blur-2xl transition-all duration-700 ease-out ${
            isCharging
              ? "scale-145 opacity-100 ring-4 ring-amber-400/40"
              : isHovered
              ? "scale-115 opacity-85"
              : "scale-100 opacity-55"
          }`}
        />

        {/* Dynamic Flying Celebration Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="pointer-events-none absolute z-40 transition-all"
            style={{
              transform: `translate(${p.x + p.vx}px, ${p.y + p.vy}px) rotate(${p.rot}deg)`,
              opacity: 1,
              transitionDuration: "850ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {p.type === "star" && <Star className="size-4.5 fill-current drop-shadow-sm" style={{ color: p.color }} />}
            {p.type === "leaf" && <Leaf className="size-4.5 fill-current drop-shadow-sm" style={{ color: p.color }} />}
            {p.type === "heart" && <Heart className="size-4.5 fill-current drop-shadow-sm" style={{ color: p.color }} />}
            {p.type === "sparkle" && <Star className="size-4.5 drop-shadow-sm" style={{ color: p.color }} />}
            {p.type === "zap" && <Zap className="size-4.5 fill-current drop-shadow-sm" style={{ color: p.color }} />}
            {p.type === "bulb" && <Lightbulb className="size-4.5 drop-shadow-sm" style={{ color: p.color }} />}
            {p.type === "flower" && <Star className="size-5 text-amber-400 drop-shadow-sm" />}
            {p.type === "confetti" && (
              <div
                className="size-3 rounded-xs shadow-xs"
                style={{ backgroundColor: p.color, transform: `rotate(${p.rot}deg)` }}
              />
            )}
          </div>
        ))}

        {/* Main Floating Figure */}
        <div
          style={{
            transform: isHovered && !bodyMotion ? `translateY(-6px) scale(1.02) rotate(${bodyTiltDeg}deg)` : undefined,
            transition: bodyMotion ? undefined : "transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          className={`relative z-10 ${
            bodyMotion ? bodyMotion : !isHovered ? "animate-civi-levitate" : ""
          }`}
        >
          <svg
            width="230"
            height="230"
            viewBox="0 0 230 230"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="civi-svg-root overflow-visible filter drop-shadow-xl outline-none select-none"
            style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
          >
            <defs>
              {/* Chassis Pearlescent Shading */}
              <linearGradient id={`chassis-${gradientId}`} x1="35" y1="25" x2="195" y2="205" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#F0FDF9" />
                <stop offset="85%" stopColor="#D1FAE5" />
                <stop offset="100%" stopColor="#A7F3D0" />
              </linearGradient>

              {/* Inner 3D Shading */}
              <linearGradient id={`chassisShadow-${gradientId}`} x1="115" y1="40" x2="115" y2="185" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#0F766E" stopOpacity="0" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.25" />
              </linearGradient>

              {/* Visor Glass Gradient */}
              <linearGradient id={`visor-${gradientId}`} x1="55" y1="65" x2="175" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#022C22" />
                <stop offset="60%" stopColor="#042F2E" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              {/* Sticky Note Gradient (Brawl Stars Sprout Yellow Paper) */}
              <linearGradient id={`stickyNote-${gradientId}`} x1="82" y1="75" x2="148" y2="129" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="50%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#FDE047" />
              </linearGradient>

              {/* Glowing Digital Eye Gradient */}
              <linearGradient id={`eyeGlow-${gradientId}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>

              {/* Civic Gem Heart Core Gradient */}
              <linearGradient id={`gem-${gradientId}`} x1="95" y1="145" x2="135" y2="185" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Sprout Leaf Gradient */}
              <linearGradient id={`sprout-${gradientId}`} x1="105" y1="10" x2="125" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Hand Pod Gradient */}
              <linearGradient id={`hand-${gradientId}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#A7F3D0" />
              </linearGradient>

              {/* Ear Pod Metallic Gradient */}
              <linearGradient id={`earPod-${gradientId}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#115E59" />
                <stop offset="100%" stopColor="#042F2E" />
              </linearGradient>

              {/* Visor Glass Curved Specular Arc */}
              <linearGradient id={`visorGlass-${gradientId}`} x1="65" y1="70" x2="165" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id={`neonGlow-${gradientId}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ------------------------------------------------------------- */}
            {/* AMBIENT PARTICLES                                             */}
            {/* ------------------------------------------------------------- */}
            <g className="animate-pulse pointer-events-none">
              <circle cx="26" cy="46" r="3.5" fill="#10B981" opacity="0.85" />
              <circle cx="204" cy="58" r="3" fill="#F59E0B" opacity="0.9" />
              <circle cx="198" cy="172" r="2.5" fill="#14B8A6" opacity="0.75" />
            </g>

            {/* ------------------------------------------------------------- */}
            {/* INTERACTIVE PART 1: LEFT HAND (High Five / Fist Bump / Clap)  */}
            {/* ------------------------------------------------------------- */}
            <g
              id="civi-left-hand"
              onMouseDown={() => handleMouseDownOnPart("leftHand")}
              onMouseUp={(e) => handleMouseUpOnPart("leftHand", e)}
              className={`cursor-pointer group/hand origin-[28px_122px] outline-none select-none ${leftHandMotion}`}
              style={{
                outline: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              aria-label="Civi Left Hand"
            >
              <title>Single (High-Five!), Double (Fist-Bump!), or Multi (Clap!) ✋</title>
              {/* Hand shadow */}
              <ellipse cx="28" cy="125" rx="14" ry="17" fill="#042F2E" opacity="0.15" />
              {/* Hand pod */}
              <ellipse
                cx="28"
                cy="122"
                rx="15"
                ry="17"
                fill={`url(#hand-${gradientId})`}
                stroke="#0F766E"
                strokeWidth="2.5"
                className="transition-all group-hover/hand:stroke-primary group-hover/hand:filter group-hover/hand:drop-shadow"
              />
              <ellipse cx="25" cy="117" rx="6.5" ry="7.5" fill="#FFFFFF" opacity="0.85" />
              {/* Glowing palm node */}
              <circle cx="30" cy="124" r="3.5" fill="#10B981" filter={`url(#neonGlow-${gradientId})`} />
              <circle cx="30" cy="124" r="2" fill="#FFFFFF" />
            </g>

            {/* ------------------------------------------------------------- */}
            {/* INTERACTIVE PART 2: RIGHT HAND (Thumbs Up / Peace / Wave)     */}
            {/* ------------------------------------------------------------- */}
            <g
              id="civi-right-hand"
              onMouseDown={() => handleMouseDownOnPart("rightHand")}
              onMouseUp={(e) => handleMouseUpOnPart("rightHand", e)}
              className={`cursor-pointer group/rhand origin-[202px_122px] outline-none select-none ${
                rightHandMotion
                  ? rightHandMotion
                  : isHovered
                  ? "animate-civi-wave"
                  : ""
              }`}
              style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
              aria-label="Civi Right Hand"
            >
              <title>Single (Thumbs-Up!), Double (Peace!), or Wave! 👍</title>
              {/* Hand shadow */}
              <ellipse cx="202" cy="125" rx="14" ry="17" fill="#042F2E" opacity="0.15" />
              {/* Hand pod */}
              <ellipse
                cx="202"
                cy="122"
                rx="15"
                ry="17"
                fill={`url(#hand-${gradientId})`}
                stroke="#0F766E"
                strokeWidth="2.5"
                className="transition-all group-hover/rhand:stroke-secondary group-hover/rhand:filter group-hover/rhand:drop-shadow"
              />
              <ellipse cx="199" cy="117" rx="6.5" ry="7.5" fill="#FFFFFF" opacity="0.85" />
              {/* Glowing palm node */}
              <circle cx="200" cy="124" r="3.5" fill="#F59E0B" filter={`url(#neonGlow-${gradientId})`} />
              <circle cx="200" cy="124" r="2" fill="#FFFFFF" />
            </g>

            {/* ------------------------------------------------------------- */}
            {/* INTERACTIVE PART 3: SPROUT ANTENNA (Spring, Stretch, Hula)    */}
            {/* ------------------------------------------------------------- */}
            <g
              id="civi-sprout"
              onMouseDown={() => handleMouseDownOnPart("sprout")}
              onMouseUp={(e) => handleMouseUpOnPart("sprout", e)}
              transform={sproutMotion ? undefined : `rotate(${crownTiltDeg} 115 45)`}
              className={`cursor-pointer group/sprout origin-[115px_46px] outline-none select-none ${sproutMotion}`}
              style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
              aria-label="Civic Sprout"
            >
              <title>Single (Spring Whip!), Double (Stretch & Bloom!), or Hula! 🌱</title>
              {/* Stalk */}
              <path
                d="M115 46 C115 32, 112 24, 115 17"
                stroke="#059669"
                strokeWidth="4.5"
                strokeLinecap="round"
                className="group-hover/sprout:stroke-emerald-400 transition-colors"
              />
              {/* Left Leaf */}
              <path
                d="M115 27 C99 24, 95 13, 103 11 C112 9, 114 20, 115 27 Z"
                fill={`url(#sprout-${gradientId})`}
                stroke="#047857"
                strokeWidth="1.5"
              />
              {/* Right Leaf */}
              <path
                d="M115 22 C131 20, 135 9, 127 7 C118 5, 116 16, 115 22 Z"
                fill={`url(#sprout-${gradientId})`}
                stroke="#047857"
                strokeWidth="1.5"
              />
              {/* Glowing Civic Beacon Star Tip */}
              <circle
                cx="115"
                cy="15"
                r="5.5"
                fill="#F59E0B"
                filter={`url(#neonGlow-${gradientId})`}
                className="animate-ping opacity-75 origin-[115px_15px]"
              />
              <circle cx="115" cy="15" r="4.5" fill="#FDE047" />
              <circle cx="114" cy="13.5" r="1.5" fill="#FFFFFF" />

              {/* SPECIAL FLOWER BLOOM (Triggered by Double Tap) */}
              {showFlowerBloom && (
                <g transform="translate(115, 15)" className="animate-civi-bloom origin-[0_0]">
                  <circle cx="0" cy="0" r="6" fill="#F59E0B" />
                  <ellipse cx="0" cy="-9" rx="3.5" ry="5" fill="#FDE047" />
                  <ellipse cx="9" cy="0" rx="5" ry="3.5" fill="#FDE047" />
                  <ellipse cx="0" cy="9" rx="3.5" ry="5" fill="#FDE047" />
                  <ellipse cx="-9" cy="0" rx="5" ry="3.5" fill="#FDE047" />
                  <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* ------------------------------------------------------------- */}
            {/* INTERACTIVE PART 4: MAIN CHASSIS / BELLY (Jelly & Somersault) */}
            {/* ------------------------------------------------------------- */}
            <g
              id="civi-body"
              onMouseDown={() => handleMouseDownOnPart("body")}
              onMouseUp={(e) => handleMouseUpOnPart("body", e)}
              className="cursor-pointer group/chassis origin-[115px_115px] outline-none select-none"
              style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
              aria-label="Civi Body"
            >
              <title>Single (Jelly Bounce!), Double (Aerial Backflip!), or Hold Body! 😄</title>
              {/* Primary Body Shell */}
              <rect
                x="48"
                y="42"
                width="134"
                height="146"
                rx="67"
                fill={`url(#chassis-${gradientId})`}
                stroke="#0F766E"
                strokeWidth="3.5"
                className="group-hover/chassis:stroke-primary transition-colors"
              />

              {/* Shading Layer for 3D Volume */}
              <rect
                x="48"
                y="42"
                width="134"
                height="146"
                rx="67"
                fill={`url(#chassisShadow-${gradientId})`}
              />

              {/* Side Headphone / Ear Pods */}
              <g>
                <rect x="38" y="98" width="12" height="38" rx="6" fill={`url(#earPod-${gradientId})`} stroke="#0D9488" strokeWidth="2" />
                <circle cx="44" cy="117" r="3.5" fill="#2DD4BF" />
                <rect x="180" y="98" width="12" height="38" rx="6" fill={`url(#earPod-${gradientId})`} stroke="#0D9488" strokeWidth="2" />
                <circle cx="186" cy="117" r="3.5" fill="#2DD4BF" />
              </g>

              {/* Top Specular Rim Glaze */}
              <path
                d="M66 64 C82 50, 148 50, 164 64"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.95"
              />
            </g>

            {/* ------------------------------------------------------------- */}
            {/* INTERACTIVE PART 5: VISOR & SPARKLY BRAWL STARS STICKY FACE   */}
            {/* ------------------------------------------------------------- */}
            <g
              id="civi-visor"
              onMouseDown={() => handleMouseDownOnPart("visor")}
              onMouseUp={(e) => handleMouseUpOnPart("visor", e)}
              transform={visorMotion ? undefined : `translate(${visorOffsetX}, ${visorOffsetY})`}
              className={`cursor-pointer group/visor origin-[115px_102px] outline-none select-none ${visorMotion}`}
              style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
              aria-label="Civi Visor & Sticky Face"
            >
              <title>Tap to slap a new Sprout Sticky Face doodle! 📝</title>
              {/* Visor Socket Frame */}
              <rect
                x="58"
                y="68"
                width="114"
                height="68"
                rx="32"
                fill="#011F1C"
                stroke="#0D9488"
                strokeWidth="2.5"
                className="group-hover/visor:stroke-secondary transition-colors"
              />

              {/* Deep OLED Glass */}
              <rect
                x="60"
                y="70"
                width="110"
                height="64"
                rx="30"
                fill={`url(#visor-${gradientId})`}
              />

              {/* Visor Reflection Arc */}
              <path
                d="M68 76 C90 71, 140 71, 162 76"
                stroke={`url(#visorGlass-${gradientId})`}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Sub-Pixel Digital Scanline Grid */}
              <line x1="64" y1="84" x2="166" y2="84" stroke="#0D9488" strokeWidth="0.5" opacity="0.2" />
              <line x1="64" y1="94" x2="166" y2="94" stroke="#0D9488" strokeWidth="0.5" opacity="0.2" />
              <line x1="64" y1="104" x2="166" y2="104" stroke="#0D9488" strokeWidth="0.5" opacity="0.2" />
              <line x1="64" y1="114" x2="166" y2="114" stroke="#0D9488" strokeWidth="0.5" opacity="0.2" />

              {/* --------------------------------------------------------- */}
              {/* MODE A: BRAWL STARS SPROUT STICKY PAPER FACE              */}
              {/* --------------------------------------------------------- */}
              {faceStyle === "sticky" ? (
                <g
                  className={`${stickySlapAnim ? "animate-sticky-slap" : ""}`}
                  transform="translate(0, 0)"
                >
                  {/* Soft Paper Shadow */}
                  <rect
                    x="82"
                    y="75"
                    width="66"
                    height="54"
                    rx="3.5"
                    fill="#000000"
                    opacity="0.35"
                    transform="rotate(-2 115 102) translate(1, 2)"
                  />

                  {/* Yellow Sticky Note Body */}
                  <rect
                    x="82"
                    y="75"
                    width="66"
                    height="54"
                    rx="3.5"
                    fill={`url(#stickyNote-${gradientId})`}
                    stroke="#CA8A04"
                    strokeWidth="1.2"
                    transform="rotate(-2 115 102)"
                  />

                  {/* Folded Curled Corner Bottom Right */}
                  <path
                    d="M141 127 L148 127 L148 120 Z"
                    fill="#EAB308"
                    opacity="0.75"
                    transform="rotate(-2 115 102)"
                  />

                  {/* Translucent Scotch Tape on Top holding the note */}
                  <rect
                    x="101"
                    y="71"
                    width="28"
                    height="9"
                    rx="1.5"
                    fill="#FFFFFF"
                    opacity="0.65"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    transform="rotate(-1 115 75)"
                  />

                  {/* Hand-Drawn Marker Doodle Expressions */}
                  <g transform="rotate(-2 115 102)">
                    {currentStickyFace === "sproutDefault" && (
                      /* Classic Sprout from Brawl Stars! */
                      <>
                        <circle cx="104" cy="97" r="4.5" fill="#0F172A" />
                        <circle cx="126" cy="97" r="4.5" fill="#0F172A" />
                        <path d="M110 107 Q115 112 120 107" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <line x1="97" y1="103" x2="101" y2="106" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" />
                        <line x1="129" y1="103" x2="133" y2="106" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" />
                      </>
                    )}

                    {currentStickyFace === "derp" && (
                      <>
                        <circle cx="103" cy="95" r="5" fill="#0F172A" />
                        <circle cx="127" cy="101" r="3.8" fill="#0F172A" />
                        <path d="M109 108 Q115 115 121 108" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <path d="M115 111 C113 118, 119 118, 117 111 Z" fill="#F43F5E" stroke="#0F172A" strokeWidth="1.2" />
                      </>
                    )}

                    {currentStickyFace === "catSmile" && (
                      <>
                        <path d="M99 99 Q104 93 109 99" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                        <path d="M121 99 Q126 93 131 99" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                        <path d="M109 107 Q112 112 115 107 Q118 112 121 107" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                      </>
                    )}

                    {currentStickyFace === "shocked" && (
                      <>
                        <circle cx="104" cy="97" r="6.5" stroke="#0F172A" strokeWidth="2.8" fill="none" />
                        <circle cx="126" cy="97" r="6.5" stroke="#0F172A" strokeWidth="2.8" fill="none" />
                        <ellipse cx="115" cy="111" rx="3.5" ry="5.5" fill="#0F172A" />
                        <path d="M95 90 Q92 94 95 97 Q99 94 95 90 Z" fill="#38BDF8" />
                      </>
                    )}

                    {currentStickyFace === "angry" && (
                      <>
                        <line x1="98" y1="92" x2="108" y2="97" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="132" y1="92" x2="122" y2="97" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
                        <circle cx="105" cy="100" r="3.5" fill="#0F172A" />
                        <circle cx="125" cy="100" r="3.5" fill="#0F172A" />
                        <path d="M110 112 Q115 107 120 112" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                      </>
                    )}

                    {currentStickyFace === "sleepy" && (
                      <>
                        <path d="M98 99 Q104 102 110 99" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <path d="M120 99 Q126 102 132 99" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <line x1="113" y1="111" x2="117" y2="111" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                        <text x="134" y="87" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="sans-serif">z</text>
                        <text x="138" y="81" fill="#64748B" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Z</text>
                      </>
                    )}

                    {currentStickyFace === "heartEyes" && (
                      <>
                        <path d="M104 101 C104 101, 98 96, 98 93 C98 91, 100 89.5, 102 89.5 C103.5 89.5, 104 90.5, 104 90.5 C104 90.5, 104.5 89.5, 106 89.5 C108 89.5, 110 91, 110 93 C110 96, 104 101, 104 101 Z" fill="#EF4444" />
                        <path d="M126 101 C126 101, 120 96, 120 93 C120 91, 122 89.5, 124 89.5 C125.5 89.5, 126 90.5, 126 90.5 C126 90.5, 126.5 89.5, 128 89.5 C130 89.5, 132 91, 132 93 C132 96, 126 101, 126 101 Z" fill="#EF4444" />
                        <path d="M109 108 Q115 115 121 108" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                      </>
                    )}

                    {currentStickyFace === "cool" && (
                      <>
                        <rect x="96" y="93" width="16" height="10" rx="2" fill="#0F172A" />
                        <rect x="118" y="93" width="16" height="10" rx="2" fill="#0F172A" />
                        <line x1="112" y1="97" x2="118" y2="97" stroke="#0F172A" strokeWidth="2.5" />
                        <line x1="99" y1="96" x2="108" y2="96" stroke="#FFFFFF" strokeWidth="1.5" />
                        <path d="M111 111 Q116 115 121 109" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      </>
                    )}

                    {currentStickyFace === "crying" && (
                      <>
                        <path d="M98 101 Q104 96 110 101" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <path d="M120 101 Q126 96 132 101" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <path d="M103 104 Q101 112 104 116" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M127 104 Q129 112 126 116" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        <path d="M110 113 Q112 110 115 112 Q118 110 120 113" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                      </>
                    )}

                    {currentStickyFace === "dead" && (
                      <>
                        <line x1="100" y1="94" x2="108" y2="102" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                        <line x1="108" y1="94" x2="100" y2="102" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                        <line x1="122" y1="94" x2="130" y2="102" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                        <line x1="130" y1="94" x2="122" y2="102" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
                        <line x1="110" y1="111" x2="120" y2="111" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                      </>
                    )}

                    {currentStickyFace === "dizzy" && (
                      <>
                        <circle cx="104" cy="98" r="6" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />
                        <circle cx="104" cy="98" r="2.5" fill="#0F172A" />
                        <circle cx="126" cy="98" r="6" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />
                        <circle cx="126" cy="98" r="2.5" fill="#0F172A" />
                        <path d="M110 112 Q113 116 116 112 Q119 116 121 112" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      </>
                    )}

                    {currentStickyFace === "mustache" && (
                      <>
                        <circle cx="104" cy="96" r="4.2" fill="#0F172A" />
                        <circle cx="126" cy="96" r="4.2" fill="#0F172A" />
                        <path d="M115 106 Q111 103 105 106 Q102 108 105 109 Q111 109 115 107 Q119 109 125 109 Q128 108 125 106 Q119 103 115 106 Z" fill="#0F172A" />
                      </>
                    )}

                    {currentStickyFace === "wink" && (
                      <>
                        <path d="M98 99 Q104 93 110 99" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                        <circle cx="126" cy="97" r="4.5" fill="#0F172A" />
                        <path d="M110 107 Q116 113 121 106" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                      </>
                    )}

                    {currentStickyFace === "smug" && (
                      <>
                        <path d="M98 96 L109 96" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
                        <circle cx="104" cy="98" r="2.5" fill="#0F172A" />
                        <path d="M121 96 L132 96" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />
                        <circle cx="126" cy="98" r="2.5" fill="#0F172A" />
                        <path d="M112 109 Q117 114 122 108" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      </>
                    )}
                  </g>
                </g>
              ) : (
                /* --------------------------------------------------------- */
                /* MODE B: CYBER OLED DIGITAL EYES                           */
                /* --------------------------------------------------------- */
                <g className="transition-all duration-150">
                  {isBlinking ? (
                    <>
                      <line x1="81" y1="102" x2="101" y2="102" stroke="#2DD4BF" strokeWidth="4.5" strokeLinecap="round" />
                      <line x1="129" y1="102" x2="149" y2="102" stroke="#2DD4BF" strokeWidth="4.5" strokeLinecap="round" />
                    </>
                  ) : currentExpression === "matrix" ? (
                    <>
                      <rect x="78" y="86" width="6" height="12" fill="#2DD4BF" className="animate-pulse" />
                      <rect x="88" y="92" width="6" height="18" fill="#34D399" />
                      <rect x="98" y="88" width="6" height="14" fill="#2DD4BF" />
                      <rect x="126" y="86" width="6" height="16" fill="#2DD4BF" />
                      <rect x="136" y="94" width="6" height="12" fill="#34D399" />
                      <rect x="146" y="88" width="6" height="20" fill="#2DD4BF" className="animate-pulse" />
                    </>
                  ) : currentExpression === "dizzy" ? (
                    <>
                      <circle cx="91" cy="100" r="10" stroke="#F59E0B" strokeWidth="3" fill="none" strokeDasharray="6 3" className="animate-spin" />
                      <circle cx="91" cy="100" r="4" fill="#F59E0B" />
                      <circle cx="139" cy="100" r="10" stroke="#F59E0B" strokeWidth="3" fill="none" strokeDasharray="6 3" className="animate-spin" />
                      <circle cx="139" cy="100" r="4" fill="#F59E0B" />
                      <path d="M109 116 Q115 111 121 116" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </>
                  ) : currentExpression === "hearts" ? (
                    <>
                      <path
                        d="M91 106 C91 106, 82 99, 82 94 C82 90.5, 85 88, 88.5 88 C90.5 88, 91 89.5, 91 89.5 C91 89.5, 91.5 88, 93.5 88 C97 88, 100 90.5, 100 94 C100 99, 91 106, 91 106 Z"
                        fill="#F43F5E"
                        filter={`url(#neonGlow-${gradientId})`}
                      />
                      <path
                        d="M139 106 C139 106, 130 99, 130 94 C130 90.5, 133 88, 136.5 88 C138.5 88, 139 89.5, 139 89.5 C139 89.5, 139.5 88, 141.5 88 C145 88, 148 90.5, 148 94 C148 99, 139 106, 139 106 Z"
                        fill="#F43F5E"
                        filter={`url(#neonGlow-${gradientId})`}
                      />
                      <ellipse cx="76" cy="110" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.8" />
                      <ellipse cx="154" cy="110" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.8" />
                      <path d="M109 113 Q115 118 121 113" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </>
                  ) : currentExpression === "stars" ? (
                    <>
                      <polygon points="91,87 93.5,95 101,95 95,99.5 97.5,107 91,102 84.5,107 87,99.5 81,95 88.5,95" fill="#FDE047" filter={`url(#neonGlow-${gradientId})`} />
                      <polygon points="139,87 141.5,95 149,95 143,99.5 145.5,107 139,102 132.5,107 135,99.5 129,95 136.5,95" fill="#FDE047" filter={`url(#neonGlow-${gradientId})`} />
                      <path d="M108 113 Q115 120 122 113" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </>
                  ) : currentExpression === "wink" ? (
                    <>
                      <path d="M81 101 Q91 91 101 101" stroke="#2DD4BF" strokeWidth="4.5" strokeLinecap="round" fill="none" filter={`url(#neonGlow-${gradientId})`} />
                      <ellipse cx="139" cy="98" rx="10" ry="13.5" fill={`url(#eyeGlow-${gradientId})`} filter={`url(#neonGlow-${gradientId})`} />
                      <circle cx="136" cy="93" r="4" fill="#FFFFFF" />
                      <path d="M109 113 Q117 119 123 111" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </>
                  ) : currentExpression === "cool" ? (
                    <>
                      <polygon points="76,92 106,92 101,107 81,107" fill="#042F2E" stroke="#38BDF8" strokeWidth="2.5" />
                      <line x1="106" y1="96" x2="124" y2="96" stroke="#38BDF8" strokeWidth="2.5" />
                      <polygon points="124,92 154,92 149,107 129,107" fill="#042F2E" stroke="#38BDF8" strokeWidth="2.5" />
                      <line x1="82" y1="96" x2="98" y2="96" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="130" y1="96" x2="146" y2="96" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M108 114 Q116 117 122 112" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </>
                  ) : currentExpression === "focused" ? (
                    <>
                      <ellipse cx="91" cy="98" rx="8" ry="11" fill="#38BDF8" filter={`url(#neonGlow-${gradientId})`} />
                      <ellipse cx="139" cy="98" rx="8" ry="11" fill="#38BDF8" filter={`url(#neonGlow-${gradientId})`} />
                      <line x1="72" y1="98" x2="158" y2="98" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" className="animate-pulse" />
                      <path d="M110 114 L120 114" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                    </>
                  ) : currentExpression === "surprised" ? (
                    <>
                      <circle cx="91" cy="97" r="11" fill={`url(#eyeGlow-${gradientId})`} filter={`url(#neonGlow-${gradientId})`} />
                      <circle cx="91" cy="95" r="4.5" fill="#FFFFFF" />
                      <circle cx="139" cy="97" r="11" fill={`url(#eyeGlow-${gradientId})`} filter={`url(#neonGlow-${gradientId})`} />
                      <circle cx="139" cy="95" r="4.5" fill="#FFFFFF" />
                      <circle cx="115" cy="114" r="4" fill="#2DD4BF" />
                    </>
                  ) : isHovered || currentExpression === "happy" ? (
                    <>
                      <path
                        d="M81 103 C83 89, 99 89, 101 103"
                        stroke={`url(#eyeGlow-${gradientId})`}
                        strokeWidth="5"
                        strokeLinecap="round"
                        fill="none"
                        filter={`url(#neonGlow-${gradientId})`}
                      />
                      <path
                        d="M129 103 C131 89, 147 89, 149 103"
                        stroke={`url(#eyeGlow-${gradientId})`}
                        strokeWidth="5"
                        strokeLinecap="round"
                        fill="none"
                        filter={`url(#neonGlow-${gradientId})`}
                      />
                      <path d="M108 111 Q115 117 122 111" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </>
                  ) : (
                    <>
                      <ellipse cx="91" cy="98" rx="10" ry="13.5" fill={`url(#eyeGlow-${gradientId})`} filter={`url(#neonGlow-${gradientId})`} />
                      <circle cx="88" cy="93" r="4" fill="#FFFFFF" />
                      <circle cx="94" cy="101" r="1.8" fill="#FFFFFF" opacity="0.85" />

                      <ellipse cx="139" cy="98" rx="10" ry="13.5" fill={`url(#eyeGlow-${gradientId})`} filter={`url(#neonGlow-${gradientId})`} />
                      <circle cx="136" cy="93" r="4" fill="#FFFFFF" />
                      <circle cx="142" cy="101" r="1.8" fill="#FFFFFF" opacity="0.85" />

                      <path d="M111 113 Q115 116 119 113" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75" />
                    </>
                  )}
                </g>
              )}
            </g>

            {/* ------------------------------------------------------------- */}
            {/* 14 DETAILED VECTOR HATS & ACCESSORIES                         */}
            {/* ------------------------------------------------------------- */}
            {currentHat === "grad" && (
              <g transform="translate(115, 44) scale(0.9)" className="origin-[0_0] pointer-events-none">
                <polygon points="0,-20 38,-7 0,6 -38,-7" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                <rect x="-15" y="-3" width="30" height="11" rx="3" fill="#0F172A" />
                <circle cx="0" cy="-7" r="2.5" fill="#F59E0B" />
                <path d="M0 -7 C14 -7, 22 -2, 26 9" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                <rect x="24" y="9" width="4.5" height="8" fill="#F59E0B" rx="1" />
              </g>
            )}

            {currentHat === "detective" && (
              <g transform="translate(115, 43) scale(0.85)" className="origin-[0_0] pointer-events-none">
                <ellipse cx="0" cy="2" rx="44" ry="7" fill="#78350F" />
                <path d="M-30 2 C-30 -22, 30 -22, 30 2 Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
                <path d="M-18 2 C-18 -18, -4 -24, 0 -22 C4 -24, 18 -18, 18 2" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
                <circle cx="0" cy="-22" r="3" fill="#D97706" />
                <path d="M-4 -20 Q0 -26 4 -20" stroke="#FEF3C7" strokeWidth="1.5" fill="none" />
              </g>
            )}

            {currentHat === "crown" && (
              <g transform="translate(115, 41) scale(0.82)" className="origin-[0_0] pointer-events-none">
                <polygon points="-32,2 -36,-20 -18,-7 0,-26 18,-7 36,-20 32,2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" />
                <rect x="-30" y="-1" width="60" height="4" rx="2" fill="#D97706" />
                <circle cx="0" cy="-26" r="3.5" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
                <circle cx="-36" cy="-20" r="3" fill="#EF4444" />
                <circle cx="36" cy="-20" r="3" fill="#10B981" />
                <circle cx="0" cy="-8" r="3" fill="#3B82F6" />
              </g>
            )}

            {currentHat === "goggles" && (
              <g transform="translate(115, 62) scale(0.88)" className="origin-[0_0] pointer-events-none">
                <rect x="-42" y="-13" width="84" height="20" rx="9" fill="#0369A1" stroke="#38BDF8" strokeWidth="2" />
                <rect x="-34" y="-9" width="30" height="12" rx="4" fill="#0284C7" />
                <rect x="4" y="-9" width="30" height="12" rx="4" fill="#0284C7" />
                <path d="M-30 -3 L-10 -3" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 -3 L28 -3" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="-20" cy="-3" r="2" fill="#FFFFFF" />
                <circle cx="18" cy="-3" r="2" fill="#FFFFFF" />
              </g>
            )}

            {currentHat === "hardHat" && (
              <g transform="translate(115, 41) scale(0.86)" className="origin-[0_0] pointer-events-none">
                <path d="M-38 4 C-38 4, -42 1, -34 0 C-20 -2, 20 -2, 34 0 C42 1, 38 4, 38 4 Z" fill="#CA8A04" />
                <path d="M-32 1 C-32 -24, 32 -24, 32 1 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.8" />
                <path d="M-6 -22 C-6 -26, 6 -26, 6 -22 L6 1 L-6 1 Z" fill="#FACC15" />
                <rect x="-8" y="-10" width="16" height="9" rx="3" fill="#1E293B" />
                <circle cx="0" cy="-5.5" r="3.5" fill="#FEF08A" />
                <circle cx="0" cy="-5.5" r="1.5" fill="#FFFFFF" />
              </g>
            )}

            {currentHat === "wizard" && (
              <g transform="translate(115, 44) scale(0.85)" className="origin-[0_0] pointer-events-none">
                <ellipse cx="0" cy="2" rx="42" ry="7" fill="#1E1B4B" stroke="#312E81" strokeWidth="1.5" />
                <path d="M-26 1 C-20 -22, -12 -42, 14 -46 C8 -42, 2 -32, 26 1 Z" fill="#312E81" stroke="#4338CA" strokeWidth="1.5" />
                <path d="M2 -32 A 6 6 0 1 0 2 -20 A 4 4 0 1 1 2 -32" fill="#FDE047" />
                <polygon points="-8,-16 -7,-13 -4,-13 -6,-11 -5,-8 -8,-10 -11,-8 -10,-11 -12,-13 -9,-13" fill="#FDE047" />
                <polygon points="12,-12 13,-10 15,-10 13.5,-8.5 14,-6 12,-7.5 10,-6 10.5,-8.5 9,-10 11,-10" fill="#FDE047" />
              </g>
            )}

            {currentHat === "chef" && (
              <g transform="translate(115, 42) scale(0.85)" className="origin-[0_0] pointer-events-none">
                <rect x="-24" y="-2" width="48" height="8" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.2" />
                <path d="M-26 -2 C-38 -14, -30 -34, -14 -32 C-10 -42, 10 -42, 14 -32 C30 -34, 38 -14, 26 -2 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.8" />
                <path d="M16 2 C22 -4, 28 -2, 26 4 C24 8, 18 6, 16 2 Z" fill="#10B981" />
                <circle cx="22" cy="1" r="1" fill="#34D399" />
              </g>
            )}

            {currentHat === "headphones" && (
              <g transform="translate(115, 68) scale(0.9)" className="origin-[0_0] pointer-events-none">
                <path d="M-44 26 C-44 -28, 44 -28, 44 26" stroke="#0F172A" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M-36 12 C-36 -20, 36 -20, 36 12" stroke="#06B6D4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <rect x="-52" y="14" width="14" height="28" rx="6" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
                <circle cx="-45" cy="28" r="4" fill="#EC4899" />
                <rect x="38" y="14" width="14" height="28" rx="6" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
                <circle cx="45" cy="28" r="4" fill="#EC4899" />
                <path d="M-45 36 C-40 48, -25 54, -10 52" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="-8" cy="52" r="3" fill="#10B981" />
              </g>
            )}

            {currentHat === "cowboy" && (
              <g transform="translate(115, 41) scale(0.85)" className="origin-[0_0] pointer-events-none">
                <path d="M-46 4 C-38 1, -26 -1, 0 -1 C26 -1, 38 1, 46 4 C40 8, 26 3, 0 3 C-26 3, -40 8, -46 4 Z" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
                <path d="M-24 0 C-24 -22, -14 -26, 0 -22 C14 -26, 24 -22, 24 0 Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
                <rect x="-23" y="-3" width="46" height="4" rx="1.5" fill="#451A03" />
                <polygon points="0,-12 2,-7 7,-7 3,-4 4,1 0,-2 -4,1 -3,-4 -7,-7 -2,-7" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
              </g>
            )}

            {currentHat === "astronaut" && (
              <g transform="translate(115, 52) scale(0.88)" className="origin-[0_0] pointer-events-none">
                <circle cx="0" cy="10" r="44" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                <path d="M-32 0 C-32 -16, 32 -16, 32 0 C32 18, -32 18, -32 0 Z" fill="#F59E0B" opacity="0.85" stroke="#D97706" strokeWidth="1.5" />
                <path d="M-24 -6 C-12 -12, 12 -12, 24 -6" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" opacity="0.9" fill="none" />
                <rect x="-47" y="4" width="6" height="14" rx="2" fill="#64748B" />
                <rect x="41" y="4" width="6" height="14" rx="2" fill="#64748B" />
                <circle cx="44" cy="2" r="2" fill="#EF4444" />
              </g>
            )}

            {currentHat === "flowerCrown" && (
              <g transform="translate(115, 45) scale(0.88)" className="origin-[0_0] pointer-events-none">
                <path d="M-36 2 C-20 -10, 20 -10, 36 2 C24 -5, -24 -5, -36 2 Z" fill="#047857" />
                <circle cx="-28" cy="-2" r="5" fill="#F472B6" />
                <circle cx="-28" cy="-2" r="2" fill="#FDE047" />
                <circle cx="0" cy="-8" r="6.5" fill="#F59E0B" />
                <circle cx="0" cy="-8" r="3" fill="#78350F" />
                <circle cx="28" cy="-2" r="5" fill="#F472B6" />
                <circle cx="28" cy="-2" r="2" fill="#FDE047" />
                <circle cx="-14" cy="-5" r="4" fill="#FFFFFF" />
                <circle cx="-14" cy="-5" r="1.5" fill="#FBBF24" />
                <circle cx="14" cy="-5" r="4" fill="#FFFFFF" />
                <circle cx="14" cy="-5" r="1.5" fill="#FBBF24" />
              </g>
            )}

            {currentHat === "cap" && (
              <g transform="translate(115, 42) scale(0.85)" className="origin-[0_0] pointer-events-none">
                <path d="M-32 2 C-32 -22, 32 -22, 32 2 Z" fill="#0F766E" stroke="#115E59" strokeWidth="1.5" />
                <path d="M-22 2 C-22 8, 22 8, 22 2 C28 7, -28 7, -22 2 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
                <circle cx="0" cy="-21" r="2.5" fill="#F97316" />
                <rect x="-12" y="-12" width="24" height="8" rx="2" fill="#134E4A" />
                <text x="0" y="-6.5" fill="#FEF08A" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">CIVI</text>
              </g>
            )}

            {currentHat === "topHat" && (
              <g transform="translate(115, 43) scale(0.84)" className="origin-[0_0] pointer-events-none">
                <ellipse cx="0" cy="2" rx="38" ry="6" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
                <path d="M-22 1 L-18 -32 L18 -32 L22 1 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
                <ellipse cx="0" cy="-32" rx="18" ry="4" fill="#1E293B" />
                <rect x="-21.5" y="-6" width="43" height="7" fill="#DC2626" />
                <polygon points="12,-16 13.5,-12 17,-12 14,-9.5 15.5,-6 12,-8 8.5,-6 10,-9.5 7,-12 10.5,-12" fill="#FDE047" />
              </g>
            )}

            {/* ------------------------------------------------------------- */}
            {/* INTERACTIVE PART 6: CHEST CIVIC CORE (Heart & Overdrive)      */}
            {/* ------------------------------------------------------------- */}
            <g
              id="civi-core"
              onMouseDown={() => handleMouseDownOnPart("core")}
              onMouseUp={(e) => handleMouseUpOnPart("core", e)}
              className={`cursor-pointer group/core origin-[115px_158px] outline-none select-none ${coreMotion}`}
              style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
              aria-label="Civic Core"
            >
              <title>Single, Double (Hyper-Drive!), Multi, or Hold Core (Supernova!) 💖</title>
              {/* Outer Core Rim */}
              <circle
                cx="115"
                cy="158"
                r="19"
                fill="#E6FFFA"
                stroke="#0F766E"
                strokeWidth="2"
                className="group-hover/core:stroke-secondary group-hover/core:fill-amber-50 transition-all"
              />

              {/* Rotating Dashed Civic Ring */}
              <circle
                cx="115"
                cy="158"
                r="16"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
                className="origin-[115px_158px] animate-civi-core-spin"
              />

              {/* Pulsing Energy Gem Halo */}
              <circle
                cx="115"
                cy="158"
                r="12.5"
                fill={`url(#gem-${gradientId})`}
                filter={`url(#neonGlow-${gradientId})`}
                opacity="0.95"
              />

              {/* Inner Golden Civic Heart */}
              <path
                d="M115 163 C115 163, 107.5 157.5, 107.5 153 C107.5 150.2, 109.8 148.5, 112.5 148.5 C114.2 148.5, 115 150, 115 150 C115 150, 115.8 148.5, 117.5 148.5 C120.2 148.5, 122.5 150.2, 122.5 153 C122.5 157.5, 115 163, 115 163 Z"
                fill="#FFFFFF"
              />
            </g>

            {/* ------------------------------------------------------------- */}
            {/* TRICK EFFECT: JUGGLING ORBS (When juggle trick is active)     */}
            {/* ------------------------------------------------------------- */}
            {isJuggling && (
              <g className="pointer-events-none">
                <circle cx="0" cy="0" r="7.5" fill="#10B981" filter={`url(#neonGlow-${gradientId})`} className="animate-civi-juggle-orb-1" />
                <circle cx="0" cy="0" r="4" fill="#FFFFFF" className="animate-civi-juggle-orb-1" />
                <circle cx="0" cy="0" r="7.5" fill="#F59E0B" filter={`url(#neonGlow-${gradientId})`} className="animate-civi-juggle-orb-2" />
                <circle cx="0" cy="0" r="4" fill="#FFFFFF" className="animate-civi-juggle-orb-2" />
                <circle cx="0" cy="0" r="7.5" fill="#38BDF8" filter={`url(#neonGlow-${gradientId})`} className="animate-civi-juggle-orb-3" />
                <circle cx="0" cy="0" r="4" fill="#FFFFFF" className="animate-civi-juggle-orb-3" />
              </g>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TRICK EFFECT: ROCKET FLAMES (When rocket trick is active)     */}
            {/* ------------------------------------------------------------- */}
            {isRocketFiring && (
              <g className="pointer-events-none">
                <g transform="translate(28, 138)">
                  <path d="M-6 0 Q0 24 6 0 Z" fill="#EF4444" className="animate-pulse" />
                  <path d="M-3 0 Q0 16 3 0 Z" fill="#F59E0B" />
                  <path d="M-1.5 0 Q0 8 1.5 0 Z" fill="#FEF08A" />
                </g>
                <g transform="translate(202, 138)">
                  <path d="M-6 0 Q0 24 6 0 Z" fill="#EF4444" className="animate-pulse" />
                  <path d="M-3 0 Q0 16 3 0 Z" fill="#F59E0B" />
                  <path d="M-1.5 0 Q0 8 1.5 0 Z" fill="#FEF08A" />
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ------------------------------------------------------------- */}
        {/* Dynamic Ground Shadow                                         */}
        {/* ------------------------------------------------------------- */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-1 h-3.5 w-32 rounded-full bg-foreground/15 blur-sm dark:bg-black/50 ${
            !isHovered && !bodyMotion ? "animate-civi-shadow" : ""
          }`}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Interactive Toolbar: Quick Flippers & Drawers               */}
      {/* ------------------------------------------------------------- */}
      <div className="flex w-full flex-wrap items-center justify-center gap-1.5 shrink-0 px-1">
        {/* Sticky Paper Face Quick Switcher & Drawer */}
        <div className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-300/15 p-0.5 shadow-xs">
          <button
            type="button"
            onClick={(e) => cycleStickyFaceDirection(-1, e)}
            className="flex size-6 items-center justify-center rounded-full text-foreground/70 hover:bg-amber-400/30 hover:text-foreground active:scale-95"
            title="Previous Sticky Face"
            aria-label="Previous Sticky Face"
          >
            <ChevronLeft className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowFacesDrawer((prev) => !prev);
              setShowWardrobeDrawer(false);
              setShowTricksDrawer(false);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-bold text-foreground hover:text-amber-700 dark:hover:text-amber-300 active:scale-95"
            title="Open 14 Sprout Sticky Faces"
          >
            <span>📝</span>
            <span className="max-w-[70px] truncate">{currentStickyMeta.name}</span>
          </button>

          <button
            type="button"
            onClick={(e) => cycleStickyFaceDirection(1, e)}
            className="flex size-6 items-center justify-center rounded-full text-foreground/70 hover:bg-amber-400/30 hover:text-foreground active:scale-95"
            title="Next Sticky Face"
            aria-label="Next Sticky Face"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Hat Quick Switcher & Wardrobe Drawer */}
        <div className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 p-0.5 shadow-xs">
          <button
            type="button"
            onClick={(e) => cycleHatDirection(-1, e)}
            className="flex size-6 items-center justify-center rounded-full text-foreground/70 hover:bg-secondary/20 hover:text-foreground active:scale-95"
            title="Previous Hat"
            aria-label="Previous Hat"
          >
            <ChevronLeft className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowWardrobeDrawer((prev) => !prev);
              setShowFacesDrawer(false);
              setShowTricksDrawer(false);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-bold text-foreground hover:text-primary active:scale-95"
            title="Open 14-Hat Wardrobe"
          >
            <span>{currentHatMeta.icon}</span>
            <span className="max-w-[70px] truncate">{currentHatMeta.name}</span>
          </button>

          <button
            type="button"
            onClick={(e) => cycleHatDirection(1, e)}
            className="flex size-6 items-center justify-center rounded-full text-foreground/70 hover:bg-secondary/20 hover:text-foreground active:scale-95"
            title="Next Hat"
            aria-label="Next Hat"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Tricks & Stunts Button */}
        <button
          type="button"
          onClick={() => {
            setShowTricksDrawer((prev) => !prev);
            setShowWardrobeDrawer(false);
            setShowFacesDrawer(false);
          }}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-xs transition-all active:scale-95 outline-none focus:outline-none ${
            showTricksDrawer
              ? "border-amber-500 bg-amber-500/20 text-amber-700 dark:text-amber-300"
              : "border-amber-500/30 bg-amber-500/10 text-foreground hover:bg-amber-500/20"
          }`}
          title="Perform Circus & Robotic Stunts!"
        >
          <span>🎪</span>
          <span>Tricks</span>
        </button>

        {/* Audio Mute/Unmute Toggle */}
        <button
          type="button"
          onClick={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            audioSynth.current.setMuted(nextMuted);
            if (!nextMuted) {
              audioSynth.current.playPop(1.4);
            }
          }}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold shadow-xs transition-all active:scale-95 outline-none focus:outline-none ${
            isMuted
              ? "border-muted-foreground/30 bg-muted/40 text-muted-foreground hover:bg-muted/70"
              : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
          }`}
          title={isMuted ? "Unmute Civi sound effects" : "Mute Civi sound effects"}
          aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
        >
          {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 text-primary" />}
        </button>

        {/* Cheer Count Pill */}
        <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-muted/60 px-2 py-1 text-[11px] font-bold text-muted-foreground">
          <span>Cheers:</span>
          <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] font-black text-primary">
            {cheerCount}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. IN-CARD OVERLAY: STICKY FACES DRAWER (Zero Parent Resizing) */}
      {/* ------------------------------------------------------------- */}
      {showFacesDrawer && (
        <div className="absolute inset-0 z-30 rounded-3xl border border-amber-400/50 bg-card/98 p-3.5 shadow-2xl backdrop-blur-xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150 dark:border-amber-400/40">
          <div>
            <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">📝</span>
                <span className="text-xs font-bold text-foreground">
                  Sprout Sticky Faces ({STICKY_FACES_COLLECTION.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowFacesDrawer(false)}
                className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-bold text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
              >
                ✕ Close
              </button>
            </div>

            {/* Style toggle between Sticky Note vs Digital Screen */}
            <div className="mb-2 flex items-center justify-between rounded-xl bg-amber-500/10 px-2 py-1 text-xs">
              <span className="text-[11px] font-semibold text-foreground/80">Display Style:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setFaceStyle("sticky");
                    audioSynth.current.playPaperSlap();
                    setStickySlapAnim(true);
                    setTimeout(() => setStickySlapAnim(false), 500);
                  }}
                  className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold transition-all ${
                    faceStyle === "sticky"
                      ? "bg-amber-400 text-amber-950 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>📝 Sticky</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFaceStyle("digital");
                    audioSynth.current.playCyber();
                  }}
                  className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold transition-all ${
                    faceStyle === "digital"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>🥽 Digital</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 overflow-y-auto max-h-[250px] pr-1 py-1">
            {STICKY_FACES_COLLECTION.map((face) => (
              <button
                key={face.id}
                type="button"
                onClick={() => {
                  setFaceStyle("sticky");
                  equipStickyFace(face.id);
                  setShowFacesDrawer(false);
                }}
                className={`flex items-center gap-2 rounded-xl p-1.5 text-left text-xs transition-all active:scale-95 ${
                  currentStickyFace === face.id && faceStyle === "sticky"
                    ? "bg-amber-300/40 border border-amber-500 font-bold text-foreground shadow-xs"
                    : "border border-amber-400/20 bg-amber-300/10 hover:bg-amber-300/25 text-foreground/80"
                }`}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-200 text-xs font-mono font-bold text-amber-950 shadow-xs">
                  📝
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-bold">{face.name}</div>
                  <div className="truncate text-[10px] font-mono text-muted-foreground">{face.ascii}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2 text-center text-[10px] font-medium text-muted-foreground border-t border-border/40">
            Tip: Tap Civi's visor anytime to slap a new face!
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. IN-CARD OVERLAY: WARDROBE DRAWER (Zero Parent Resizing)    */}
      {/* ------------------------------------------------------------- */}
      {showWardrobeDrawer && (
        <div className="absolute inset-0 z-30 rounded-3xl border border-secondary/50 bg-card/98 p-3.5 shadow-2xl backdrop-blur-xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150 dark:border-secondary/40">
          <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🎩</span>
              <span className="text-xs font-bold text-foreground">
                Civi's Wardrobe ({HATS_COLLECTION.length} Hats)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowWardrobeDrawer(false)}
              className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-bold text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 overflow-y-auto max-h-[290px] pr-1 py-1">
            {HATS_COLLECTION.map((hat) => (
              <button
                key={hat.id}
                type="button"
                onClick={() => {
                  equipHat(hat.id);
                  setShowWardrobeDrawer(false);
                }}
                className={`flex items-center gap-2 rounded-xl p-1.5 text-left text-xs transition-all active:scale-95 ${
                  currentHat === hat.id
                    ? "bg-secondary/25 border border-secondary font-bold text-foreground shadow-xs"
                    : "border border-border/50 bg-muted/30 hover:bg-muted/80 text-foreground/80"
                }`}
              >
                <span className="text-base shrink-0">{hat.icon}</span>
                <span className="truncate text-[11px]">{hat.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 text-center text-[10px] font-medium text-muted-foreground border-t border-border/40">
            Tip: Use &lt; and &gt; flippers on the toolbar for quick hat changes!
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. IN-CARD OVERLAY: TRICKS DRAWER (Zero Parent Resizing)      */}
      {/* ------------------------------------------------------------- */}
      {showTricksDrawer && (
        <div className="absolute inset-0 z-30 rounded-3xl border border-amber-500/50 bg-card/98 p-3.5 shadow-2xl backdrop-blur-xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150 dark:border-amber-500/40">
          <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🎪</span>
              <span className="text-xs font-bold text-foreground">
                Perform Stunts & Tricks ({TRICKS_COLLECTION.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowTricksDrawer(false)}
              className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-bold text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 overflow-y-auto max-h-[260px] pr-1 py-1">
            {TRICKS_COLLECTION.map((trick) => (
              <button
                key={trick.id}
                type="button"
                onClick={() => {
                  executeTrick(trick.id);
                  setShowTricksDrawer(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-2 text-left text-xs text-foreground transition-all hover:bg-amber-500/25 active:scale-95"
              >
                <span className="text-lg shrink-0">{trick.icon}</span>
                <span className="truncate text-[11px] font-semibold">{trick.name}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                const randomTrick = TRICKS_COLLECTION[Math.floor(Math.random() * TRICKS_COLLECTION.length)];
                executeTrick(randomTrick.id);
                setShowTricksDrawer(false);
              }}
              className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 p-2 text-xs font-bold text-primary transition-all hover:bg-primary/20 active:scale-95"
            >
              <span>🎲</span>
              <span>Surprise Me with a Random Trick!</span>
            </button>
          </div>

          <div className="pt-2 text-center text-[10px] font-medium text-muted-foreground border-t border-border/40">
            Tip: Double-tap parts to trigger special moves directly!
          </div>
        </div>
      )}
    </div>
  );
}
