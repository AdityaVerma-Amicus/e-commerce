import { useEffect, useState } from "react";

import {
  getStoredOrders,
} from "../../services/orderServices";

import type { Order } from "../../types/orders";

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = getStoredOrders();

    setOrders(storedOrders);
  }, []);

  return (
    <main className="orders-page">
      <h1>Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <article
              key={`${order.date}-${index}`}
              className="order-card"
            >
              <div className="order-card-header">
                <div>
                  <h2>Order #{index + 1}</h2>

                  <p>
                    {new Date(
                      order.date,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <span className="order-status">
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="order-item"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      $
                      {(
                        item.price * item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <span>
                  Shipping: {order.shipping}
                </span>

                <strong>
                  Total: ${order.total.toFixed(2)}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default OrdersPage;