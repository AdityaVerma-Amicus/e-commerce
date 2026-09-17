import Cart from "../../components/Cart/Cart";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";
import "./CartPage.css";
import type { CartItem } from "../../types/cart";

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

function CartPage({ items, onUpdateQuantity, onRemoveItem }: CartPageProps) {
  return (
    <PageContainer>
      <main className="cart-page">
        <Cart
          items={items}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      </main>
    </PageContainer>
  );
}

export default CartPage;
