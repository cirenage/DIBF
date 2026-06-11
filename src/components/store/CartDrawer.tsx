
'use client';

import * as React from 'react';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, addItem, removeItem, totalPrice, totalItems, clearCart } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCheckout = () => {
    toast({
      title: "Inquiry Initiated",
      description: "Redirecting to complete your Impact Inquiry form.",
    });
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Your Impact Cart ({totalItems()})
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-secondary">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Add purpose-driven products to start your impact.</p>
              </div>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-secondary line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-primary font-bold mt-1">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-md h-7">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="px-2 hover:bg-muted transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => addItem(item)}
                          className="px-2 hover:bg-muted transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => {
                          for(let i=0; i<item.quantity; i++) removeItem(item.id);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="p-6 border-t bg-muted/30 space-y-4">
            <div className="flex justify-between items-center text-secondary font-bold">
              <span>Estimated Total Contribution</span>
              <span className="text-lg">${totalPrice().toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight italic">
              *All proceeds are strictly audited and funneled directly into DIBF Outreach Programs. 
              Actual payment and shipping details will be coordinated via your Impact Inquiry.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={clearCart} className="gap-2">
                Clear All
              </Button>
              <Button asChild onClick={handleCheckout} className="gap-2 font-bold shadow-lg">
                <Link href="/contact?type=store-inquiry">
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
