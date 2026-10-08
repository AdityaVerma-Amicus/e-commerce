# E-Commerce Web Application

A modern, responsive e-commerce frontend built with **React, TypeScript, Vite, and Tailwind CSS**. The application provides product discovery, search and filtering, cart management, checkout, shipping selection, authentication, and order management.

---

## Features

### Product Discovery
- Responsive home page with hero and product sections
- Product listing with:
  - Search
  - Category filtering
  - Sorting
  - Pagination
- Product cards with:
  - Product image
  - Name
  - Price
  - Rating
  - Sale/New indicators
  - Add to Cart functionality
- Loading skeletons and empty states
- Product detail route

### Cart Management
- Global cart state using **React Context API**
- Cart state managed with `useReducer`
- Add, remove, update quantity, and clear cart
- Cart persistence using `localStorage`
- Cart rehydration when the application loads
- Dynamic cart item count in the navigation bar
- Automatic subtotal, tax, shipping, and total calculations

### Checkout
- Multi-step checkout UI:
  - Shipping
  - Payment
  - Review
- Shipping form with validation
- Country → State → City dependent selection
- Shipping method selection
- Shipping methods:
  - Standard
  - Express
  - Overnight
- Dynamic order summary
- Order creation after successful checkout
- Cart clearing after order placement
- Redirect to the Orders page after checkout
- Empty-cart protection

### Authentication
- Global authentication state using **AuthContext**
- Mock login/logout flow
- User state available across the application
- Protected routes for authenticated pages

### Orders
- Order creation and persistence
- Order listing page
- Order status tracking
- Order information including:
  - Items
  - Shipping
  - Total
  - Date
  - Status

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React** | UI development |
| **TypeScript** | Type safety and maintainability |
| **Vite** | Development server and production build |
| **Tailwind CSS** | Responsive UI styling |
| **React Router** | Client-side routing |
| **Context API** | Global application state |
| **useReducer** | Predictable cart state management |
| **Lucide React** | UI icons |
| **Swiper** | Product/carousel interactions |
| **localStorage** | Client-side persistence |
| **ESLint** | Code quality and linting |

---

## Application Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Homepage and featured products |
| `/products` | Products | Product listing, search, filter and sorting |
| `/products/:id` | Product Detail | Individual product details |
| `/cart` | Cart | Cart items and order summary |
| `/checkout` | Checkout | Shipping and order placement |
| `/orders` | Orders | Previous orders |
| `*` | 404 | Page not found |

The `/checkout` and `/orders` routes are lazy loaded using `React.lazy()` and `Suspense`.

---

## Project Architecture

The application follows a component-based architecture with separation between UI, state management, API services, hooks, and types.

```text
src/
├── components/
│   ├── Cart/
│   ├── Checkout/
│   ├── FeaturedParts/
│   ├── Footer/
│   ├── Hero/
│   ├── NavBar/
│   ├── ProductCard/
│   ├── ProductCarousel/
│   ├── ProductGrid/
│   ├── ShippingForm/
│   └── ...
│
├── context/
│   ├── CartContext
│   └── AuthContext
│
├── hooks/
│   ├── useFetch
│   ├── useStorage
│   ├── useProducts
│   └── ...
│
├── pages/
│   ├── Home
│   ├── ProductListing
│   ├── ProductDetail
│   ├── Cart
│   ├── Checkout
│   └── Orders
│
├── services/
│   ├── productServices
│   ├── categoryServices
│   └── locationService
│
├── types/
│   ├── products
│   ├── orders
│   └── ...
│
├── utils/
│
├── App.tsx
└── main.tsx
```

---

## State Management

The application uses **React Context API** for application-wide state instead of prop drilling.

### CartContext

```text
User Action
    ↓
Component
    ↓
CartContext
    ↓
useReducer
    ↓
Cart State
    ↓
localStorage
```

Supported actions:

