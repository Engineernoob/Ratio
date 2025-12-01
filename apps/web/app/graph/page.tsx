"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TopNavBar } from "@/components/core/TopNavBar";
import { GraphShell } from "@/components/Graph/GraphShell";
import { GraphCanvas } from "@/components/Graph/GraphCanvas";
import { GraphSidebar } from "@/components/Graph/GraphSidebar";
import { NodeDetailComponent } from "@/components/Graph/NodeDetail";
import { EngravedHeader } from "@/components/core/EngravedHeader";
import { Main } from "@/components/Main";
import { loadGraphData } from "@/lib/graph/loader";
import type { GraphNode, GraphEdge, GraphTheme, NodeDetail } from "@/lib/graph/types";
import { useRouter } from "next/navigation";

export default function GraphPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<GraphTheme>("AUREA");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [nodeDetail, setNodeDetail] = useState<NodeDetail | null>(null);
  const router = useRouter();

  // Load graph data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadGraphData();
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (error) {
        console.error("Error loading graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update node detail when selection changes
  useEffect(() => {
    if (selectedNode) {
      const incoming = edges.filter((e) => e.target === selectedNode.id);
      const outgoing = edges.filter((e) => e.source === selectedNode.id);
      const relatedNodeIds = new Set([
        ...incoming.map((e) => e.source),
        ...outgoing.map((e) => e.target),
      ]);
      const relatedNodes = nodes.filter((n) => relatedNodeIds.has(n.id));

      setNodeDetail({
        node: selectedNode,
        connections: {
          incoming,
          outgoing,
          relatedNodes,
        },
      });
    } else {
      setNodeDetail(null);
    }
  }, [selectedNode, nodes, edges]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const handleOpenInReader = (node: GraphNode) => {
    if (node.metadata?.url) {
      router.push(node.metadata.url);
    }
  };

  const handleAddToMemoria = (node: GraphNode) => {
    // Navigate to memoria with pre-filled data
    router.push(`/memoria?add=${encodeURIComponent(node.id)}`);
  };

  const handleAnalyzeInArs = (node: GraphNode) => {
    router.push(`/ars-rationis?analyze=${encodeURIComponent(node.id)}`);
  };

  if (loading) {
    return (
      <>
        <TopNavBar />
        <Main>
          <GraphShell theme={theme}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div
                className="font-serif text-xl mb-4"
                style={{ color: "#C8B68D" }}
              >
                Loading Knowledge Graph...
              </div>
              <div
                className="font-mono text-sm opacity-60"
                style={{ color: "#C8B68D" }}
              >
                Mapping your learning network...
              </div>
            </div>
          </div>
        </GraphShell>
      </Main>
    </>
  );
  }

  return (
    <>
      <TopNavBar />
      <Main className="scroll-fade-top scroll-fade-bottom">
        <GraphShell theme={theme}>
          <div className="relative z-10 min-h-screen p-6 md:p-12">
            <div className="max-w-full mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-8"
              >
                <EngravedHeader level={1} delay={0.2}>
                  KNOWLEDGE GRAPH
                </EngravedHeader>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="font-mono text-sm mt-4"
                  style={{ color: "rgba(215, 196, 158, 0.6)" }}
                >
                  Visualize the connections in your learning journey
                </motion.p>
              </motion.div>

              {/* Graph Container */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative"
                style={{ height: "800px" }}
              >
                {/* Sidebar */}
                <GraphSidebar
                  theme={theme}
                  onThemeChange={setTheme}
                  nodeCount={nodes.length}
                  edgeCount={edges.length}
                  selectedNodeType={selectedNode?.type}
                />

                {/* Canvas */}
                <div
                  className="absolute left-64 right-96 top-0 bottom-0"
                  style={{ marginLeft: "1rem", marginRight: "1rem" }}
                >
                  <GraphCanvas
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={handleNodeClick}
                    theme={theme}
                    width={1200}
                    height={800}
                  />
                </div>

                {/* Node Detail */}
                <NodeDetailComponent
                  detail={nodeDetail}
                  onClose={() => setSelectedNode(null)}
                  onOpenInReader={handleOpenInReader}
                  onAddToMemoria={handleAddToMemoria}
                  onAnalyzeInArs={handleAnalyzeInArs}
                />
              </motion.div>
            </div>
          </div>
        </GraphShell>
      </Main>
    </>
  );
}
