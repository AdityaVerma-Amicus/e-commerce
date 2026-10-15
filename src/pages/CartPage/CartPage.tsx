import { useCartContext } from "../../context/CartContext";

import Cart from "../../components/Cart/Cart";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";
import SEO from "../../components/SEO/SEO";

function CartPage() {
  
  const { items, updateQty, removeItem, isLoading } = useCartContext();

  return (
    <>
      <SEO
        title="Your Shopping Cart | E-Commerce"
        description="Review the items in your shopping cart before proceeding to checkout."
        canonicalPath="/cart"
        noIndex
      />

      <PageContainer>
        <Cart
          items={items}
          onUpdateQuantity={updateQty}
          onRemoveItem={removeItem}
          isLoading={isLoading}
        />
      </PageContainer>
    </>
  );
}

export default CartPage;