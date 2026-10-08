"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Folder,
  Gavel,
  Globe,
  Home,
  Info,
  MapPin,
  Minus,
  Network,
  Plus,
  Settings,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HierarchyTreeNode, OrgNodeType } from "@/types/tenant-creation";

function getNodeTypeConfig(type: string) {
  switch (type) {
    case "Authority":
      return { icon: Gavel, bg: "bg-[#fee2e2]", color: "text-[#ef4444]", display: "Authority" };
    case "Head Office":
      return { icon: Building2, bg: "bg-[#dbeafe]", color: "text-[#3b82f6]", display: "Head Office" };
    case "Wing / Cost Centers":
    case "Wing / Cost Center":
      return { icon: Folder, bg: "bg-[#fef3c7]", color: "text-[#d97706]", display: "Wing / Cost Center" };
    case "Operations":
      return { icon: Settings, bg: "bg-[#e0f2fe]", color: "text-[#0284c7]", display: "Operations" };
    case "Region / Division":
      return { icon: Globe, bg: "bg-[#f3e8ff]", color: "text-[#9333ea]", display: "Region / Division" };
    case "District":
      return { icon: MapPin, bg: "bg-[#fee2e2]", color: "text-[#dc2626]", display: "District" };
    case "Tehsil":
      return { icon: Home, bg: "bg-[#d1fae5]", color: "text-[#059669]", display: "Tehsil" };
    case "Field Service":
      return { icon: Truck, bg: "bg-[#f1f5f9]", color: "text-[#475569]", display: "Field Service" };
    default:
      return { icon: Folder, bg: "bg-[#fef3c7]", color: "text-[#d97706]", display: type };
  }
}

