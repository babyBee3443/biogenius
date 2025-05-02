import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from '@/lib/utils'; // Import cn

interface BlockWrapperProps {
  blockId: string;
  blockType: string;
  blockNumber: number;
  children: React.ReactNode;
  onDelete: (id: string) => void;
  dragHandleRef: React.RefObject<HTMLButtonElement>;
  isSelected: boolean; // Is this block currently selected?
  onSelect: () => void; // Callback when this block wrapper is clicked
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({
  blockId,
  blockType,
  blockNumber,
  children,
  onDelete,
  dragHandleRef,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 mb-4 relative group bg-card shadow-sm transition-all duration-150 ease-in-out",
        {
          "border-primary ring-2 ring-primary/50 ring-offset-1 ring-offset-background": isSelected, // Highlight if selected
          "border-border hover:border-border/80": !isSelected // Default border
        }
      )}
      onClick={onSelect} // Select block when the wrapper area is clicked
      data-block-wrapper-id={blockId} // Add ID for scrolling target
    >
      {/* Controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          ref={dragHandleRef}
          variant="ghost"
          size="icon"
          className="h-7 w-7 cursor-grab"
          aria-label="Blok Taşı"
          onClick={(e) => e.stopPropagation()} // Prevent wrapper click when dragging
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:bg-destructive/10"
          onClick={(e) => {
             e.stopPropagation(); // Prevent wrapper click when deleting
             onDelete(blockId);
          }}
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
      <div onClick={(e) => e.stopPropagation()}> {/* Prevent clicks inside content from re-selecting */}
        {children}
      </div>
    </div>
  );
};

export default BlockWrapper;
