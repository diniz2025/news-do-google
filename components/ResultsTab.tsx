
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { NewsItem } from '../types';
import Card from './Card';
import Badge from './Badge';
import Label from './Label';
import Input from './Input';
import Button from './Button';

const CUSTOM_TAGS_STORAGE_KEY = 'dcg-news-custom-tags';

interface NewsItemCardProps {
    item: NewsItem;
    customTags: string[];
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
}

const NewsItemCard: React.FC<NewsItemCardProps> = ({ item, customTags, onAddTag, onRemoveTag }) => {
    const [newTag, setNewTag] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTag = newTag.trim();
        if (trimmedTag) {
            onAddTag(trimmedTag);
            setNewTag('');
        }
    };

    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white h-full flex flex-col">
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-800 hover:text-slate-950 transition-colors">
            {item.title}
            </a>
            <div className="mt-1 text-xs text-slate-500">
            {item.date ? new Date(item.date).toLocaleString() : 'Data desconhecida'} — {item.sourceName}
            </div>
            
            {item.bullets && item.bullets.length > 0 ? (
                <ul className="mt-3 text-sm text-slate-700 space-y-1 list-disc list-inside flex-grow">
                    {item.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                    ))}
                </ul>
            ) : (
                <p className="mt-3 text-sm text-slate-600 line-clamp-4 flex-grow">
                    {item.description}
                </p>
            )}
            
            <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                    <Badge key={tag} tone="subtle">{tag}</Badge>
                ))}
                {customTags.map((tag) => (
                    <Badge key={tag} tone="info">
                        {tag}
                        <button 
                            onClick={() => onRemoveTag(tag)} 
                            className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-sky-200 transition-colors"
                            aria-label={`Remove tag ${tag}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </Badge>
                ))}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-3">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input 
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Adicionar tag..."
                        className="!py-1.5 text-xs"
                    />
                    <Button type="submit" size="small" disabled={!newTag.trim()}>Adicionar</Button>
                </form>
            </div>
        </div>
    );
};


const ResultsTab: React.FC<{ results: NewsItem[] }> = ({ results }) => {
  const [tagFilter, setTagFilter] = useState<string>("");
  const [customTags, setCustomTags] = useState<Record<string, string[]>>({});

  useEffect(() => {
    try {
        const storedTags = localStorage.getItem(CUSTOM_TAGS_STORAGE_KEY);
        if (storedTags) {
            setCustomTags(JSON.parse(storedTags));
        }
    } catch (e) {
        console.error("Failed to parse custom tags from localStorage", e);
    }
  }, []);

  const updateCustomTags = useCallback((newTags: Record<string, string[]>) => {
      setCustomTags(newTags);
      try {
          localStorage.setItem(CUSTOM_TAGS_STORAGE_KEY, JSON.stringify(newTags));
      } catch (e) {
          console.error("Failed to save custom tags to localStorage", e);
      }
  }, []);

  const addCustomTag = useCallback((itemId: string, tag: string) => {
    const newTags = { ...customTags };
    const currentTags = newTags[itemId] || [];
    if (!currentTags.includes(tag)) {
        newTags[itemId] = [...currentTags, tag];
        updateCustomTags(newTags);
    }
  }, [customTags, updateCustomTags]);

  const removeCustomTag = useCallback((itemId: string, tag: string) => {
    const newTags = { ...customTags };
    const currentTags = newTags[itemId] || [];
    newTags[itemId] = currentTags.filter(t => t !== tag);
    updateCustomTags(newTags);
  }, [customTags, updateCustomTags]);


  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const r of results) r.tags.forEach((t) => s.add(t));
    return Array.from(s.values()).sort();
  }, [results]);

  const filteredResults = useMemo(() => {
    if (!tagFilter) return results;
    return results.filter((r) => r.tags.includes(tagFilter));
  }, [results, tagFilter]);

  return (
    <Card title="Resultados (Última execução)">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Badge tone="info">Total: {filteredResults.length}</Badge>
        <div>
          <Label htmlFor="tag-filter" className="sr-only">Filtrar por tag</Label>
          <select
            id="tag-filter"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="border border-gray-200 rounded-lg py-1 px-2 text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
          >
            <option value="">Filtrar por tag...</option>
            {allTags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-slate-500 text-center py-8">Sem itens. Clique em “Buscar agora” para iniciar.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredResults.map((it) => (
            <NewsItemCard 
                key={it.id} 
                item={it} 
                customTags={customTags[it.id] || []}
                onAddTag={(tag) => addCustomTag(it.id, tag)}
                onRemoveTag={(tag) => removeCustomTag(it.id, tag)}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default ResultsTab;
