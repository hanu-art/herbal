# 🧪 Complete Testing Checklist

## 📋 Pre-Testing Setup

### 1. Database Setup
- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Run `database-setup.sql` script
- [ ] Verify all 4 tables created (categories, products, orders, order_items)
- [ ] Check sample data inserted

### 2. Server Setup
- [ ] Ensure `.env` file has correct Supabase credentials
- [ ] Run `npm install` (if not done)
- [ ] Start server: `npm run dev`
- [ ] Verify server running on http://localhost:3000
- [ ] Check health endpoint: http://localhost:3000/health

---

## 🤖 Automated Testing (Recommended)

### Run Complete Test Suite
```bash
node test-complete-api.js
```

### What It Tests:
✅ **Authentication**
- Admin registration & login
- User registration & login
- Token generation

✅ **Categories**
- Create category (data inserted in DB)
- Get all categories
- Get category by ID
- Update category (data updated in DB)
- Delete category (data removed from DB)
- Authorization checks

✅ **Products**
- Create product with image_url (data inserted in DB)
- Get all products with pagination
- Get product by ID
- Update product (data updated in DB)
- Delete product (data removed from DB)
- Validation (invalid price, stock)
- Authorization checks

✅ **Orders**
- Create order with items (data inserted in both tables)
- Auto-calculate total amount
- Get user's orders
- Get all orders (admin)
- Get order by ID with items
- Update order status (data updated in DB)
- Delete order (data removed from DB)
- Ownership validation

### Expected Output:
```
============================================================
1. AUTHENTICATION TESTS
============================================================

[1.1] Register Admin User
✓ Admin Registration
  Email: admin_1234567890@test.com

[1.2] Login Admin User
✓ Admin Login
  Token received

... (continues for all tests)

============================================================
TEST SUMMARY
============================================================

✓ All tests completed!

Test Data Created:
  - Category ID: 1
  - Product ID: 1
  - Order ID: 1

Note: Test data has been cleaned up from database
```

---

## 📮 Manual Testing with Postman

### Setup
1. **Import Collection**
   - Open Postman
   - Import `Herbal_Complete_API.postman_collection.json`

2. **Set Variables**
   - baseUrl: `http://localhost:3000/api`
   - accessToken: (auto-filled)
   - adminToken: (auto-filled)

### Test Flow

#### ✅ Step 1: Authentication
- [ ] Register Admin
  - Endpoint: POST /auth/register
  - Body: Set role to "admin"
  - Expected: 201 Created

- [ ] Login Admin
  - Endpoint: POST /auth/login
  - Expected: 200 OK, token saved to {{adminToken}}

- [ ] Register User
  - Endpoint: POST /auth/register
  - Body: Set role to "user"
  - Expected: 201 Created

- [ ] Login User
  - Endpoint: POST /auth/login
  - Expected: 200 OK, token saved to {{accessToken}}

#### ✅ Step 2: Categories
- [ ] Create Category (Admin)
  - Endpoint: POST /categories
  - Auth: Bearer {{adminToken}}
  - Body: `{"name": "Herbal Teas", "description": "Natural teas"}`
  - Expected: 201 Created
  - **Note the category ID from response**

- [ ] Get All Categories (Public)
  - Endpoint: GET /categories
  - Auth: None
  - Expected: 200 OK, array of categories

- [ ] Get Category by ID (Public)
  - Endpoint: GET /categories/{id}
  - Expected: 200 OK, single category

- [ ] Update Category (Admin)
  - Endpoint: PUT /categories/{id}
  - Auth: Bearer {{adminToken}}
  - Expected: 200 OK

- [ ] **Verify in Supabase**: Check categories table

#### ✅ Step 3: Products
- [ ] Create Product (Admin)
  - Endpoint: POST /products
  - Auth: Bearer {{adminToken}}
  - Body:
    ```json
    {
      "name": "Chamomile Tea",
      "description": "Organic tea",
      "price": 15.99,
      "stock": 100,
      "image_url": "https://example.com/image.jpg",
      "category_id": 1
    }
    ```
  - Expected: 201 Created
  - **Note the product ID from response**

- [ ] Get All Products (Public)
  - Endpoint: GET /products?page=1&limit=10
  - Expected: 200 OK, paginated response

- [ ] Get Product by ID (Public)
  - Endpoint: GET /products/{id}
  - Expected: 200 OK, product with image_url

- [ ] Update Product (Admin)
  - Endpoint: PUT /products/{id}
  - Auth: Bearer {{adminToken}}
  - Body: `{"price": 17.99, "stock": 120}`
  - Expected: 200 OK

- [ ] Get Products by Category
  - Endpoint: GET /categories/{id}/products
  - Expected: 200 OK, filtered products

- [ ] **Verify in Supabase**: Check products table

#### ✅ Step 4: Orders
- [ ] Create Order (User)
  - Endpoint: POST /orders
  - Auth: Bearer {{accessToken}}
  - Body:
    ```json
    {
      "items": [
        {"product_id": 1, "quantity": 2, "price": 15.99},
        {"product_id": 1, "quantity": 1, "price": 15.99}
      ],
      "status": "pending"
    }
    ```
  - Expected: 201 Created
  - **Check total_amount is calculated: (2×15.99) + (1×15.99) = 47.97**
  - **Note the order ID from response**

