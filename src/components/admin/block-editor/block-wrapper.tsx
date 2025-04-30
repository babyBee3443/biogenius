
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GripVertical, Trash2 } from "lucide-react";

interface BlockWrapperProps {
  blockId: string;
  blockType: string;
  blockNumber: number;
  children: React.ReactNode;
  onDelete: (id: string) => void;
  dragHandleRef: React.RefObject<HTMLButtonElement>; // Ref for the drag handle
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({
  blockId,
  blockType,
  blockNumber,
  children,
  onDelete,
  dragHandleRef,
}) => {
  return (
    <div className="border border-border rounded-lg p-4 mb-4 relative group bg-card shadow-sm">
      {/* Controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {/* Drag Handle */}
        <Button
          ref={dragHandleRef}
          variant="ghost"
          size="icon"
          className="h-7 w-7 cursor-grab"
          aria-label="Blok Taşı"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(blockId)}
          aria-label="Blok Sil"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {/* Block Label */}
      <Label className="text-xs text-muted-foreground mb-2 block capitalize">
        {blockType} (Bölüm {blockNumber})
      </Label>
      {/* Block Content */}
      {children}
    </div>
  );
};

export default BlockWrapper;
