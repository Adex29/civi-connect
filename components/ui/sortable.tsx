"use client";

import React, { useId } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SortableProps<T extends { id: string }> {
  items: T[];
  onValueChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function Sortable<T extends { id: string }>({
  items,
  onValueChange,
  renderItem,
  className = "space-y-2",
}: SortableProps<T>) {
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onValueChange(arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  return (
    <DndContext id={id} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    position: "relative",
    zIndex: isDragging ? 50 : "auto",
    touchAction: "manipulation",
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <SortableContextItemValue.Provider value={{ attributes, listeners }}>
        {children}
      </SortableContextItemValue.Provider>
    </div>
  );
}

const SortableContextItemValue = React.createContext<{
  attributes: any;
  listeners: any;
}>({ attributes: {}, listeners: {} });

export function SortableDragHandle({ className = "" }: { className?: string }) {
  const { attributes, listeners } = React.useContext(SortableContextItemValue);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 touch-none select-none h-8 w-8 sm:h-7 sm:w-7 ${className}`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4" />
    </Button>
  );
}