- [ ] Get My Orders (User)
  - Endpoint: GET /orders?page=1&limit=10
  - Auth: Bearer {{accessToken}}
  - Expected: 200 OK, only user's orders

- [ ] Get Order by ID (User)
  - Endpoint: GET /orders/{id}
  - Auth: Bearer {{accessToken}}
  - Expected: 200 OK, order with items array

- [ ] Get All Orders (Admin)
  - Endpoint: GET /orders/all?page=1&limit=10
  - Auth: Bearer {{adminToken}}
  - Expected: 200 OK, all orders

- [ ] Update Order Status (Admin)
  - Endpoint: PUT /orders/{id}
  - Auth: Bearer {{adminToken}}
  - Body: `{"status": "processing"}`
  - Expected: 200 OK

- [ ] **Verify in Supabase**: 
  - Check orders table (order record)
  - Check order_items table (item records)

#### ✅ Step 5: Authorization Tests
- [ ] User tries to create product
  - Endpoint: POST /products
  - Auth: Bearer {{accessToken}} (user token)
  - Expected: 403 Forbidden

- [ ] User tries to delete category
  - Endpoint: DELETE /categories/{id}
  - Auth: Bearer {{accessToken}}
  - Expected: 403 Forbidden

- [ ] No auth on protected endpoint
  - Endpoint: POST /products
  - Auth: None
  - Expected: 401 Unauthorized

#### ✅ Step 6: Validation Tests
- [ ] Create product with invalid data
  - Body: `{"name": "", "price": -10}`
  - Expected: 400 Bad Request

- [ ] Create order with no items
  - Body: `{"items": []}`
  - Expected: 400 Bad Request

- [ ] Update product with invalid price
  - Body: `{"price": -5}`
  - Expected: 400 Bad Request

---

## 🗄️ Database Verification

### Check Data in Supabase

1. **Categories Table**
   ```sql
   SELECT * FROM categories ORDER BY created_at DESC LIMIT 5;
   ```
   - ✅ Should show your test category
   - ✅ Check name, description, created_at

2. **Products Table**
   ```sql
   SELECT * FROM products ORDER BY created_at DESC LIMIT 5;
   ```
   - ✅ Should show your test product
   - ✅ Verify: name, price, stock, image_url, category_id

3. **Orders Table**
   ```sql
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
   ```
   - ✅ Should show your test order
   - ✅ Verify: user_id, status, total_amount (auto-calculated)

4. **Order Items Table**
   ```sql
   SELECT * FROM order_items WHERE order_id = 1;
   ```
   - ✅ Should show all items for the order
   - ✅ Verify: product_id, quantity, price

5. **Join Query (Verify Relationships)**
   ```sql
   SELECT 
     o.id as order_id,
     o.total_amount,
     o.status,
     oi.product_id,
     oi.quantity,
     oi.price,
     p.name as product_name
   FROM orders o
   JOIN order_items oi ON o.id = oi.order_id
   JOIN products p ON oi.product_id = p.id
   WHERE o.id = 1;
   ```
   - ✅ Should show complete order with product details

---

## ✅ Success Criteria

### All Tests Pass When:
- [x] Server starts without errors
- [x] All database tables exist
- [x] Admin can create/update/delete all resources
- [x] Users can only access allowed endpoints
- [x] Public endpoints work without authentication
- [x] Data is correctly inserted in database
- [x] Data is correctly updated in database
- [x] Data is correctly deleted from database
- [x] Pagination works correctly
- [x] Validation rejects invalid data
- [x] Authorization blocks unauthorized access
- [x] Order total is auto-calculated
- [x] Order items are created with order
- [x] Image URLs are stored correctly
- [x] Foreign keys maintain referential integrity

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Check `.env` file has correct SUPABASE_URL and SUPABASE_SERVICE_KEY
- Verify Supabase project is active
- Check internet connection

### Issue: "401 Unauthorized"
**Solution:**
- Ensure you logged in and token is saved
- Check Authorization header format: `Bearer {token}`
- Token might be expired - login again

### Issue: "403 Forbidden"
**Solution:**
- User trying to access admin endpoint
- Use admin token for admin endpoints
- Check user role in database

### Issue: "Product not found"
**Solution:**
- Use correct product ID from create response
- Product might have been deleted
- Check products table in Supabase

### Issue: "Cannot delete category with existing products"
**Solution:**
- This is expected behavior
- Delete products first, then category
- Or use CASCADE in database (not recommended)

---

## 📊 Final Verification

After all tests pass:

1. **Check Postman Collection**
   - All requests return expected status codes
   - All data operations successful

2. **Check Supabase Dashboard**
   - All tables have data
   - Relationships are correct
   - Timestamps are populated

3. **Check Server Logs**
   - No error messages
   - All requests logged correctly

4. **Ready for Production!** 🎉
   - All modules working
   - Data integrity maintained
   - Security implemented
   - Error handling comprehensive

---

## 📝 Notes

- Test data is automatically cleaned up by automated test script
- Manual testing data remains in database (delete manually if needed)
- Always test with fresh data to avoid conflicts
- Keep admin credentials secure
- Use different emails for each test run to avoid duplicates
