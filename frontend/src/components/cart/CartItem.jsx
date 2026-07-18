import * as React from "react"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CartItem({ item, index, onUpdateQuantity, onRemove }) {
  const lineTotal = item.price * item.quantity

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-surface border border-border-subtle rounded-lg shadow-sm gap-4 transition-all hover:border-border-subtle/80 text-right">
      
      {/* Product Image and Details */}
      <div className="flex items-center gap-4 flex-1 flex-row-reverse">
        <div className="h-16 w-16 rounded overflow-hidden border border-border-subtle/50 bg-surface-light shrink-0">
          <img 
            src={item.image || 'https://picsum.photos/600/450?random=1'} 
            alt={item.name} 
            className="h-full w-full object-cover" 
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary text-sm sm:text-base line-clamp-1">{item.name}</h3>
          <div className="flex flex-wrap gap-2 mt-1 justify-start flex-row-reverse">
            {item.size && (
              <span className="text-[10px] uppercase font-bold text-text-secondary bg-surface-light border border-border-subtle/50 px-2 py-0.5 rounded">
                الحجم: {item.size}
              </span>
            )}
            {item.color && (
              <span className="text-[10px] uppercase font-bold text-text-secondary bg-surface-light border border-border-subtle/50 px-2 py-0.5 rounded">
                اللون: {item.color}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing and Controls */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-8 border-t sm:border-t-0 border-border-subtle/20 pt-3 sm:pt-0 flex-row-reverse">
        
        {/* Remove CTA */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Price and Subtotal */}
        <div className="text-right flex flex-col justify-center min-w-[70px]">
          <span className="text-xs text-text-secondary">{item.price} جنيه</span>
          <span className="text-sm font-bold text-text-primary mt-0.5">{lineTotal} جنيه</span>
        </div>

        {/* Quantity selectors */}
        <div className="flex items-center gap-1 flex-row-reverse">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded border-border-subtle bg-surface-light text-text-primary active:scale-95 cursor-pointer"
            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-semibold text-text-primary">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded border-border-subtle bg-surface-light text-text-primary active:scale-95 cursor-pointer"
            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

      </div>
    </div>
  )
}
