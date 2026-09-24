import Cart from "../../components/Cart/Cart";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";

import { useCart } from "../../hooks/useCart";

import "./CartPage.css";

function CartPage() {
    const {
        items,
        updateQty,
        removeItem,
    } = useCart();

    return (
        <PageContainer>
            <main className="cart-page">
                <Cart
                    items={items}
                    onUpdateQuantity={updateQty}
                    onRemoveItem={removeItem}
                />
            </main>
        </PageContainer>
    );
}

export default CartPage;