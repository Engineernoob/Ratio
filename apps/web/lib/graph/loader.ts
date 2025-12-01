/**
 * Ratio Knowledge Graph - Data Loader
 * Merges data from multiple sources into a unified graph
 */

import type { GraphNode, GraphEdge, GraphData } from "./types";

/**
 * Load and merge graph data from all sources
 */
export async function loadGraphData(): Promise<GraphData> {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Map<string, GraphNode>();

  try {
    // Load books
    const bookNodes = await loadBookNodes();
    bookNodes.forEach((node) => {
      nodes.push(node);
      nodeMap.set(node.id, node);
    });

    // Load memoria cards
    const memoriaNodes = await loadMemoriaNodes();
    memoriaNodes.forEach((node) => {
      nodes.push(node);
      nodeMap.set(node.id, node);
    });

    // Load puzzles
    const puzzleNodes = await loadPuzzleNodes();
    puzzleNodes.forEach((node) => {
      nodes.push(node);
      nodeMap.set(node.id, node);
    });

    // Load summaries
    const summaryNodes = await loadSummaryNodes();
    summaryNodes.forEach((node) => {
      nodes.push(node);
      nodeMap.set(node.id, node);
    });

    // Generate edges based on relationships
    const generatedEdges = generateEdges(nodes, nodeMap);
    edges.push(...generatedEdges);

    return { nodes, edges };
  } catch (error) {
    console.error("Error loading graph data:", error);
    return { nodes: [], edges: [] };
  }
}

/**
 * Load book nodes
 */
async function loadBookNodes(): Promise<GraphNode[]> {
  const nodes: GraphNode[] = [];
  const bookIds = ["meditations", "AtomicHabits"];

  for (const bookId of bookIds) {
    try {
      const res = await fetch(`/api/books/${bookId}?action=manifest`);
      if (res.ok) {
        const book = await res.json();

        // Book node
        const bookNode: GraphNode = {
          id: `book-${bookId}`,
          type: "book",
          label: book.title,
          weight: 0.9,
          related: [],
          metadata: {
            bookId: book.id,
            author: book.author,
            url: `/reader/${bookId}`,
          },
        };
        nodes.push(bookNode);

        // Chapter nodes
        if (book.chapters && Array.isArray(book.chapters)) {
          book.chapters.forEach((chapter: any, index: number) => {
            const chapterNode: GraphNode = {
              id: `chapter-${bookId}-${chapter.id}`,
              type: "chapter",
              label: chapter.title || `Chapter ${index + 1}`,
              weight: 0.7 - index * 0.05, // Decreasing weight for later chapters
              related: [`book-${bookId}`],
              metadata: {
                bookId: book.id,
                chapterId: chapter.id,
                url: `/reader/${bookId}?chapter=${chapter.id}`,
              },
            };
            nodes.push(chapterNode);
            bookNode.related.push(chapterNode.id);
          });
        }
      }
    } catch (error) {
      console.error(`Error loading book ${bookId}:`, error);
    }
  }

  return nodes;
}

/**
 * Load memoria card nodes
 */
async function loadMemoriaNodes(): Promise<GraphNode[]> {
  const nodes: GraphNode[] = [];

  try {
    const res = await fetch("/api/memoria/cards");
    if (res.ok) {
      const { cards } = await res.json();
      if (cards && Array.isArray(cards)) {
        cards.slice(0, 50).forEach((card: any) => {
          // Only include cards with low ease (struggling) or high ease (mastered)
          if (card.ease < 2.0 || card.ease > 2.3) {
            const node: GraphNode = {
              id: `memoria-${card.id}`,
              type: "memoria",
              label:
                card.title || card.content?.substring(0, 50) || "Memory Card",
              weight: card.ease < 2.0 ? 0.6 : 0.4, // Higher weight for struggling cards
              related: [],
              metadata: {
                ease: card.ease,
                source: card.source,
                sourceId: card.sourceId,
                content: card.content,
                url: `/memoria`,
              },
            };

            // Link to source if available
            if (card.sourceId) {
              if (card.source === "bibliotheca" || card.source === "book") {
                node.related.push(`book-${card.sourceId}`);
              }
            }

            nodes.push(node);
          }
        });
      }
    }
  } catch (error) {
    console.error("Error loading memoria nodes:", error);
  }

  return nodes;
}

