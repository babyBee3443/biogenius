
"use client";

import * as React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Type,
  Heading2,
  Image as ImageIcon,
  GalleryHorizontal,
  Video,
  Quote,
  Code,
  Minus,
  LayoutGrid, // Added icon for section
} from "lucide-react";
import type { Block } from "@/components/admin/template-selector";
import BlockWrapper from './block-wrapper';
import TextBlock from './text-block';
import HeadingBlock from './heading-block';
import ImageBlock from './image-block';
import QuoteBlock from './quote-block';
import DividerBlock from './divider-block';
import SectionBlock from './section-block'; // Import SectionBlock
import VideoBlock from './video-block'; // Import VideoBlock
import PlaceholderBlock from './placeholder-block';

const ItemTypes = {
  BLOCK: 'block',
};

interface DraggableBlockProps {
    block: Block;
    index: number;
    moveBlock: (dragIndex: number, hoverIndex: number) => void;
    onDelete: (id: string) => void;
    onUpdate: (block: Block) => void;
    isSelected: boolean; // Is this block currently selected?
    onSelect: (id: string | null) => void; // Callback to select this block (allow null)
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({
    block,
    index,
    moveBlock,
    onDelete,
    onUpdate,
    isSelected,
    onSelect,
 }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.BLOCK,
    item: () => ({ id: block.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // Simplified onChange handler - pass the whole block for complex updates
  const handleBlockChange = (id: string, value: any, field?: string, level?: number) => {
      const updatedBlock = { ...block };

      switch (block.type) {
          case 'text':
          case 'quote':
          case 'code': // Assuming simple content update for code for now
              updatedBlock.content = value;
              break;
          case 'heading':
              if (field === 'content') updatedBlock.content = value;
              if (field === 'level' && typeof value === 'number') updatedBlock.level = value;
              break;
          case 'image':
               if (field === 'url') updatedBlock.url = value;
               if (field === 'alt') updatedBlock.alt = value;
               if (field === 'caption') updatedBlock.caption = value;
               break;
           case 'video':
                if (field === 'url') updatedBlock.url = value;
                if (field === 'youtubeId') updatedBlock.youtubeId = value; // Handle youtubeId update
                break;
           case 'section':
               // Here, 'value' is expected to be the new settings object
               updatedBlock.settings = { ...updatedBlock.settings, ...value };
               break;
          // Handle gallery updates if needed
      }

      onUpdate(updatedBlock as Block);
  };


  return (
     <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} data-handler-id={handlerId} data-block-wrapper-id={block.id}>
        <BlockWrapper
            blockId={block.id}
            blockType={block.type}
            blockNumber={index + 1}
            onDelete={onDelete}
            dragHandleRef={preview}
            isSelected={isSelected} // Pass selection state
            onSelect={() => onSelect(block.id)} // Pass selection handler
        >
            {block.type === 'text' && <TextBlock block={block} onChange={handleBlockChange} />}
            {block.type === 'heading' && <HeadingBlock block={block} onChange={handleBlockChange} />}
            {block.type === 'image' && <ImageBlock block={block} onChange={handleBlockChange} />}
            {block.type === 'quote' && <QuoteBlock block={block} onChange={handleBlockChange} />}
            {block.type === 'video' && <VideoBlock block={block} onChange={handleBlockChange} />}
            {block.type === 'divider' && <DividerBlock />}
            {block.type === 'section' && <SectionBlock block={block} onChange={handleBlockChange} />}
            {(block.type === 'gallery' || block.type === 'code' ) && (
                 <PlaceholderBlock type={block.type} />
            )}
        </BlockWrapper>
     </div>
  );
};


interface BlockEditorProps {
  blocks: Block[];
  onAddBlock: (type: Block['type']) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (block: Block) => void;
  onReorderBlocks: (reorderedBlocks: Block[]) => void;
  selectedBlockId: string | null; // ID of the currently selected block
  onBlockSelect: (id: string | null) => void; // Callback when a block is selected (e.g., from preview)
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  blocks,
  onAddBlock,
  onDeleteBlock,
  onUpdateBlock,
  onReorderBlocks,
  selectedBlockId,
  onBlockSelect,
}) => {

  const moveBlock = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragBlock = blocks[dragIndex];
      const reordered = [...blocks];
      reordered.splice(dragIndex, 1);
      reordered.splice(hoverIndex, 0, dragBlock);
      onReorderBlocks(reordered);
    },
    [blocks, onReorderBlocks]
  );

  return (
     <DndProvider backend={HTML5Backend}>
       <div>
         <h2 className="text-lg font-semibold mb-1">Sayfa Bölümleri</h2>
         <p className="text-sm text-muted-foreground mb-4">İçeriğinizi veya sayfa yapısını düzenlemek için bölümler ekleyin ve sürükleyerek sıralayın.</p>

         <div
             className="space-y-4"
             onClick={(e) => {
                // Check if the click target is the background div itself
                 if (e.target === e.currentTarget) {
                     onBlockSelect(null);
                 }
             }} // Click outside blocks to deselect
         >
             {blocks.map((block, index) => (
                 <DraggableBlock
                    key={block.id}
                    block={block}
                    index={index}
                    moveBlock={moveBlock}
                    onDelete={onDeleteBlock}
                    onUpdate={onUpdateBlock}
                    isSelected={block.id === selectedBlockId} // Determine if selected
                    onSelect={onBlockSelect} // Pass handler
                />
             ))}
         </div>

         {/* Add Block Button Dropdown */}
         <div className="mt-6">
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="outline">
                 <PlusCircle className="mr-2 h-4 w-4" /> Bölüm Ekle
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent className="w-56">
               <DropdownMenuLabel>İçerik Blokları</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem onSelect={() => onAddBlock('text')}>
                 <Type className="mr-2 h-4 w-4" />
                 <span>Metin</span>
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => onAddBlock('heading')}>
                 <Heading2 className="mr-2 h-4 w-4" />
                 <span>Başlık</span>
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => onAddBlock('image')}>
                 <ImageIcon className="mr-2 h-4 w-4" />
                 <span>Görsel</span>
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => onAddBlock('gallery')}>
                 <GalleryHorizontal className="mr-2 h-4 w-4" />
                 <span>Galeri</span>
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => onAddBlock('video')}>
                 <Video className="mr-2 h-4 w-4" />
                 <span>Video</span>
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => onAddBlock('quote')}>
                 <Quote className="mr-2 h-4 w-4" />
                 <span>Alıntı</span>
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => onAddBlock('code')}>
                 <Code className="mr-2 h-4 w-4" />
                 <span>Kod</span>
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => onAddBlock('divider')}>
                 <Minus className="mr-2 h-4 w-4" />
                 <span>Ayırıcı</span>
               </DropdownMenuItem>
               {/* Add Section Block */}
               <DropdownMenuSeparator />
               <DropdownMenuLabel>Yapı Blokları</DropdownMenuLabel>
               <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onAddBlock('section')}>
                 <LayoutGrid className="mr-2 h-4 w-4" />
                 <span>Bölüm (Section)</span>
               </DropdownMenuItem>
               {/* Add more block types here */}
             </DropdownMenuContent>
           </DropdownMenu>
         </div>
       </div>
     </DndProvider>
  );
};
