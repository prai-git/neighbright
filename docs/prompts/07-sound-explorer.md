# Module 07 — Sound Explorer (Articulation Practice)

**Scope:** Build structured articulation therapy: phoneme data, mouth-position SVG diagrams, 5-level practice progression, record & compare, and the sound sorting mini-game. English content only; UI chrome translated.

**Prerequisite:** Modules 01–06 complete (especially `useSpeech`).

---

## 1. Phoneme Data

```javascript
// src/data/sounds.js
export const soundGroups = [
  {
    id: 'bilabial',
    i18nKey: 'sounds.groups.bilabial',
    sounds: [
      {
        id: 'p',
        symbol: '/p/',
        mouthDescription: 'Press both lips together, then pop them apart with a burst of air.',
        mouthDiagramKey: 'bilabial-stop',  // maps to SVG file
        examples: {
          initial: ['pop', 'pig', 'pan'],
          medial: ['apple', 'happy', 'zipper'],
          final: ['cup', 'stop', 'map']
        },
        ageOfAcquisition: '2–3 years',
        levels: {
          1: { prompt: 'Say: p ... p ... p', model: 'p' },
          2: { prompt: 'Say: pa, pe, pi, po, pu', model: 'pa, pe, pi, po, pu' },
          3: { words: ['pop', 'pig', 'cup'] },
          4: { phrases: ['I see a pig', 'Pass the cup', 'Pop the balloon'] },
          5: { sentences: ['Please put the purple pen on the paper.'] }
        }
      },
      { id: 'b', /* ... similar structure */ },
      { id: 'm', /* ... similar structure */ }
    ]
  },
  // labiodental: f, v
  // dental: th (voiced), th (voiceless)
  // alveolar: t, d, n, s, z, l
  // palatal: sh, ch, j, r
  // velar: k, g, ng
  // glottal: h
];
```

**Complete all 24 consonant sounds** with the full structure above. Each sound needs: symbol, mouthDescription, 3 example words per position (initial/medial/final), age of acquisition, and all 5 level prompts.

---

## 2. Mouth-Position SVGs

Create simple SVG cross-section diagrams showing head profile with tongue, lips, teeth, and palate positions. Store in `public/images/mouth/`.

**Diagrams needed (one per group, sounds within a group share the diagram):**
- `bilabial-stop.svg` — lips pressed together
- `bilabial-nasal.svg` — lips together, airflow through nose
- `labiodental.svg` — upper teeth on lower lip
- `dental.svg` — tongue tip between teeth
- `alveolar-stop.svg` — tongue tip on ridge behind teeth
- `alveolar-fricative.svg` — tongue near ridge, air forced through gap
- `alveolar-nasal.svg` — tongue on ridge, nasal airflow
- `alveolar-lateral.svg` — tongue on ridge, air around sides
- `palatal-fricative.svg` — tongue raised to palate
- `palatal-affricate.svg` — tongue to palate then released
- `palatal-r.svg` — tongue curled back
- `velar.svg` — back of tongue to soft palate
- `glottal.svg` — open throat

Each SVG should be ~200×200px, clean line art, with the active articulator highlighted in the primary color. Use a consistent visual style across all diagrams.

---

## 3. Page Components

### SoundGroupSelector.jsx (`src/components/sounds/`)

