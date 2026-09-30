import { useCartContext } from "../../context/CartContext";

import Cart from "../../components/Cart/Cart";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";

function CartPage() {
  const {
    items,
    updateQty,
    removeItem,
  } = useCartContext();

  return (
    <PageContainer>
      <Cart
        items={items}
        onUpdateQuantity={updateQty}
        onRemoveItem={removeItem}
      />
    </PageContainer>
  );
}

export default CartPage;