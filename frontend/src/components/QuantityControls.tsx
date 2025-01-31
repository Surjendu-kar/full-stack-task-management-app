import { FiMinus, FiPlus } from "react-icons/fi";

interface QuantityControlsProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
  isAvailable?: boolean;
}

export default function QuantityControls({
  quantity,
  onQuantityChange,
  showAddToCart = false,
  onAddToCart,
  isAvailable = true,
}: QuantityControlsProps) {
  if (quantity > 0 || !showAddToCart) {
    return (
      <div className="flex items-center justify-center gap-3 border rounded-md overflow-hidden">
        <button
          onClick={() => onQuantityChange(quantity - 1)}
          className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <FiMinus />
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <FiPlus />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onAddToCart}
      disabled={!isAvailable}
      className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
        ${
          isAvailable
            ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer "
            : "bg-gray-400 cursor-not-allowed"
        }`}
    >
      {isAvailable ? "Add to Cart" : "Not Available"}
    </button>
  );
}
