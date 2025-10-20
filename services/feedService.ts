
import type { NewsItem, Source } from '../types';

function parseDate(d?: string | null): number | undefined {
  if (!d) return undefined;
  const t = Date.parse(d);
  return Number.isNaN(t) ? undefined : t;
}

function classify(title: string, desc: string, sourceName: string): string[] {
  const text = `${title} ${desc} ${sourceName}`.toLowerCase();
  const tags = new Set<string>();
  if (/susep|superintend[eê]ncia de seguros/i.test(text) || text.includes("susep")) tags.add("Reguladores");
  if (/ans |ag[eê]ncia nacional de sa[úu]de/i.test(text) || text.includes("ans")) tags.add("Reguladores");
  if (/seguro|segurador|corretor|ap[óo]lice|sinistro|resseguro/i.test(text)) tags.add("Seguros");
  if (/plano de sa[úu]de|benef[ií]cios|operadora|rede credenciada/i.test(text)) tags.add("Planos");
  if (/insurtech|startup|plataforma|api|low\-code|no\-code|autom(a|á)tica|ia |intelig[êe]ncia artificial/i.test(text)) tags.add("Insurtech/IA");
  if (/hotel|restaurante|bar|fhoresp|sinhores|horeca/i.test(text)) tags.add("HORECA");
  if (tags.size === 0) tags.add("Geral");
  return Array.from(tags);
}

function uniqueKey(...parts: (string | number | undefined)[]) {
  return parts.filter(Boolean).join("::");
}

export function parseFeed(xmlText: string, source: Source): NewsItem[] {
  const dom = new DOMParser().parseFromString(xmlText, "text/xml");
  const isRSS = dom.querySelector("rss, channel, item");
  const isAtom = dom.querySelector("feed, entry");
  const items: NewsItem[] = [];

  const processNode = (it: Element, isRssNode: boolean, idx: number) => {
    const title = (it.querySelector("title")?.textContent || "").trim();
    let link: string;
    let desc: string;
    let date: number | undefined;

    if (isRssNode) {
        link = (it.querySelector("link")?.textContent || "").trim();
        desc = (it.querySelector("description")?.textContent || it.querySelector("content\\:encoded")?.textContent || "").trim();
        date = parseDate((it.querySelector("pubDate")?.textContent || it.querySelector("dc\\:date")?.textContent || "").trim());
    } else { // Atom
        const linkEl = it.querySelector("link[rel='alternate']") || it.querySelector("link");
        link = (linkEl?.getAttribute("href") || "").trim();
        desc = (it.querySelector("summary")?.textContent || it.querySelector("content")?.textContent || "").trim();
        date = parseDate((it.querySelector("updated")?.textContent || it.querySelector("published")?.textContent || "").trim());
    }

    if (!title || !link) return;

    const item: NewsItem = {
      id: uniqueKey(source.id, link) || uniqueKey(source.id, idx),
      title,
      link,
      description: desc.replace(/<[^>]+>/g, ""),
      date,
      sourceId: source.id,
      sourceName: source.name,
      tags: classify(title, desc, source.name),
    };
    items.push(item);
  };
  
  if (isRSS) {
    dom.querySelectorAll("item").forEach((it, idx) => processNode(it, true, idx));
  } else if (isAtom) {
    dom.querySelectorAll("entry").forEach((it, idx) => processNode(it, false, idx));
  }
  return items;
}

export function dedupeByLinkOrTitle(items: NewsItem[]): NewsItem[] {
  const byKey = new Map<string, NewsItem>();
  for (const it of items) {
    const key = (it.link || "") || it.title;
    if (!key) continue;
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, it);
    } else if ((it.date || 0) > (prev.date || 0)) {
      byKey.set(key, it);
    }
  }
  return Array.from(byKey.values());
}
