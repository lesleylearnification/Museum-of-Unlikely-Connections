# Curator Task Specification

## Purpose

Given three historical exhibits chosen by the player, retrieve vetted information and return:

1. One accurate, interesting sentence about each item.
2. At least five possible cross-item relationships.
3. One concise, source-grounded curator paragraph.
4. A mini-library grouped by exhibit.
5. Source metadata and citations.

The curator presents **one defensible interpretation**, never a single correct answer.

## Input

```json
{
  "exhibits": [
    {
      "name": "Genghis Khan",
      "category": "Leader",
      "note": "Short local description",
      "date": "1206–1227",
      "tags": ["empire", "networks", "exchange", "mobility"]
    }
  ]
}
```

## Research priority

1. Peer-reviewed scholarship and academic books
2. University, archive, and museum collections
3. Major reference works
4. Government and international institutions
5. Primary sources or reputable translations
6. High-quality public history resources

Do not use a user-edited encyclopedia as the main evidence.

## Required process

For each exhibit:

- Verify identity, dates, and context.
- Retrieve at least three independent reputable sources.
- Include at least one scholarly or institutional source.
- Identify three historically meaningful themes.
- Note uncertainty or scholarly disagreement.

Across the three exhibits:

- Generate at least five possible relationships.
- Reject vague relationships such as “important” or “changed history.”
- Prefer shared processes, human needs, systems, tensions, consequences, or structures.
- Choose the relationship with the strongest support and highest curiosity value.
- Distinguish direct causation from interpretive similarity.

## Output

```json
{
  "itemNotes": [
    {
      "name": "Genghis Khan",
      "sentence": "One accurate and interesting sentence."
    }
  ],
  "connectionTitle": "Knowledge at scale",
  "connectionParagraph": "A 90–150 word museum-quality paragraph.",
  "themes": ["knowledge networks", "coordination", "authority"],
  "library": [
    {
      "name": "Genghis Khan",
      "summary": "A 70–120 word summary.",
      "date": "1206–1227",
      "category": "Leader",
      "icon": "🏇",
      "sources": [
        {
          "title": "Source title",
          "url": "https://...",
          "type": "Peer-reviewed article",
          "citation": "APA-style citation"
        }
      ]
    }
  ]
}
```

## Writing standards

- Write for curious older teens and adults.
- Avoid presentism and sweeping claims.
- Do not imply causation without support.
- Do not flatten contested history into false consensus.
- Make the connection specific enough that a reader could disagree intelligently.
- Never grade the player’s interpretation.
