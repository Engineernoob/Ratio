/**
 * Ratio Knowledge Graph - Type Definitions
 */

export type NodeType =
  | "book"
  | "chapter"
  | "highlight"
  | "memoria"
  | "puzzle"
  | "argument"
  | "summary"
  | "note";

export type GraphTheme = "AUREA" | "SYNAPSE" | "GLACIES" | "CLASSICAL";

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  weight: number; // Importance weight (0-1)
  related: string[]; // IDs of related nodes
  metadata?: {
    bookId?: string;
    chapterId?: string;
    page?: number;
    author?: string;
    ease?: number;
    difficulty?: number;
    source?: string;
    content?: string;
    url?: string;
  };
  position?: {
    x: number;
    y: number;
  };
}

export interface GraphEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  type: "contains" | "references" | "related" | "derived" | "similar";
  strength: number; // Edge strength (0-1)
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface NodeDetail {
  node: GraphNode;
  connections: {
    incoming: GraphEdge[];
    outgoing: GraphEdge[];
    relatedNodes: GraphNode[];
  };
}