/**
 * Load puzzle nodes
 */
async function loadPuzzleNodes(): Promise<GraphNode[]> {
  const nodes: GraphNode[] = [];

  try {
    // Load from puzzles directory
    const res = await fetch("/api/puzzles");
    if (res.ok) {
      const data = await res.json();
      if (data.puzzles && Array.isArray(data.puzzles)) {
        data.puzzles.slice(0, 20).forEach((puzzle: any) => {
          const node: GraphNode = {
            id: `puzzle-${puzzle.id}`,
            type: "puzzle",
            label: puzzle.prompt?.substring(0, 50) || `Puzzle ${puzzle.id}`,
            weight: 0.5,
            related: [],
            metadata: {
              difficulty: puzzle.difficulty || 1,
              type: puzzle.type,
              url: `/laboratorivm`,
            },
          };
          nodes.push(node);
        });
      }
    }
  } catch (error) {
    console.error("Error loading puzzle nodes:", error);
  }

  return nodes;
}

/**
 * Load summary nodes
 */
async function loadSummaryNodes(): Promise<GraphNode[]> {
  const nodes: GraphNode[] = [];

  try {
    const res = await fetch(
      "/api/feed?date=" + new Date().toISOString().split("T")[0]
    );
    if (res.ok) {
      const data = await res.json();
      if (data.feed && Array.isArray(data.feed)) {
        data.feed
          .filter((item: any) => item.type === "book_summary")
          .slice(0, 10)
          .forEach((item: any) => {
            const node: GraphNode = {
              id: `summary-${item.id}`,
              type: "summary",
              label: item.title || "Book Summary",
              weight: 0.6,
              related: [],
              metadata: {
                source: item.source,
                content: item.content,
                url: `/bibliotheca`,
              },
            };
            nodes.push(node);
          });
      }
    }
  } catch (error) {
    console.error("Error loading summary nodes:", error);
  }

  return nodes;
}

/**
 * Generate edges between nodes based on relationships
 */
function generateEdges(
  nodes: GraphNode[],
  nodeMap: Map<string, GraphNode>
): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const edgeSet = new Set<string>();

  nodes.forEach((node) => {
    // Book -> Chapter edges
    if (node.type === "book") {
      node.related.forEach((relatedId) => {
        const edgeKey = `${node.id}-${relatedId}`;
        if (!edgeSet.has(edgeKey) && nodeMap.has(relatedId)) {
          edges.push({
            id: `edge-${edgeKey}`,
            source: node.id,
            target: relatedId,
            type: "contains",
            strength: 0.9,
          });
          edgeSet.add(edgeKey);
        }
      });
    }

    // Memoria -> Book/Chapter edges
    if (node.type === "memoria" && node.metadata?.sourceId) {
      const sourceId = node.metadata.sourceId;
      const bookNodeId = `book-${sourceId}`;
      if (nodeMap.has(bookNodeId)) {
        const edgeKey = `${node.id}-${bookNodeId}`;
        if (!edgeSet.has(edgeKey)) {
          edges.push({
            id: `edge-${edgeKey}`,
            source: node.id,
            target: bookNodeId,
            type: "references",
            strength: 0.7,
          });
          edgeSet.add(edgeKey);
        }
      }
    }

    // Similar nodes (same type, similar weight)
    if (node.type === "memoria") {
      nodes
        .filter(
          (n) =>
            n.type === "memoria" &&
            n.id !== node.id &&
            Math.abs(n.weight - node.weight) < 0.2
        )
        .slice(0, 2)
        .forEach((similarNode) => {
          const edgeKey = `${node.id}-${similarNode.id}`;
          if (!edgeSet.has(edgeKey)) {
            edges.push({
              id: `edge-${edgeKey}`,
              source: node.id,
              target: similarNode.id,
              type: "similar",
              strength: 0.3,
            });
            edgeSet.add(edgeKey);
          }
        });
    }
  });

  return edges;
}

/**
 * Calculate node importance based on connections
 */
export function calculateNodeImportance(
  node: GraphNode,
  edges: GraphEdge[]
): number {
  const connections = edges.filter(
    (e) => e.source === node.id || e.target === node.id
  ).length;
  return Math.min(1, node.weight + connections * 0.1);
}
