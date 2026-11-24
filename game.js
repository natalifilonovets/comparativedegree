const stages = ['Lay the Foundation', 'Build a Base', 'Start a Farm', 'Explore & Expand', 'Make It Home'];
const modes = {
  choose: 'Choose the correct form.',
  fix: 'Find the mistake.',
  stats: 'Compare the stats.',
  build: 'Build a sentence. One word is extra.',
  type: 'Type the correct comparative form.'
};
const el = id => document.getElementById(id);
const game = el('game');
const screen = el('screen');
const feedback = el('feedback');
const canvas = el('world');
const world = new VoxelWorld(canvas);
const slots = [];
const total = questions.length;

let mode = 'start';
let queue = [];
let currentQuestion = 0;
let firstTryCorrect = 0;
let mistakes = new Set();
let placedRewards = new Map();
let reviewed = new Set();
let soundEnabled = false;
let audio;
let attempts = 0;
let resolved = false;

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function button(text, action, className) {
  const control = node('button', text, className);
  control.type = 'button';
  control.addEventListener('click', action);
  return control;
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function heading(tag, text, focus) {
  const title = node(tag, text);
  title.tabIndex = -1;
  screen.append(title);
  if (focus) title.focus({preventScroll: true});
  return title;
}

function hud() {
  game.dataset.mode = mode;
  const q = queue[currentQuestion];
  el('stage').textContent = mode === 'review' ? 'Review mistakes' :
    mode === 'play' ? `Stage ${q.stage + 1}/5 · ${stages[q.stage]}` : '';
  el('blocks').textContent = `Blocks: ${placedRewards.size}/${total}`;
  slots.forEach((slot, i) => slot.classList.toggle('filled', placedRewards.has(questions[i].rewardId)));
}

function showFeedback(text, kind) {
  feedback.replaceChildren();
  feedback.dataset.kind = kind;
  if (text) feedback.append(node('div', text));
}

function tone(kind) {
  if (!soundEnabled || !audio) return;
  const notes = kind === 'finish' ? [392, 494, 587, 784] : kind === 'correct' ? [440, 659] : [196];
  notes.forEach((pitch, i) => {
    const time = audio.currentTime + i * .085;
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = pitch;
    volume.gain.setValueAtTime(.0001, time);
    volume.gain.exponentialRampToValueAtTime(.075, time + .012);
    volume.gain.exponentialRampToValueAtTime(.0001, time + .16);
    oscillator.connect(volume).connect(audio.destination);
    oscillator.start(time);
    oscillator.stop(time + .17);
  });
}

function start() {
  queue = questions;
  currentQuestion = firstTryCorrect = 0;
  mistakes = new Set();
  placedRewards = new Map();
  reviewed = new Set();
  mode = 'play';
  world.setRewards(placedRewards);
  canvas.setAttribute('aria-label', 'An empty grassy plot');
  showQuestion();
}

function review() {
  queue = shuffle(questions.filter(q => mistakes.has(q.id) && !reviewed.has(q.id)));
  currentQuestion = 0;
  mode = 'review';
  showQuestion();
}

function advance() {
  currentQuestion++;
  if (currentQuestion < queue.length) showQuestion();
  else finish();
}

function finish() {
  const afterReview = mode === 'review';
  mode = 'finish';
  hud();
  screen.replaceChildren();
  showFeedback('');
  heading('h1', 'WORLD COMPLETE!', true);
  screen.append(node('p', 'You built your own world!', 'intro'));
  const result = node('div', '', 'results');
  result.append(node('p', `Blocks placed: ${placedRewards.size}/${total}`));
  result.append(node('p', `Correct on the first try: ${firstTryCorrect}/${total}`));
  if (!mistakes.size) result.append(node('p', 'Perfect run!'));
  if (afterReview) result.append(node('p', 'Mistakes reviewed!'));
  const actions = node('div', '', 'actions');
  if ([...mistakes].some(id => !reviewed.has(id))) {
    actions.append(button('Review mistakes', review, 'primary'));
  }
  actions.append(button('Play again', start, actions.children.length ? '' : 'primary'));
  screen.append(result, actions);
}

function nextButton() {
  return button(currentQuestion === queue.length - 1 ? 'See results' : 'Next challenge', advance, 'primary');
}

function showCatalog(q) {
  const [category, ...variants] = buildCatalog[q.rewardId];
  const catalog = node('section', '', 'catalog');
  const choices = node('div', '', 'catalog-grid');
  choices.setAttribute('role', 'group');
  choices.setAttribute('aria-label', category + ' styles');
  const next = nextButton();
  next.disabled = true;

  screen.replaceChildren();
  showFeedback('Correct! Choose a design to place it.', 'success');
  screen.append(node('div', 'BUILD CATALOG', 'eyebrow catalog-label'));
  heading('h2', 'Choose your ' + category.toLowerCase(), true);
  catalog.append(choices, next);
  screen.append(catalog);

  variants.forEach(([name], variant) => {
    const card = button('', event => {
      if (event.detail > 1 || placedRewards.get(q.rewardId) === variant) return;
      const firstPlacement = !placedRewards.has(q.rewardId);
      placedRewards.set(q.rewardId, variant);
      world.setRewards(placedRewards, firstPlacement ? q.rewardId : '');
      canvas.setAttribute('aria-label', `Voxel world with ${placedRewards.size} of ${total} elements built. Latest addition: ${name} (${category.toLowerCase()}).`);
      if (firstPlacement) tone(placedRewards.size === total ? 'finish' : 'correct');
      for (const option of choices.children) option.setAttribute('aria-pressed', String(option === card));
      next.disabled = false;
      showFeedback(firstPlacement ? `${name} placed!` : `Switched to ${name}.`, 'success');
      hud();
    }, 'catalog-card');
    card.setAttribute('aria-pressed', 'false');
    const thumbnail = node('canvas', '', 'catalog-preview');
    thumbnail.setAttribute('aria-hidden', 'true');
    world.preview(thumbnail, q.rewardId, variant);
    card.append(thumbnail, node('span', name, 'catalog-name'));
    choices.append(card);
  });
}

function showQuestion() {
  const q = queue[currentQuestion];
  attempts = 0;
  resolved = false;
  screen.replaceChildren();
  showFeedback('');
  hud();
  screen.append(node('div', `${mode === 'review' ? 'REVIEW' : 'CHALLENGE'} ${currentQuestion + 1}/${queue.length}`, 'eyebrow'));
  heading('h2', modes[q.type], true);

  function mistake(hint) {
    attempts++;
    if (mode === 'play') mistakes.add(q.id);
    tone('error');
    const model = q.type === 'fix' ? q.prompt.replace(q.fragment, q.correctAnswer) : q.correctAnswer;
    showFeedback(attempts >= 2 ? `Model: ${model} Try it again.` : hint, 'error');
  }

  function check(value, control) {
    if (resolved) return;
    const comparable = text => {
      const normalized = normalize(text);
      return q.type === 'build' ? normalized.replace(/\s*\.$/, '') : normalized;
    };
    const answer = comparable(value);
    const key = comparable(q.correctAnswer);
    if (answer !== key) {
      if (control) {
        screen.querySelector('.options .incorrect')?.classList.remove('incorrect');
        control.classList.add('incorrect');
      }
      let hint = q.feedback;
      const doubleForms = /\bmore\s+(?:bigger|biger|enjoyabler|funnier|funnyer|safer|difficulter|easier|dangerouser|better|smaller|taller|heavier|faster|darker|worse)\b/;
      if (doubleForms.test(answer)) hint = 'Use ONE comparative marker: -er OR more, not both.';
      else if (q.id === 14 && answer.includes('expensiver')) hint = 'Use more with this long adjective.';
      mistake(hint);
      return;
    }

    resolved = true;
    if (control) control.classList.replace('incorrect', 'correct') || control.classList.add('correct');
    for (const input of screen.querySelectorAll('button, input')) input.disabled = true;
    if (mode === 'play') {
      if (attempts === 0) firstTryCorrect++;
      showCatalog(q);
      return;
    }

    reviewed.add(q.id);
    tone('correct');
    showFeedback('Correct! Mistake reviewed.', 'success');
    const next = nextButton();
    next.disabled = true;
    feedback.append(next);
    setTimeout(() => {
      if (!next.isConnected) return;
      next.disabled = false;
      next.focus({preventScroll: true});
    }, 240);
  }

  function choices(options) {
    const group = node('div', '', 'options');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Answer choices');
    for (const value of options) {
      const control = button(value, () => check(value, control));
      group.append(control);
    }
    return group;
  }

  if (q.type === 'fix') {
    const groups = node('div', '', 'groups');
    const replacements = choices(shuffle(q.options));
    groups.setAttribute('role', 'group');
    groups.setAttribute('aria-label', q.prompt);
    for (const text of q.groups) {
      const control = button(text, () => {
        if (resolved) return;
        groups.querySelector('.incorrect')?.classList.remove('incorrect');
        if (text !== q.fragment) {
          groups.querySelector('[aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
          replacements.remove();
          control.classList.add('incorrect');
          mistake('Look for the part that makes the comparison.');
          return;
        }
        control.setAttribute('aria-pressed', 'true');
        screen.append(replacements);
        replacements.firstElementChild.focus({preventScroll: true});
      });
      control.setAttribute('aria-pressed', 'false');
      groups.append(control);
    }
    screen.append(groups);
  } else if (q.type === 'stats') {
    const stats = node('div', '', 'stats');
    for (const [name, value] of q.stats) {
      const card = node('div', '', 'stat');
      card.append(node('strong', name), node('span', value));
      stats.append(card);
    }
    screen.append(stats, choices(shuffle(q.options)));
  } else {
    const prompt = node('p', q.prompt, 'prompt');
    screen.append(prompt);
    if (q.type === 'choose') screen.append(choices(shuffle(q.options)));
    if (q.type === 'build') buildSentence(q, check);
    if (q.type === 'type') {
      const form = node('form', '', 'answer-form');
      const input = node('input');
      input.setAttribute('aria-label', 'Missing comparative form');
      input.autocomplete = 'off';
      input.autocapitalize = 'none';
      input.spellcheck = false;
      input.required = true;
      const submit = node('button', 'Check answer', 'primary');
      form.append(input, submit);
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (input.value.trim()) check(input.value);
      });
      screen.append(form);
    }
  }
}

