
import { GoogleGenAI, Type } from "@google/genai";
import type { NewsItem } from '../types';

export const translateNewsItems = async (items: NewsItem[], ai: GoogleGenAI): Promise<NewsItem[]> => {
  if (!items.length) return [];
  const translatedItems: NewsItem[] = [...items];

  const translationSchema = {
    type: Type.OBJECT,
    properties: {
      translatedTitle: {
        type: Type.STRING,
        description: "The translated title in Brazilian Portuguese.",
      },
      translatedDescription: {
        type: Type.STRING,
        description: "The translated description in Brazilian Portuguese.",
      },
    },
    required: ["translatedTitle", "translatedDescription"],
  };

  const processItem = async (item: NewsItem): Promise<NewsItem> => {
    const fullPrompt = `
      Translate the following news title and description to Brazilian Portuguese.
      Return the result as a JSON object with 'translatedTitle' and 'translatedDescription' keys.
      ---
      Title: ${item.title}
      Description: ${item.description}
      ---
    `;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: translationSchema,
        },
      });

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);

      if (result.translatedTitle && result.translatedDescription) {
        return { ...item, title: result.translatedTitle, description: result.translatedDescription };
      }
      return item;
    } catch (error) {
      console.error(`Error translating item ID ${item.id}:`, error);
      return item; // Return original on error
    }
  };
  
  // Process items in batches to avoid overwhelming the API
  const batchSize = 5;
  for (let i = 0; i < translatedItems.length; i += batchSize) {
      const batch = translatedItems.slice(i, i + batchSize);
      const processedBatch = await Promise.all(batch.map(processItem));
      for (let j = 0; j < processedBatch.length; j++) {
          translatedItems[i + j] = processedBatch[j];
      }
  }

  return translatedItems;
};


export const summarizeNewsItems = async (items: NewsItem[], prompt: string, ai: GoogleGenAI): Promise<NewsItem[]> => {
  const summarizedItems: NewsItem[] = [...items];

  const summarySchema = {
    type: Type.OBJECT,
    properties: {
      bullets: {
        type: Type.ARRAY,
        description: "An array of strings, where each string is a summary bullet point.",
        items: {
          type: Type.STRING,
        },
      },
    },
    required: ["bullets"],
  };

  const processItem = async (item: NewsItem): Promise<NewsItem> => {
    const fullPrompt = `
      ${prompt}
      ---
      Notícia para resumir:
      Título: ${item.title}
      Fonte: ${item.sourceName}
      Descrição: ${item.description}
      ---
      Forneça a resposta no formato JSON com uma chave "bullets".
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: summarySchema,
        },
      });

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);
      
      if (result.bullets && Array.isArray(result.bullets)) {
        return { ...item, bullets: result.bullets };
      }
      return item; // Return original if parsing fails
    } catch (error) {
      console.error(`Error summarizing item ID ${item.id}:`, error);
      return item; // Return original on error
    }
  };

  // Process items in batches to avoid overwhelming the API
  const batchSize = 5;
  for (let i = 0; i < summarizedItems.length; i += batchSize) {
      const batch = summarizedItems.slice(i, i + batchSize);
      const processedBatch = await Promise.all(batch.map(processItem));
      for (let j = 0; j < processedBatch.length; j++) {
          summarizedItems[i + j] = processedBatch[j];
      }
  }

  return summarizedItems;
};
