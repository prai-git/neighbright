// scripts/translate.js
// Build-time OpenAI translation script.
// Run with: npm run translate
// Requires: OPENAI_API_KEY in .env

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY not set in environment.');
  process.exit(1);
}

const LANGUAGES = {
  fr: {
    name: 'French',
    systemPrompt: `You are an expert translator specializing in pediatric speech therapy terminology. Translate the following JSON values from English to French. Keep JSON keys exactly the same. Keep {placeholder} variables unchanged. UI strings should be concise and natural in French, using the informal "tu" form appropriate for family contexts. Return ONLY valid JSON — no markdown, no explanation.`,
  },
};

const BATCH_SIZE = 50;

async function translateBatch(keys, values, langConfig) {
  const subset = {};
  keys.forEach((k, i) => { subset[k] = values[i]; });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [
        { role: 'system', content: langConfig.systemPrompt },
        { role: 'user', content: JSON.stringify(subset, null, 2) },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value, p));
    } else {
      result[p] = value;
    }
  }
  return result;
}

function unflattenObject(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

async function main() {
  const enPath = path.join(__dirname, '..', 'src', 'data', 'i18n', 'en.json');
  const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const flat = flattenObject(en);
  const keys = Object.keys(flat);
  const values = Object.values(flat);

  for (const [langCode, langConfig] of Object.entries(LANGUAGES)) {
    console.log(`\nTranslating to ${langConfig.name}...`);
    const allTranslated = {};

    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const batchKeys = keys.slice(i, i + BATCH_SIZE);
      const batchValues = values.slice(i, i + BATCH_SIZE);
      console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(keys.length / BATCH_SIZE)}`);

      const translated = await translateBatch(batchKeys, batchValues, langConfig);
      Object.assign(allTranslated, translated);

      // Rate limit pause between batches
      if (i + BATCH_SIZE < keys.length) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    const unflattened = unflattenObject(allTranslated);
    const outPath = path.join(__dirname, '..', 'src', 'data', 'i18n', `${langCode}.json`);
    fs.writeFileSync(outPath, JSON.stringify(unflattened, null, 2), 'utf-8');
    console.log(`  ✓ Written to ${outPath}`);
  }

  console.log('\nDone. Review the generated files before committing.');
}

main().catch((err) => {
  console.error('Translation failed:', err.message);
  process.exit(1);
});