function buildSentence(q, check) {
  const tokens = shuffle(q.tokens);
  const selected = [];
  const sentence = node('div', '', 'sentence');
  const bank = node('div', '', 'tokens');
  sentence.setAttribute('role', 'group');
  sentence.setAttribute('aria-label', 'Your sentence');
  bank.setAttribute('role', 'group');
  bank.setAttribute('aria-label', 'Available words');
  const submit = button('Check sentence', () => check(selected.map(i => tokens[i]).join(' ')), 'primary');

  function render(moved, added) {
    const word = (i, inSentence) => {
      const control = button(tokens[i], () => {
        if (resolved) return;
        if (inSentence) selected.splice(selected.indexOf(i), 1);
        else selected.push(i);
        render(i, !inSentence);
      });
      control.dataset.token = i;
      control.setAttribute('aria-label', `${inSentence ? 'Remove' : 'Add'} ${tokens[i]}`);
      return control;
    };
    sentence.replaceChildren(...selected.map(i => word(i, true)));
    bank.replaceChildren(...tokens.flatMap((_, i) => selected.includes(i) ? [] : [word(i, false)]));
    submit.disabled = !selected.length;
    if (moved !== undefined) {
      // Keep keyboard navigation in the bank while building word by word.
      const remaining = bank.querySelectorAll('button');
      const next = added ? [...remaining].find(control => Number(control.dataset.token) > moved) || remaining[0] :
        bank.querySelector(`[data-token="${moved}"]`);
      (next || submit).focus({preventScroll: true});
    }
  }
  render();
  screen.append(sentence, bank, submit);
}

for (const stage of stages) {
  const group = node('div', '', 'inventory-group');
  group.title = stage;
  group.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 5; i++) {
    const slot = node('i');
    slots.push(slot);
    group.append(slot);
  }
  el('inventory').append(group);
}
el('sound').addEventListener('click', async () => {
  soundEnabled = !soundEnabled;
  el('sound').textContent = soundEnabled ? 'Sound on' : 'Sound off';
  el('sound').setAttribute('aria-pressed', String(soundEnabled));
  if (soundEnabled && window.AudioContext) {
    audio ||= new AudioContext();
    try { await audio.resume(); } catch { /* The game also works with audio blocked. */ }
  }
});

hud();
screen.append(node('div', 'COMPARATIVE CHALLENGE', 'eyebrow'));
heading('h1', 'BUILD YOUR WORLD');
screen.append(node('p', 'Complete challenges to unlock designs and build your own world!', 'intro'));
screen.append(button('PLAY', start, 'primary'));