interface StepOrgHierarchyProps {
  treeData: HierarchyTreeNode[];
  onSaveNode: (node: HierarchyTreeNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onBack: () => void;
  onSkip: () => void;
  onContinue: () => void;
}

export function StepOrgHierarchy({
  treeData,
  onSaveNode,
  onDeleteNode,
  onBack,
  onSkip,
  onContinue,
}: StepOrgHierarchyProps) {
  const [expandedNodeIds, setExpandedNodeIds] = useState<Record<string, boolean>>({
    bor: true,
    plra: true,
    "head-office": true,
    ops: true,
    "north-region": true,
    "district-1": true,
    "tehsil-1": true,
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [nodeFormData, setNodeFormData] = useState<{
    id: string;
    name: string;
    type: OrgNodeType;
    code: string;
    status: "Pending" | "Active" | "Inactive";
    parentId: string | "";
  }>({
    id: "",
    name: "New node",
    type: "Wing / Cost Centers",
    code: "",
    status: "Pending",
    parentId: "",
  });

  const flatNodes = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    function traverse(nodes: HierarchyTreeNode[]) {
      for (const n of nodes) {
        list.push({ id: n.id, name: n.name });
        if (n.children && n.children.length > 0) traverse(n.children);
      }
    }
    traverse(treeData);
    return list;
  }, [treeData]);

  function toggleExpand(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setExpandedNodeIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleAddNodeClick(parentId: string = "") {
    setNodeFormData({
      id: `node-${Date.now()}`,
      name: "New node",
      type: "Wing / Cost Centers",
      code: "",
      status: "Pending",
      parentId: parentId || (flatNodes.length > 0 ? flatNodes[0].id : ""),
    });
    setSelectedNodeId(null);
    setIsEditorOpen(true);
  }

  function handleSelectNode(node: HierarchyTreeNode) {
    setSelectedNodeId(node.id);
    setNodeFormData({
      id: node.id,
      name: node.name,
      type: (node.type as OrgNodeType) || "Wing / Cost Centers",
      code: node.code || "",
      status: node.status || "Active",
      parentId: node.parentId || "",
    });
    setIsEditorOpen(true);
  }

  function handleSave() {
    const newNode: HierarchyTreeNode = {
      id: nodeFormData.id || `node-${Date.now()}`,
      name: nodeFormData.name.trim() || "Untitled Node",
      type: nodeFormData.type,
      code: nodeFormData.code.trim() || "N/A",
      status: nodeFormData.status,
      parentId: nodeFormData.parentId || null,
      children: [],
    };
    onSaveNode(newNode);
    if (newNode.parentId) {
      setExpandedNodeIds((prev) => ({ ...prev, [newNode.parentId!]: true }));
    }
    setSelectedNodeId(newNode.id);
  }

  function handleDelete() {
    if (nodeFormData.id) {
      onDeleteNode(nodeFormData.id);
      setIsEditorOpen(false);
      setSelectedNodeId(null);
    }
  }

  function renderTreeNode(node: HierarchyTreeNode, depth: number = 0) {
    const isExpanded = expandedNodeIds[node.id] ?? false;
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isSelected = selectedNodeId === node.id;
    const typeConfig = getNodeTypeConfig(node.type);
    const NodeIcon = typeConfig.icon;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => handleSelectNode(node)}
          style={{ paddingLeft: `${depth * 20 + 4}px` }}
          className={`group flex items-center justify-between rounded-lg py-1.5 pr-3 transition cursor-pointer ${
            isSelected ? "bg-[#e8f4fc] ring-1 ring-[#36a9e1]" : "hover:bg-[#f6f9fc]"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              onClick={(e) => hasChildren && toggleExpand(node.id, e)}
              className={`flex size-4 shrink-0 items-center justify-center text-[#697386] transition ${
                hasChildren ? "cursor-pointer hover:text-[#101d3b]" : "opacity-0 pointer-events-none"
              }`}
            >
              {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </span>

            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${typeConfig.bg} ${typeConfig.color}`}
            >
              <NodeIcon className="size-4" />
            </span>

            <span className="truncate text-xs font-semibold text-[#101d3b] sm:text-sm">
              {node.name}
            </span>
          </div>

          <span className="shrink-0 text-xs text-[#828894] font-medium ml-2">
            {typeConfig.display}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="relative mt-0.5 space-y-0.5">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* LEFT PANEL: Node tree */}
        <div className="flex flex-col min-h-[580px] rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)] border border-[#e8ecf2]">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#101d3b]">Node tree</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddNodeClick()}
                className="flex items-center gap-1.5 rounded-lg bg-[#f0f4f9] px-3.5 py-1.5 text-xs font-semibold text-[#101d3b] hover:bg-[#e3ebf6] transition shadow-2xs cursor-pointer"
              >
                <Plus className="size-3.5" />
                Add node
              </button>
              <button
                type="button"
                onClick={() => {
                  const anyOpen = Object.values(expandedNodeIds).some(Boolean);
                  setExpandedNodeIds(
                    Object.keys(expandedNodeIds).reduce((acc, key) => {
                      acc[key] = !anyOpen;
                      return acc;
                    }, {} as Record<string, boolean>)
                  );
                }}
                className="flex size-7 items-center justify-center rounded-lg text-[#697386] hover:bg-[#f0f4f9] transition cursor-pointer"
              >
                <Minus className="size-3.5" />
              </button>
            </div>
          </div>

          {treeData.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <button
                type="button"
                onClick={() => handleAddNodeClick()}
                className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#697386] hover:bg-[#e4ebf5] hover:text-[#101d3b] transition cursor-pointer"
              >
                <Plus className="size-5" />
              </button>
              <p className="text-sm font-medium text-[#647087]">
                Select a node to edit, or add a new one
              </p>
            </div>
          ) : (
            <div className="flex-1 space-y-1 overflow-y-auto max-h-[520px] pr-1">
              {treeData.map((node) => renderTreeNode(node, 0))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: New node / Node Editor */}
        <div className="flex flex-col min-h-[580px] rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)] border border-[#e8ecf2] transition-all duration-300">
          {!isEditorOpen ? (
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#f0f4f9] text-[#697386]">
                <Network className="size-5" />
              </div>
              <p className="text-sm font-medium text-[#647087]">
                Select a node to edit, or add a new one
              </p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-between animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#f0f3f6] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fef3c7] text-[#d97706]">
                      <Folder className="size-5" />
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-[#101d3b]">
                        {nodeFormData.name || "New node"}
                      </h4>
                      <p className="text-xs text-[#647087]">
                        wing · {nodeFormData.parentId ? "child node" : "root node"}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 rounded-full border border-[#fde68a] bg-[#fffbeb] px-2.5 py-0.5 text-xs font-semibold text-[#b45309]">
                    <span className="size-1.5 rounded-full bg-[#b45309]" />
                    {nodeFormData.status}
                  </span>
                </div>

                <div className="space-y-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#939baa]">
                    Node Details
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-[#51586a]">Node name</Label>
                      <Input
                        value={nodeFormData.name}
                        onChange={(e) =>
                          setNodeFormData({ ...nodeFormData, name: e.target.value })
                        }
                        placeholder="New node"
                        className="h-9 rounded-md border-[#d7e6ed] bg-white px-2.5 text-sm text-[#4b5568] focus-visible:border-[#36a9e1]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="hierarchy-node-type" className="text-xs font-semibold text-[#51586a]">Type</Label>
                      <Select
                        value={nodeFormData.type}
                        onValueChange={(value) => {
                          if (value !== null) {
                            setNodeFormData({
                              ...nodeFormData,
                              type: value as OrgNodeType,
                            });
                          }
                        }}
                      >
                        <SelectTrigger id="hierarchy-node-type" className="h-9 w-full rounded-md border-[#d7e6ed] bg-white px-2.5 text-xs text-[#4b5568] sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Authority">Authority</SelectItem>
                          <SelectItem value="Head Office">Head Office</SelectItem>
                          <SelectItem value="Wing / Cost Centers">Wing / Cost Centers</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Region / Division">Region / Division</SelectItem>
                          <SelectItem value="District">District</SelectItem>
                          <SelectItem value="Tehsil">Tehsil</SelectItem>
                          <SelectItem value="Field Service">Field Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="hierarchy-parent-node" className="text-xs font-semibold text-[#51586a]">
                      + Add A Parent Node
                    </Label>
                    <Select
                      value={nodeFormData.parentId || null}
                      onValueChange={(value) =>
                        setNodeFormData({
                          ...nodeFormData,
                          parentId: value ?? "",
                        })
                      }
                    >
                      <SelectTrigger id="hierarchy-parent-node" className="h-9 w-full rounded-md border-[#d7e6ed] bg-white px-2.5 text-xs text-[#4b5568] sm:text-sm">
                        <SelectValue placeholder="None (Top-Level Root Node)" />
                      </SelectTrigger>
                      <SelectContent>
                        {flatNodes.map((fn) => (
                          <SelectItem key={fn.id} value={fn.id}>
                            {fn.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-[#51586a]">Code / ID</Label>
                      <Input
                        placeholder="e.g. BOR-001"
                        value={nodeFormData.code}
                        onChange={(e) =>
                          setNodeFormData({ ...nodeFormData, code: e.target.value })
                        }
                        className="h-9 rounded-md border-[#d7e6ed] bg-white px-2.5 text-sm text-[#4b5568] focus-visible:border-[#36a9e1]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="hierarchy-node-status" className="text-xs font-semibold text-[#51586a]">Status</Label>
                      <Select
                        value={nodeFormData.status}
                        onValueChange={(value) => {
                          if (
                            value === "Pending" ||
                            value === "Active" ||
                            value === "Inactive"
                          ) {
                            setNodeFormData({
                              ...nodeFormData,
                              status: value,
                            });
                          }
                        }}
                      >
                        <SelectTrigger id="hierarchy-node-status" className="h-9 w-full rounded-md border-[#d7e6ed] bg-white px-2.5 text-xs text-[#4b5568] sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#939baa]">
                    Parent Nodes
                  </p>
                  <div className="flex items-start gap-2.5 rounded-lg border border-[#cbe5fb] bg-[#f0f8ff] p-3 text-xs text-[#1e608f]">
                    <Info className="size-4 shrink-0 mt-0.5 text-[#36a9e1]" />
                    <p className="leading-relaxed">
                      A node can have multiple parents - useful for shared units like field
                      services that report to multiple tehsils.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#939baa]">
                    Children (0)
                  </p>
                  <p className="text-xs text-[#939baa]">No children yet</p>
                  <button
                    type="button"
                    onClick={() => handleAddNodeClick(nodeFormData.id)}
                    className="flex items-center gap-1.5 rounded-md border border-[#d7e6ed] bg-white px-3 py-1.5 text-xs font-semibold text-[#26344f] hover:bg-[#f5f7fa] transition shadow-2xs cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    Add Child Node
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#f0f3f6] pt-4 mt-6">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Delete
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="rounded-md border border-[#d7e6ed] bg-white px-3.5 py-1.5 text-xs font-medium text-[#26344f] hover:bg-[#f5f7fa] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-md bg-[#020d2b] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#142342] transition shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar from Image 1 */}
      <div className="flex items-center justify-between border-t border-slate-200/80 pt-4">
        <Button
          type="button"
          variant="outline"
          className="h-10 border-[#a8afbd] px-6 text-sm text-[#172440] hover:bg-[#f5f7fa]"
          onClick={onBack}
        >
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-[#d7e6ed] bg-white px-5 text-sm font-semibold text-[#26344f] hover:bg-[#f5f7fa]"
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            type="button"
            className="h-10 bg-[#020d2b] px-6 text-sm font-semibold text-white hover:bg-[#142342]"
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
