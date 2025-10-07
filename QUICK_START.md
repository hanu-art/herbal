# 🚀 Quick Start Guide - Test Everything in 5 Minutes

## Step 1: Setup Database (1 minute)
1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy & paste entire `database-setup.sql`
4. Click **Run**
5. ✅ Tables created with sample data

## Step 2: Start Server (30 seconds)
```bash
npm run dev
```
✅ Server running on http://localhost:3000

## Step 3: Run Automated Tests (2 minutes)
```bash
node test-complete-api.js
```

### What You'll See:
```
============================================================
1. AUTHENTICATION TESTS
============================================================
✓ Admin Registration
✓ Admin Login
✓ User Registration
✓ User Login

============================================================
2. CATEGORY TESTS
============================================================
✓ Create Category
✓ Get All Categories
✓ Get Category by ID
✓ Update Category
✓ Unauthorized Access Prevention

============================================================
3. PRODUCT TESTS
============================================================
✓ Create Product
✓ Get All Products
✓ Get Product by ID
✓ Update Product
✓ Get Products by Category
✓ Validation Error Handling

============================================================
4. ORDER TESTS
============================================================
✓ Create Order
✓ Get My Orders
✓ Get Order by ID
✓ Get All Orders (Admin)
✓ Update Order Status
✓ Invalid Order Validation

============================================================
5. CLEANUP (Delete Test Data)
============================================================
✓ Delete Order
✓ Delete Product
✓ Delete Category

============================================================
TEST SUMMARY
============================================================
✓ All tests completed!
```

## Step 4: Verify in Supabase (1 minute)
1. Go to **Table Editor**
2. Check tables:
   - ✅ `categories` - has data
   - ✅ `products` - has data with image_url
   - ✅ `orders` - has data with calculated total
   - ✅ `order_items` - has items linked to orders

## Step 5: Test with Postman (Optional)
1. Import `Herbal_Complete_API.postman_collection.json`
2. Set `baseUrl` to `http://localhost:3000/api`
3. Run requests in order:
   - **1. Authentication** → Login Admin
   - **3. Categories** → Create Category
   - **2. Products** → Create Product
   - **4. Orders** → Create Order

---

## ✅ Success Checklist

After running automated tests, you should have:

- [x] **Authentication Working**
  - Admin can login
  - User can login
  - Tokens generated

- [x] **Categories Working**
  - Created in database
  - Retrieved correctly
  - Updated successfully
  - Deleted successfully

- [x] **Products Working**
  - Created with image_url
  - Retrieved with pagination
  - Updated successfully
  - Deleted successfully
  - Linked to categories

- [x] **Orders Working**
  - Created with items
  - Total auto-calculated
  - Items stored in order_items table
  - Retrieved with items
  - Status updated
  - Deleted with items

- [x] **Authorization Working**
  - Admin can access all endpoints
  - User blocked from admin endpoints
  - Public endpoints work without auth

- [x] **Validation Working**
  - Invalid data rejected
  - Error messages clear
  - Database integrity maintained

---

## 🎯 What's Been Tested

### ✅ Database Operations
- **INSERT**: Categories, Products, Orders, Order Items
- **SELECT**: All tables with filters and pagination
- **UPDATE**: All tables
- **DELETE**: All tables with cascade

### ✅ Business Logic
- Order total auto-calculation
- Order items creation in transaction
- Category-product relationship
- User-order ownership

### ✅ Security
- JWT authentication
- Role-based authorization (Admin vs User)
- Input validation
- SQL injection prevention (via Supabase)

### ✅ API Features
- Pagination
- Filtering
- Sorting
- Error handling
- Consistent response format

---

## 🎉 You're Ready!

All APIs are working perfectly:
- ✅ Data inserting correctly
- ✅ Data updating correctly
- ✅ Data deleting correctly
- ✅ Relationships maintained
- ✅ Validation working
- ✅ Authorization working

### Next Steps:
1. **Connect Frontend** - Use the Postman collection as API reference
2. **Deploy** - Deploy to production when ready
3. **Monitor** - Check Supabase logs for any issues

---

## 📞 Need Help?

### Common Commands
```bash
# Start server
npm run dev

# Run tests
node test-complete-api.js

# Check server health
curl http://localhost:3000/health
```

### Quick Checks
```bash
# Check if server is running
netstat -ano | findstr :3000

# View server logs
# (Check terminal where npm run dev is running)
```

### Database Queries
```sql
-- Check all data
SELECT 'categories' as table, COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items;

-- View recent orders with items
SELECT 
  o.id, o.total_amount, o.status,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 5;
```

---

## 📚 Documentation Files

- `README_TESTING.md` - Detailed testing guide
- `TESTING_CHECKLIST.md` - Complete checklist
- `database-setup.sql` - Database schema
- `test-complete-api.js` - Automated test script
- `Herbal_Complete_API.postman_collection.json` - Postman collection

**Everything is working perfectly! 🎊**
