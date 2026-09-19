import React from 'react';
import { X, Heart, ShoppingBag, Eye, Trash2 } from 'lucide-react';
import { JewelleryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: JewelleryItem[];
  onRemoveFromWishlist: (item: JewelleryItem) => void;
  onMoveToCart: (item: JewelleryItem) => void;
  onOpen3D: (item: JewelleryItem) => void;
}

export const WishlistDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onMoveToCart,
  onOpen3D,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#1F1615] shadow-2xl flex flex-col justify-between border-l border-[#D4AF37]/50">
          {/* Header */}
          <div className="p-4 bg-[#4A1017] text-white flex items-center justify-between border-b border-[#D4AF37]/30">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#F3DE8A] fill-[#F3DE8A]" />
              <h3 className="font-cinzel text-base font-bold text-[#F5E5B8]">
                Your Wishlist ({wishlistItems.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlistItems.length > 0 ? (
              wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border border-stone-200"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-cormorant text-base font-bold text-stone-900 truncate">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveFromWishlist(item)}
                          className="text-stone-400 hover:text-red-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.purity} • {item.weightGrams}g
                      </div>
                      <div className="font-cinzel text-sm font-bold text-[#4A1017] mt-1">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onMoveToCart(item);
                          onRemoveFromWishlist(item);
                        }}
                        className="flex-1 py-1.5 px-2 bg-[#4A1017] text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-[#6B1724]"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>

                      {item.has3DModel && (
                        <button
                          type="button"
                          onClick={() => {
                            onOpen3D(item);
                            onClose();
                          }}
                          className="py-1.5 px-2 bg-[#FAF1E4] text-[#8C6D23] border border-[#D4AF37]/50 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-[#F5E5B8]"
                        >
                          <Eye className="w-3 h-3" />
                          <span>3D</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-cormorant text-xl font-bold text-stone-800">
                  Your wishlist is empty
                </h4>
                <p className="text-xs text-stone-500">
                  Save your favorite bridal jewellery or 3D solitaire pieces to inspect later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
