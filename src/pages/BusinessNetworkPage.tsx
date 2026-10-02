import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  ReactFlowInstance
} from 'reactflow';
import { networkApi } from '../services/api';
import { CustomNode } from '../components/graph/CustomNode';
import { NodeDetailDrawer } from '../components/common/NodeDetailDrawer';
import { NodeDetail } from '../types';
import { Network, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BusinessNetworkPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const navigate = useNavigate();

  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const data = await networkApi.getGraph();
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } catch (err) {
        console.error("Failed to load network graph:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [setNodes, setEdges]);

  // Fit to viewport when nodes load
  useEffect(() => {
    if (rfInstance && nodes.length > 0) {
      setTimeout(() => {
        rfInstance.fitView({ padding: 0.15, maxZoom: 1.0 });
      }, 50);
    }
  }, [rfInstance, nodes]);

  const handleFitView = useCallback(() => {
    if (rfInstance) {
      rfInstance.fitView({ padding: 0.15, maxZoom: 1.0, duration: 400 });
    }
  }, [rfInstance]);

  const onNodeClick = useCallback(async (_: React.MouseEvent, node: Node) => {
    try {
      const detail = await networkApi.getNodeDetail(node.id);
      setSelectedNode(detail);
      setIsDrawerOpen(true);
    } catch (e) {
      console.error("Error loading node detail:", e);
    }
  }, []);

  const filteredNodes = useMemo(() => {
    if (filterType === 'ALL') return nodes;
    return nodes.filter(n => n.data.nodeType === filterType);
  }, [nodes, filterType]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col relative bg-surface-100 overflow-hidden">
      {/* Top Controls Bar */}
      <div className="bg-white border-b border-surface-300 px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-10 shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-brand-950 flex items-center space-x-2">
              <Network className="w-4 h-4 text-brand-600" />
              <span>Business Dependency Graph</span>
            </h1>
          </div>
        </div>

        {/* Compact Filters & Fit to View */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1 bg-surface-50 p-1 rounded-lg border border-surface-200">
            {['ALL', 'Facility', 'ProductionLine', 'SKU', 'Equipment', 'Supplier', 'Route'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  filterType === f
                    ? 'bg-brand-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-surface-100'
                }`}
              >
                {f === 'ALL' ? 'All' : f}
              </button>
            ))}
          </div>

          <button
            onClick={handleFitView}
            title="Fit graph to view"
            className="px-2.5 py-1.5 bg-white hover:bg-surface-50 text-slate-700 border border-surface-300 rounded-lg text-[11px] font-semibold flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Fit to View</span>
          </button>
        </div>
      </div>

      {/* React Flow Workspace */}
      <div className="flex-1 w-full h-full relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-slate-600">Building Dependency Graph...</p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            onInit={(instance) => setRfInstance(instance)}
            fitView
            fitViewOptions={{ padding: 0.15, maxZoom: 1.0 }}
            minZoom={0.4}
            maxZoom={1.5}
            className="bg-[#F8FAF9]"
          >
            <Background color="#CBD5E1" gap={20} size={1} />
            <Controls className="!bg-white !border !border-surface-300 !shadow-xs !rounded-lg" />
            <MiniMap
              nodeColor={(node) => {
                if (node.data?.currentRisk >= 0.7) return '#D97706';
                if (node.data?.currentRisk >= 0.4) return '#F59E0B';
                return '#167A5B';
              }}
              className="!border !border-surface-300 !rounded-xl !bg-white/90"
            />
          </ReactFlow>
        )}

        {/* Compact Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-surface-300 shadow-sm z-10 text-[11px] text-slate-700 flex items-center space-x-4 pointer-events-auto">
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Operational</span>
          </div>
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>At Risk / Stress</span>
          </div>
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="w-4 h-0.5 bg-amber-600 border-dashed"></span>
            <span>Critical Path</span>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      <NodeDetailDrawer
        node={selectedNode}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSimulateNode={(nodeId) => {
          setIsDrawerOpen(false);
          navigate(`/simulator?target=${nodeId}`);
        }}
      />
    </div>
  );
};
