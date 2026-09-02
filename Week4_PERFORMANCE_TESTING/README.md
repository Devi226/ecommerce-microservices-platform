# Week 4 - Performance Testing and Optimization

## Overview
E-commerce platform handles 10,000 VU. 5 services: api-gateway (app.js line10 JWT 2ms, line19 rate limit 100/min, line25 proxy user-service:3002), user-service, product-service (Redis), order-service (MongoDB), payment-service (Stripe idempotency line21).

## Testing Procedures
1. Gateway Load (K6): vus 1000 duration 5m, endpoints /auth/login /products /users/me, p95<200ms fail<1%, X-RateLimit headers
2. Payment Idempotency: same orderId 5 times same key -> 1 PaymentIntent (payment.service.js line21)
3. Product Caching: 5000 RPS, 450ms->45ms, hit ratio >85%
4. Order DB: Index {userId:1, createdAt:-1}, 2.3s->85ms, docsExamined 1M->50, explain IXSCAN
5. Spike Stress: Artillery 1k->10k, chaos kill pod, circuit breaker 503
6. Monitoring: Prometheus http_request_duration_seconds, Grafana P95, alert >500ms 2min

## Expected Outcomes
Gateway 429 healthy, CPU70% at 10k p95 150ms, Redis 400->50ms, Order 1M->50 docs, Payment 1 intent, breakpoint 15k (50% safety), soak 8hr mem<5% error<0.5%, p95>p50*3 tail latency = event loop block

## Optimization Plan 4 Phases
Phase1 Day0-2: Redis rate limiter, compression, helmet, JWT cache 2ms->0.5ms, retry backoff 3x 100ms
Phase2 Day3-5: LRU+Redis, RabbitMQ invalidation, compound indexes, cursor pagination, readPreference secondary
Phase3 Week2: HPA 3->10 CPU60%, opossum breaker for user-service:3002, Cloudflare CDN 70% offload, poolSize 20 keepAlive 65000
Phase4 Week3+: gRPC 30% cut, sharding userId hash, BullMQ webhooks async, K6 CI fail if p95>200ms, budget 200KB 500ms Lighthouse CI
Validation: p95 -40%, throughput 2k->4k RPS, Mongo read -60% cost

GitHub: https://github.com/Devi226/ecommerce-microservices-platform
Intern: Devi226 | Date: 02-09-2026
