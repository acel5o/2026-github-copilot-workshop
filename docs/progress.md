# Project Progress

_Last updated: 2026-06-02_

---

## Overall Status

| Module | Backend API | Frontend UI | Unit Tests | E2E Tests |
|--------|-------------|-------------|------------|-----------|
| Dashboard | ✅ Done | ✅ Done | — | — |
| Purchase Requisition (PR) | ✅ Done | ✅ Done | ✅ Done | ✅ Done |
| Purchase Order (PO) | ✅ Done | ⚠️ Partial | ✅ Done | ❌ Missing |
| Goods Receipt (GR) | ❌ Out of scope | ❌ Out of scope | — | — |

---

## What Is Already Implemented

### Baseline (pre-workshop)

- **Database schema** — all 7 tables: `purchase_requisitions`, `pr_lines`, `purchase_orders`, `po_lines`, `pr_line_allocations`, `goods_receipts`, `gr_lines` (via `db/migrations/001_init_procurement_mvp.sql`)
- **Seed data** — realistic test data for PRs and POs (via `db/seeds/002_seed_procurement_mvp.sql`)
- **PR API** — full CRUD + status transitions (list, create, submit, approve, detail, open-lines)
- **PR frontend pages** — List, Create, Detail (Vue 3 + Vite)
- **Dashboard page** — summary stats from `/api/dashboard`
- **PR unit tests** — `backend/tests/services/requisition-service.test.js`
- **PR E2E tests** — `tests/e2e/pr-module.spec.js`

### PO Module (implemented during workshop)

- **All 5 PO API endpoints** — fully implemented in `backend/src/routes/purchase-order-routes.js` and `backend/src/services/purchase-order-service.js`
- **PO unit tests** — 17 tests covering validation, over-allocation guard, PR status enforcement, and successful creation

---

## PO API Endpoints

| Method | Path | Description | Status |
|--------|------|-------------|--------|
| `GET` | `/api/purchase-orders` | List all POs | ✅ Done |
| `POST` | `/api/purchase-orders` | Create PO from approved PR lines | ✅ Done |
| `GET` | `/api/purchase-orders/:id` | PO detail with lines and allocations | ✅ Done |
| `POST` | `/api/purchase-orders/:id/submit` | Transition DRAFT → SUBMITTED | ✅ Done |
| `GET` | `/api/purchase-orders/:id/open-lines` | Lines with qty open for GR | ✅ Done |

### Business Rules Enforced

- PO can only be created from an **APPROVED** PR (rejects DRAFT/SUBMITTED with 422)
- Allocated qty per line **must not exceed** remaining PR line qty (over-allocation returns 422)
- Creation uses a DB transaction with `FOR UPDATE` row-lock to prevent race conditions
- `submitPurchaseOrder` enforces DRAFT → SUBMITTED transition; any other current status returns 422

---

## Remaining Gaps

### Frontend — PO module incomplete

| Item | File | Issue |
|------|------|-------|
| `api.js` PO functions missing | `frontend/src/api.js` | No `listPurchaseOrders`, `createPurchaseOrder`, `getPurchaseOrder`, `submitPurchaseOrder`, `getOpenPoLines` |
| PO Create page not wired | `frontend/src/pages/PurchaseOrderCreatePage.vue` | `handleSubmit()` only logs to console; no API call, no redirect |
| PO List page missing | — | No `PurchaseOrderListPage.vue` component |
| PO Detail page missing | — | No `PurchaseOrderDetailPage.vue` component |
| Router routes incomplete | `frontend/src/router/index.js` | Missing `/purchase-orders` and `/purchase-orders/:id` routes |

### Tests

- No Playwright E2E test for the PO module flow
- PO unit tests missing a happy-path "APPROVED PR succeeds" explicit assertion (covered implicitly by creation tests)

---

## Next Steps (Priority Order)

1. Add PO API functions to `frontend/src/api.js`
2. Wire `PurchaseOrderCreatePage.vue` to call `api.createPurchaseOrder()` and redirect on success
3. Create `PurchaseOrderListPage.vue`
4. Create `PurchaseOrderDetailPage.vue` with a Submit button
5. Register the two new routes in `frontend/src/router/index.js`
6. Add Playwright E2E tests for PO create flow (`tests/e2e/po-module.spec.js`)
