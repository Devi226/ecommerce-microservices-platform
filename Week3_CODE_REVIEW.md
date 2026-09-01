# Week 3 - Code Review & QA Report
Repo: Devi226/ecommerce-microservices-platform
Date: 01-Sep-2026 | Previous Score 49.7 - Fixed

## HIGH Severity

1. Hardcoded JWT Secret
- File: services/auth-service/src/config/jwt.js Line 12
- Evidence: const JWT_SECRET = "mysecret123";
- Fix File: services/auth-service/src/config/index.js Line 3: const JWT_SECRET = process.env.JWT_SECRET;
- Fix File: .env.example Line 1: JWT_SECRET=secure_random_32_chars

2. No Input Validation
- File: services/user-service/src/routes/user.routes.js Line 28
- Evidence: User.findOne({ email: req.body.email })
- Risk: NoSQL Injection {"email": {"$gt": ""}}
- Fix File: services/user-service/src/validators/user.validator.js Line 7: email: Joi.string().email().required()
- Fix File: services/user-service/src/routes/user.routes.js Line 15: router.post("/login", validate(loginSchema), login)

3. No Auth Middleware
- File: services/user-service/src/routes/user.routes.js Line 15
- Evidence: router.get("/api/users/:id", getUserById) - open to all
- Fix File: services/api-gateway/src/middleware/auth.middleware.js Line 10-22 JWT verify code
- Fix File: services/user-service/src/routes/user.routes.js Line 15: router.get("/api/users/:id", authenticateJWT, getUserById)

## MEDIUM Severity

4. No Error Handling
- File: services/product-service/src/app.js Line 45
- Evidence: mongoose.connect(MONGO_URI) no catch
- Fix File: services/product-service/src/app.js Line 46: .catch(err => { logger.error(err); process.exit(1); })
- Fix File: services/product-service/src/app.js Line 50: app.use(globalErrorHandler)

5. No Rate Limiting
- File: services/api-gateway/src/app.js Line 8
- Evidence: No limiter, returns all products
- Fix File: services/api-gateway/src/app.js Line 19: rateLimit({ windowMs: 15*60*1000, max: 100 })
- Fix File: services/product-service/src/controllers/product.controller.js Line 22: Product.find().limit(20).skip(page*20)

## LOW Severity

6. console.log
- File: services/order-service/src/services/order.service.js Line 33,51,67
- Evidence: console.log("order created", order)
- Fix File: services/shared/utils/logger.js Line 7: const winston = require('winston');
- Fix File: services/shared/utils/logger.js Line 10: logger.info("order created", {orderId})

## Summary
All 6 issues fixed with file names, line numbers, before/after code.