- Grid of sound group cards: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`
- Each card shows: group name (translated), the sounds in that group as small badges (e.g., "/p/ /b/ /m/"), and the mouth diagram SVG as a small preview
- Tapping opens that group's sound list

### SoundCard.jsx

- Individual sound selector within a group
- Shows: large phoneme symbol (`/p/`), age of acquisition badge, example word, progress indicator (which levels completed)
- `Card` with tap → opens the practice view for that sound

### PracticeView.jsx

- Full-screen practice interface for a single sound at a single level
- **Top:** Sound symbol + mouth diagram SVG (large, ~150×150px)
- **Mouth description:** `mouthDescription` text displayed below the diagram
- **Level tabs:** 5 tabs across the top (Level 1–5), active tab highlighted. Locked levels show a lock icon if prerequisites not met (optional: can make all levels accessible).
- **Content area changes per level:**
  - **Level 1 (Isolation):** Large prompt text ("Say: p ... p ... p"), tap-to-hear button, record button
  - **Level 2 (Syllables):** Syllable list with tap-to-hear each one, record button
  - **Level 3 (Words):** Three word cards with emoji/picture, tap to hear each word, record button per word
  - **Level 4 (Phrases):** Phrase cards, tap to hear, record
  - **Level 5 (Sentences):** Full sentence, tap to hear, record
- **Tap to hear:** Uses `speak()` from `useSpeech` with slow rate for isolation/syllables
- **Star awarded** on completing any level attempt (effort-based, not accuracy-based)

### RecordCompare.jsx

- **Record button:** Large microphone icon button. Tap to start recording, tap again to stop.
- Uses `useAudioRecorder` hook (build below)
- After recording:
  - **Play back** button — plays the child's recording
  - **Hear model** button — plays the model audio via `speak()`
  - Both buttons side by side for easy comparison
- Recordings are stored in memory only (as `Blob` URLs). Never persisted to IndexedDB or server.
- If `MediaRecorder` is not supported: hide the record button, show a small note.

### SoundSortingGame.jsx

- Mini-game: a word appears, child drags it to one of two buckets labeled with phonemes
- Example: word "fish" → buckets "/f/" and "/s/" → correct answer is /f/
- 10 rounds per game, random word selection from the phoneme data
- Visual feedback: correct → green flash + star, incorrect → gentle bounce + show correct answer
- Final screen: "You got {n} out of 10!" with star reward

---

## 4. useAudioRecorder Hook

```javascript
// src/hooks/useAudioRecorder.js
```

**Interface:**
```javascript
const { isRecording, startRecording, stopRecording, audioURL, clearRecording, isSupported } = useAudioRecorder();
```

**Behavior:**
- Check `navigator.mediaDevices && MediaRecorder` for support
- `startRecording()` → request microphone permission, create MediaRecorder, start collecting chunks
- `stopRecording()` → stop recorder, create Blob URL from chunks
- `audioURL` → playable URL (use with `<audio>` element or `new Audio(url).play()`)
- `clearRecording()` → revoke Blob URL, reset state
- Handle permission denied gracefully

---

## 5. Progress Tracking

Log each practice attempt:
```javascript
{
  module: 'sounds',
  activityType: 'sound-practice',
  activityData: { soundId: 'p', level: 3, wordAttempted: 'pop' },
  result: 'attempted',
  durationSecs: elapsed,
  createdAt: new Date().toISOString()
}
```

Sound sorting game:
```javascript
{
  module: 'sounds',
  activityType: 'sound-sorting',
  activityData: { roundsCorrect: 8, roundsTotal: 10, sounds: ['f', 's'] },
  result: 'completed',
  durationSecs: elapsed
}
```

---

## Acceptance Criteria

- [ ] All 24 consonant sounds are present in `sounds.js` with complete data
- [ ] Sound group selector shows all 7 groups with correct translated names
- [ ] Tapping a group shows its individual sounds with progress indicators
- [ ] Tapping a sound opens the 5-level practice view
- [ ] Mouth diagram SVG displays correctly for each sound group
- [ ] Each level shows appropriate content (isolation/syllables/words/phrases/sentences)
- [ ] "Tap to hear" plays the correct audio via Web Speech API
- [ ] Record button captures audio and playback works
- [ ] If MediaRecorder unsupported: record button hidden, no crash
- [ ] Sound sorting game runs 10 rounds with correct/incorrect feedback
- [ ] Stars are awarded for completing practice attempts
- [ ] Progress writes to IndexedDB for every practice attempt
- [ ] UI text is translated (instructions, group names, buttons); phoneme content stays English
- [ ] Responsive: practice view works on phone in portrait mode

---

## Feedback Amendments (2026-05-15)

### Phonics Breakdown for Levels 2-3

Levels 2 (Syllables) and 3 (Words) now include a phonics breakdown before speaking the item:
- Each letter of the word/syllable is spelled out individually (e.g., "P - O - P"), then the whole word is spoken ("pop")
- This helps children connect individual letter sounds to the complete word
- The spell-out uses a brief pause between each letter for clarity

### Safari Recording Playback Fix

Recording playback now works correctly on Safari (iOS and macOS):
- The `useAudioRecorder` hook detects the browser's supported MIME type, preferring `audio/webm` where available and falling back to `audio/mp4` for Safari
- The Blob is created using `recorder.mimeType` (the actual MIME type the recorder used) rather than a hardcoded type
- This resolves an issue where recordings made on Safari could not be played back

### Mouth SVG Path Fix

Mouth-position SVG diagrams now use `import.meta.env.BASE_URL` to construct the image path, ensuring correct resolution when the app is deployed to a subdirectory on GitHub Pages.
