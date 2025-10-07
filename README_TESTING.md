# API Testing Guide

## Quick Start Testing

### 1. Start Your Server
```bash
npm run dev
```

### 2. Run Automated Tests
```bash
node test-complete-api.js
```

This will automatically test:
- ✅ Authentication (Register & Login Admin/User)
- ✅ Categories (Create, Read, Update, Delete)
- ✅ Products (Create, Read, Update, Delete)
- ✅ Orders (Create, Read, Update, Delete)
- ✅ Data insertion in database
- ✅ Validation & Error handling
- ✅ Authorization (Admin vs User)

---

## Manual Testing with Postman

### Import Collection
1. Open Postman
2. Click **Import**
3. Select `Herbal_Complete_API.postman_collection.json`
4. Collection will appear in sidebar

### Setup Environment Variables
1. Click on collection name
2. Go to **Variables** tab
3. Set values:
   - `baseUrl`: `http://localhost:3000/api`
   - `accessToken`: (auto-filled after login)
   - `adminToken`: (auto-filled after admin login)

### Testing Flow

#### Step 1: Create Admin User
1. Go to **1. Authentication** → **Register User**
2. Change email to: `admin@test.com`
3. Change role to: `"admin"`
4. Click **Send**
5. Should get **201 Created**

#### Step 2: Login as Admin
1. Go to **1. Authentication** → **Login Admin**
2. Update email to match your admin email
3. Click **Send**
4. Token will auto-save to `{{adminToken}}`

#### Step 3: Create Category
1. Go to **3. Categories** → **Create Category**
2. Click **Send**
3. Note the `category.id` from response
4. Should get **201 Created**

#### Step 4: Create Product
1. Go to **2. Products** → **Create Product**
2. Update `category_id` with the ID from Step 3
3. Click **Send**
4. Note the `product.id` from response
5. Should get **201 Created**

#### Step 5: Create Regular User & Login
1. Go to **1. Authentication** → **Register User**
2. Click **Send** (creates regular user)
3. Go to **Login User**
4. Click **Send**
5. Token will auto-save to `{{accessToken}}`

#### Step 6: Create Order
1. Go to **4. Orders** → **Create Order**
2. Update `product_id` in items array with ID from Step 4
3. Click **Send**
4. Should get **201 Created** with calculated total

#### Step 7: Test All Endpoints
- **Get All Products** (Public - no auth needed)
- **Get All Categories** (Public - no auth needed)
- **Get My Orders** (User auth required)
- **Get All Orders** (Admin auth required)
- **Update Order Status** (Admin only)

---

## Database Verification

### Check Supabase Dashboard

1. **Categories Table**
   - Go to Supabase → Table Editor → `categories`
   - Should see your test category

2. **Products Table**
   - Go to Supabase → Table Editor → `products`
   - Should see your test product with:
     - name, description, price, stock
     - image_url
     - category_id (foreign key)

3. **Orders Table**
   - Go to Supabase → Table Editor → `orders`
   - Should see order with:
     - user_id
     - status (pending)
     - total_amount (auto-calculated)

4. **Order Items Table**
   - Go to Supabase → Table Editor → `order_items`
   - Should see items with:
     - order_id (foreign key)
     - product_id (foreign key)
     - quantity, price

---

## Expected Test Results

### ✅ Successful Responses

**Create Category (201)**
```json
{
  "success": true,
  "status": 201,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": 1,
      "name": "Herbal Teas",
      "description": "Natural herbal tea blends",
      "created_at": "2025-10-08T00:00:00.000Z"
    }
  }
}
```

**Create Product (201)**
```json
{
  "success": true,
  "status": 201,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": 1,
      "name": "Herbal Tea - Chamomile",
      "description": "Organic chamomile tea",
      "price": 15.99,
      "stock": 100,
      "image_url": "https://example.com/chamomile.jpg",
      "category_id": 1,
      "created_at": "2025-10-08T00:00:00.000Z"
    }
  }
}
```

**Create Order (201)**
```json
{
  "success": true,
  "status": 201,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "user_id": "user-uuid",
      "status": "pending",
      "total_amount": 45.97,
      "created_at": "2025-10-08T00:00:00.000Z",
      "items": [
        {
          "id": 1,
          "order_id": 1,
          "product_id": 1,
          "quantity": 2,
          "price": 15.99
        }
      ]
    }
  }
}
```

### ❌ Error Responses

**Unauthorized (401)**
```json
{
  "success": false,
  "status": 401,
  "message": "Access token is required"
}
```

**Forbidden (403)**
```json
{
  "success": false,
  "status": 403,
  "message": "Insufficient permissions"
}
```

**Validation Error (400)**
```json
{
  "success": false,
  "status": 400,
  "message": "Product name and price are required"
}
```

**Not Found (404)**
```json
{
  "success": false,
  "status": 404,
  "message": "Product not found"
}
```

---

## Testing Checklist

### Products Module
- [ ] Create product (admin) - data inserted in DB
- [ ] Get all products (public) - pagination works
- [ ] Get product by ID (public) - correct data returned
- [ ] Update product (admin) - data updated in DB
- [ ] Delete product (admin) - data removed from DB
- [ ] Unauthorized user cannot create product

### Categories Module
- [ ] Create category (admin) - data inserted in DB
- [ ] Get all categories (public) - all categories returned
- [ ] Get category by ID (public) - correct data returned
- [ ] Get products by category - filtered correctly
- [ ] Update category (admin) - data updated in DB
- [ ] Delete category (admin) - data removed from DB
- [ ] Cannot delete category with products

### Orders Module
- [ ] Create order (user) - order + items inserted in DB
- [ ] Total amount auto-calculated correctly
- [ ] Get user's orders (user) - only own orders shown
- [ ] Get all orders (admin) - all orders shown
- [ ] Get order by ID - includes items
- [ ] Update order status (admin) - status updated in DB
- [ ] Delete order (admin) - order + items removed from DB
- [ ] User cannot access other user's orders

### Authentication & Authorization
- [ ] Admin can access all endpoints
- [ ] User can only access allowed endpoints
- [ ] Public endpoints work without auth
- [ ] Invalid token rejected
- [ ] Expired token rejected

---

## Troubleshooting

### Server Not Starting
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <process_id> /F
```

### Database Connection Issues
1. Check `.env` file has correct Supabase credentials
2. Verify Supabase project is active
3. Check network connection

### Test Script Errors
```bash
# Install node-fetch if needed
npm install node-fetch

# Run with more details
node test-complete-api.js --verbose
```

### Postman Issues
1. Ensure baseUrl doesn't have trailing slash
2. Check tokens are being saved to variables
3. Verify Content-Type header is set to application/json

---

## Next Steps

After successful testing:
1. ✅ All data is being inserted correctly
2. ✅ All validations are working
3. ✅ Authorization is properly implemented
4. ✅ Error handling is comprehensive

You can now:
- Connect frontend to these APIs
- Deploy to production
- Add more features (reviews, cart, etc.)
