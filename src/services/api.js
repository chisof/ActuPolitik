import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

const NEWSAPI_KEY = process.env.REACT_APP_NEWSAPI_KEY;
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.REACT_APP_OPENAI_KEY }));

const sources = [
  { id: 'reuters', name: 'Reuters', api: `https://newsapi.org/v2/top-headlines?sources=reuters&apiKey=${NEWSAPI_KEY}` },
  { id: 'aljazeera', name: 'Al Jazeera', api: `https://newsapi.org/v2/top-headlines?sources=al-jazeera-english&apiKey=${NEWSAPI_KEY}` },
  { id: 'france24', name: 'France 24', api: `https://newsapi.org/v2/top-headlines?sources=france-24&apiKey=${NEWSAPI_KEY}` },
  { id: 'lemonde', name: 'Le Monde', api: `https://newsapi.org/v2/everything?domains=lemonde.fr&apiKey=${NEWSAPI_KEY}` },
  { id: 'cnn', name: 'CNN', api: `https://newsapi.org/v2/top-headlines?sources=cnn&apiKey=${NEWSAPI_KEY}` },
  { id: 'bbc', name: 'BBC News', api: `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${NEWSAPI_KEY}` },
  { id: 'tsa', name: 'TSA (Algérie)', api: `https://api.rss2json.com/v1/api.json?rss_url=https://www.tsa-algerie.com/feed/` },
  { id: 'elkhabar', name: 'El Khabar', api: `https://api.rss2json.com/v1/api.json?rss_url=https://www.elkhabar.com/rss/` },
];

export async function fetchFeeds() {
  const promises = sources.map(async s => {
    const res = await axios.get(s.api);
    const list = res.data.articles || res.data.items;
    return {
      id: s.id,
      name: s.name,
      articles: list.map(a => ({
        title: a.title,
        summary: a.description || a.contentSnippet,
        url: a.url || a.link
      }))
    };
  });
  return Promise.all(promises);
}

export async function aiSearch(query) {
  const response = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Tu es un assistant pour filtrer et résumer des flux d’actualité.' },
      { role: 'user', content: `Filtre ces articles selon: ${query}. Retourne un JSON liste d'objets {title, summary, url}.` }
    ]
  });
  try {
    return JSON.parse(response.data.choices[0].message.content);
  } catch {
    return [];
  }
}

export async function aiClassify(articles) {
  const prompt = `Tu es un expert en pertinence d'actualités.
Pour chaque article fourni (titre, résumé, url), classe-le selon sa pertinence politique pour un profil de décideur, en catégories: Très élevée, Élevée, Moyenne, Faible.
Retourne un JSON liste d'objets {title, summary, url, relevanceCategory}.`;
  const content = articles.map(a => ({ title: a.title, summary: a.summary, url: a.url, source: a.source }));
  const res = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Tu es un assistant pour classer la pertinence des articles.' },
      { role: 'user', content: `${prompt}
Articles: ${JSON.stringify(content)}` }
    ],
    max_tokens: 2000
  });
  try {
    return JSON.parse(res.data.choices[0].message.content);
  } catch {
    return articles.map(a => ({ ...a, relevanceCategory: 'Moyenne' }));
  }
}
