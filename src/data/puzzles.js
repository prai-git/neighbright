export const puzzlesByTier = {
  1: [
    { id: 'shape-sorter', i18nKey: 'puzzles.shapeSorter', icon: '🔷', component: 'ShapeSorter' },
    { id: 'color-match', i18nKey: 'puzzles.colorMatch', icon: '🎨', component: 'ColorMatch' },
    { id: 'size-order', i18nKey: 'puzzles.sizeOrder', icon: '📏', component: 'SizeOrder' },
    { id: 'peekaboo', i18nKey: 'puzzles.peekaboo', icon: '🙈', component: 'Peekaboo' },
    { id: 'jigsaw-4', i18nKey: 'puzzles.jigsaw', icon: '🧩', component: 'Jigsaw', config: { pieces: 4 } },
  ],
  2: [
    { id: 'pattern', i18nKey: 'puzzles.pattern', icon: '🔁', component: 'PatternCompletion' },
    { id: 'counting', i18nKey: 'puzzles.counting', icon: '🔢', component: 'Counting' },
    { id: 'letter-trace', i18nKey: 'puzzles.letterTrace', icon: '✍️', component: 'LetterTrace' },
    { id: 'shadow-match', i18nKey: 'puzzles.shadowMatch', icon: '🌑', component: 'ShadowMatch' },
    { id: 'rhyming', i18nKey: 'puzzles.rhyming', icon: '🎵', component: 'RhymingPairs' },
    { id: 'jigsaw-9', i18nKey: 'puzzles.jigsaw', icon: '🧩', component: 'Jigsaw', config: { pieces: 9 } },
  ],
  3: [
    { id: 'word-picture', i18nKey: 'puzzles.wordPicture', icon: '📝', component: 'WordPicture' },
    { id: 'sentence-build', i18nKey: 'puzzles.sentenceBuild', icon: '📖', component: 'SentenceBuilder' },
    { id: 'story-sequence', i18nKey: 'puzzles.storySequence', icon: '📚', component: 'StorySequence' },
    { id: 'beginning-sounds', i18nKey: 'puzzles.beginningSound', icon: '🔤', component: 'BeginningSound' },
    { id: 'analogies', i18nKey: 'puzzles.analogies', icon: '🧠', component: 'Analogies' },
    { id: 'maze', i18nKey: 'puzzles.maze', icon: '🏁', component: 'Maze' },
    { id: 'jigsaw-16', i18nKey: 'puzzles.jigsaw', icon: '🧩', component: 'Jigsaw', config: { pieces: 16 } },
  ],
};
