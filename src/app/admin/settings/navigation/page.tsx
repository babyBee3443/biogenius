
"use client";

import * as React from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, GripVertical, Trash2, PlusCircle, Edit2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// --- Types ---
interface NavItem {
  id: string;
  label: string;
  href: string;
  isVisible: boolean;
}

// --- Mock Data (Replace with API calls) ---
const initialNavItems: NavItem[] = [
  { id: 'home', label: 'Anasayfa', href: '/', isVisible: true },
  { id: 'tech', label: 'Teknoloji', href: '/categories/teknoloji', isVisible: true },
  { id: 'bio', label: 'Biyoloji', href: '/categories/biyoloji', isVisible: true },
  { id: 'about', label: 'Hakkımızda', href: '/hakkimizda', isVisible: true },
  { id: 'contact', label: 'İletişim', href: '/iletisim', isVisible: true },
];

// --- Draggable Item Component ---
const ItemTypes = { NAV_ITEM: 'navItem' };

interface DraggableNavItemProps {
    item: NavItem;
    index: number;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    onToggleVisibility: (id: string) => void;
    onEdit: (item: NavItem) => void; // Pass item to edit
    onDelete: (id: string) => void;
}

const DraggableNavItem: React.FC<DraggableNavItemProps> = ({ item, index, moveItem, onToggleVisibility, onEdit, onDelete }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.NAV_ITEM,
    collect(monitor) { return { handlerId: monitor.getHandlerId() }; },
    hover(draggedItem: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.NAV_ITEM,
    item: () => ({ id: item.id, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-handler-id={handlerId}
      className="flex items-center gap-3 p-3 border rounded-md bg-card mb-2 group"
    >
        <Button
            ref={preview} // Use preview for the drag handle visual
            variant="ghost"
            size="icon"
            className="h-7 w-7 cursor-grab"
            aria-label="Menü Öğesini Taşı"
        >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      <div className="flex-1 flex items-center justify-between">
        <div>
          <span className="font-medium">{item.label}</span>
          <span className="text-xs text-muted-foreground ml-2">({item.href})</span>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Switch
            checked={item.isVisible}
            onCheckedChange={() => onToggleVisibility(item.id)}
            aria-label="Görünürlüğü Değiştir"
            className="data-[state=checked]:bg-green-600"
          />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(item)}>
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Düzenle</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Sil</span>
          </Button>
        </div>
      </div>
    </div>
  );
};


// --- Main Navigation Settings Page ---
export default function NavigationSettingsPage() {
  const [navItems, setNavItems] = React.useState<NavItem[]>(initialNavItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<NavItem | null>(null);
  const [newItemLabel, setNewItemLabel] = React.useState("");
  const [newItemHref, setNewItemHref] = React.useState("");

  // --- Drag and Drop Handler ---
  const moveItem = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setNavItems((prevItems) => {
        const updatedItems = [...prevItems];
        const [draggedItem] = updatedItems.splice(dragIndex, 1);
        updatedItems.splice(hoverIndex, 0, draggedItem);
        return updatedItems;
      });
    },
    [] // No dependencies needed if navItems is updated via setNavItems
  );

  // --- Visibility Toggle ---
  const handleToggleVisibility = (id: string) => {
    setNavItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  // --- Add Item ---
  const handleAddItem = () => {
      if (!newItemLabel || !newItemHref) {
          toast({ variant: "destructive", title: "Hata", description: "Etiket ve URL alanları zorunludur." });
          return;
      }
      const newItem: NavItem = {
          id: `custom-${Date.now()}`, // Simple unique ID generation
          label: newItemLabel,
          href: newItemHref,
          isVisible: true,
      };
      setNavItems([...navItems, newItem]);
      setNewItemLabel("");
      setNewItemHref("");
      setIsAddDialogOpen(false);
      toast({ title: "Menü Öğesi Eklendi", description: `"${newItem.label}" başarıyla eklendi.` });
  };

   // --- Edit Item ---
   const handleEditClick = (item: NavItem) => {
    setEditingItem(item);
    setNewItemLabel(item.label); // Pre-fill form for editing
    setNewItemHref(item.href);
    setIsEditDialogOpen(true);
   }

   const handleUpdateItem = () => {
    if (!newItemLabel || !newItemHref || !editingItem) {
          toast({ variant: "destructive", title: "Hata", description: "Etiket ve URL alanları zorunludur." });
          return;
      }
      setNavItems(prevItems => prevItems.map(item =>
          item.id === editingItem.id
          ? { ...item, label: newItemLabel, href: newItemHref }
          : item
      ));
      setEditingItem(null);
      setNewItemLabel("");
      setNewItemHref("");
      setIsEditDialogOpen(false);
      toast({ title: "Menü Öğesi Güncellendi", description: `"${newItemLabel}" başarıyla güncellendi.` });
   }

  // --- Delete Item ---
  const handleDeleteItem = (id: string) => {
     if (window.confirm("Bu menü öğesini silmek istediğinizden emin misiniz?")) {
         setNavItems(prevItems => prevItems.filter(item => item.id !== id));
         toast({ variant: "destructive", title: "Menü Öğesi Silindi" });
     }
  };


  // --- Save Changes ---
  const handleSaveChanges = () => {
    // TODO: Implement API call to save the navItems array (order and visibility)
    console.log("Saving navigation items:", navItems);
    toast({
      title: "Navigasyon Kaydedildi",
      description: "Menü yapısı başarıyla güncellendi.",
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Button variant="outline" size="sm" asChild className="mb-4">
              <Link href="/admin/settings"><ArrowLeft className="mr-2 h-4 w-4" /> Ayarlara Dön</Link>
            </Button>
            <h1 className="text-3xl font-bold">Menü Yönetimi</h1>
            <p className="text-muted-foreground">Sitenin ana navigasyon menüsünü düzenleyin. Öğeleri sürükleyerek sıralayabilirsiniz.</p>
          </div>
          <div className="flex gap-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Yeni Öğe Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yeni Menü Öğesi Ekle</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                             <div className="space-y-2">
                                <Label htmlFor="new-item-label">Etiket <span className="text-destructive">*</span></Label>
                                <Input
                                    id="new-item-label"
                                    value={newItemLabel}
                                    onChange={(e) => setNewItemLabel(e.target.value)}
                                    placeholder="Örn: Blog"
                                />
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="new-item-href">URL (Bağlantı) <span className="text-destructive">*</span></Label>
                                <Input
                                    id="new-item-href"
                                    value={newItemHref}
                                    onChange={(e) => setNewItemHref(e.target.value)}
                                    placeholder="/blog veya https://..."
                                />
                                 <p className="text-xs text-muted-foreground">
                                     Site içi için / ile başlayın (örn: /hakkimizda), dış bağlantı için tam URL kullanın.
                                 </p>
                             </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">İptal</Button>
                            </DialogClose>
                            <Button onClick={handleAddItem}>Ekle</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
              <Button onClick={handleSaveChanges}>
                  <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
              </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Menü Öğeleri</CardTitle>
            <CardDescription>Öğeleri sürükleyip bırakarak yeniden sıralayın. Açma/kapama düğmesi ile görünürlüğü ayarlayın.</CardDescription>
          </CardHeader>
          <CardContent>
            {navItems.length > 0 ? (
                 <div className="max-w-lg mx-auto">
                     {navItems.map((item, index) => (
                         <DraggableNavItem
                             key={item.id}
                             item={item}
                             index={index}
                             moveItem={moveItem}
                             onToggleVisibility={handleToggleVisibility}
                             onEdit={handleEditClick}
                             onDelete={handleDeleteItem}
                         />
                     ))}
                 </div>
            ) : (
                <p className="text-muted-foreground text-center py-4">Henüz menü öğesi eklenmemiş.</p>
            )}
          </CardContent>
        </Card>

        <Separator />
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
          </Button>
        </div>

        {/* Edit Item Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Menü Öğesini Düzenle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="space-y-2">
                        <Label htmlFor="edit-item-label">Etiket <span className="text-destructive">*</span></Label>
                        <Input
                            id="edit-item-label"
                            value={newItemLabel} // Use same state vars as Add dialog
                            onChange={(e) => setNewItemLabel(e.target.value)}
                            placeholder="Örn: Blog"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="edit-item-href">URL (Bağlantı) <span className="text-destructive">*</span></Label>
                        <Input
                            id="edit-item-href"
                            value={newItemHref} // Use same state vars as Add dialog
                            onChange={(e) => setNewItemHref(e.target.value)}
                            placeholder="/blog veya https://..."
                        />
                         <p className="text-xs text-muted-foreground">
                             Site içi için / ile başlayın, dış bağlantı için tam URL kullanın.
                         </p>
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => {setIsEditDialogOpen(false); setEditingItem(null); setNewItemLabel(''); setNewItemHref('');}}>İptal</Button>
                    <Button onClick={handleUpdateItem}>Güncelle</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </DndProvider>
  );
}
