import type { ArgumentMap, ArgumentNode } from "./types";
import type { Argument } from "./types";

/**
 * Build argument map from structured argument
 */
export function buildArgumentMap(argument: Argument): ArgumentMap {
  const nodes: ArgumentNode[] = [];
  const edges: Array<{ from: string; to: string; type: "support" | "attack" }> =
    [];

  // Create nodes for premises
  argument.premises.forEach((premise, index) => {
    const node: ArgumentNode = {
      id: premise.id,
      type: "premise",
      text: premise.text,
      x: 100 + (index % 3) * 200,
      y: 100 + Math.floor(index / 3) * 150,
      connections: [],
    };
    nodes.push(node);
  });

  // Create node for conclusion
  const conclusionNode: ArgumentNode = {
    id: "conclusion",
    type: "conclusion",
    text: argument.conclusion.text,
    x: 400,
    y: 400,
    connections: [],
  };
  nodes.push(conclusionNode);

  // Create edges from premises to conclusion
  argument.premises.forEach((premise) => {
    edges.push({
      from: premise.id,
      to: "conclusion",
      type: "support",
    });
  });

  const clarityScore = scoreClarity({ nodes, edges });

  return {
    nodes,
    edges,
    clarityScore,
  };
}

/**
 * Score argument map clarity
 */
export function scoreClarity(map: ArgumentMap): number {
  let score = 100;

  // Deduct for too many nodes
  if (map.nodes.length > 10) {
    score -= (map.nodes.length - 10) * 5;
  }

  // Deduct for disconnected nodes
  const connectedNodes = new Set<string>();
  map.edges.forEach((edge) => {
    connectedNodes.add(edge.from);
    connectedNodes.add(edge.to);
  });
  const disconnected = map.nodes.filter(
    (node) => !connectedNodes.has(node.id)
  ).length;
  score -= disconnected * 10;

  // Deduct for too many edges from one node
  const edgeCounts: Record<string, number> = {};
  map.edges.forEach((edge) => {
    edgeCounts[edge.from] = (edgeCounts[edge.from] || 0) + 1;
  });
  Object.values(edgeCounts).forEach((count) => {
    if (count > 5) {
      score -= (count - 5) * 3;
    }
  });

  return Math.max(0, Math.min(100, score));
}

/**
 * Cluster nodes by proximity
 */
export function clusterNodes(nodes: ArgumentNode[]): ArgumentNode[][] {
  const clusters: ArgumentNode[][] = [];
  const visited = new Set<string>();

  nodes.forEach((node) => {
    if (visited.has(node.id)) return;

    const cluster: ArgumentNode[] = [node];
    visited.add(node.id);

    // Find nearby nodes
    nodes.forEach((otherNode) => {
      if (visited.has(otherNode.id)) return;

      const distance = Math.sqrt(
        Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
      );

      if (distance < 200) {
        cluster.push(otherNode);
        visited.add(otherNode.id);
      }
    });

    clusters.push(cluster);
  });

  return clusters;
}