```text
ADD_ITEM
REMOVE_ITEM
UPDATE_QTY
CLEAR_CART
```

The cart is restored from `localStorage` when the application starts and persisted whenever the cart state changes.

### AuthContext

```text
Login
   ↓
AuthContext
   ↓
Authentication State
   ↓
Protected Routes
```

This allows authentication state and user information to be consumed by any component without passing props through multiple component levels.

---

## Product Data Flow

The product listing uses a reusable `useProducts` hook to manage API interaction and product state.

```text
Product Listing
      ↓
useProducts()
      ↓
Product Service
      ↓
API
      ↓
Products
      ↓
Product Grid
      ↓
ProductCard
```

Search, category selection, sorting, and pagination are handled through the product fetching layer.

---

## Checkout Data Flow

```text
CartContext
    │
    ├── Cart Items
    ├── Subtotal
    ├── Shipping
    └── Total
          │
          ↓
     CheckoutPage
          │
          ├── ShippingForm
          │      ├── Country
          │      ├── State
          │      ├── City
          │      └── Shipping Method
          │
          └── Order Summary
                   │
                   ↓
              Place Order
                   │
          ┌────────┴────────┐
          ↓                 ↓
      Clear Cart       Create Order
                              │
                              ↓
                       Orders Page
```

---

## Responsive Design

The application is designed for:

- Desktop
- Tablet
- Mobile

The navigation system adapts based on viewport size.

On smaller screens:

- Navigation becomes a hamburger menu
- Search can switch to a compact search icon
- Cart remains accessible through the navigation bar
- Layout components adjust using responsive Tailwind utilities

---

## Routing

The application uses **React Router** for client-side navigation.

Key routing features include:

- Shared layout
- Active navigation links
- Dynamic product routes
- Protected routes
- Programmatic navigation
- 404 fallback route
- Lazy-loaded routes

The shared layout keeps the `NavBar` and `Footer` persistent while page content changes.

---

## Reusable Components

The UI is built using reusable components rather than page-specific implementations.

Examples:

- `ProductCard`
- `ProductCardSkeleton`
- `ProductGrid`
- `ProductCarousel`
- `ProductListing`
- `NavBar`
- `NavigationMenu`
- `SearchBar`
- `ShippingForm`
- `CartItem`
- `OrderSummary`
- `PageContainer`
- `EmptyState`

This improves consistency and makes individual features easier to maintain and extend.

---

## Custom Hooks

Reusable logic is extracted into custom hooks.

### `useFetch`

Generic hook for handling API requests and related loading/error state.

### `useStorage`

Provides a reusable abstraction over browser `localStorage`.

Supports operations such as:

```text
get
put
remove
```

### `useProducts`

Encapsulates product fetching and product-list state including:

- Products
- Loading state
- Error state
- Pagination
- Search
- Category filtering
- Sorting
- Refreshing data

---

## Environment Variables

Environment-specific configuration should be stored in `.env` files rather than hardcoded in source code.

For Vite applications, client-side environment variables use the `VITE_` prefix.

Example:

```env
VITE_API_BASE_URL=your_api_url
```

Access them through:

```typescript
import.meta.env.VITE_API_BASE_URL
```

Do not commit secrets or sensitive credentials to the repository.

---

## Development

### Prerequisites

Make sure the following are installed:

- Node.js
- npm

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Linting

```bash
npm run lint
```

---

## Error Handling

The application handles common UI and API failure scenarios through:

- API error states
- Retry actions
- Empty states
- Loading states
- Form validation
- Protected-route redirects
- 404 page

---

## Future Improvements

Potential future enhancements include:

- Real backend authentication
- Persistent backend cart
- Real payment gateway integration
- Server-side order management
- Product reviews
- Wishlist functionality
- Advanced filtering
- Automated testing with Jest and React Testing Library
- CI/CD pipeline
- Production monitoring and analytics

---

## License

This project is intended for learning, demonstration, and development purposes.