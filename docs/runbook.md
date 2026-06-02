# PO Module Implementation Runbook

## Task Sequence

### Phase 1 — Frontend Wiring
*No dependencies — complete before any page work.*

- [ ] Add 5 PO methods to `frontend/src/api.js`: `listPurchaseOrders`, `createPurchaseOrder`, `getPurchaseOrder`, `submitPurchaseOrder`, `getOpenPoLines`
- [ ] Register 3 PO routes in `frontend/src/router/index.js`: `/purchase-orders`, `/purchase-orders/new`, `/purchase-orders/:id`

**Checkpoint A:** Navigating to `/purchase-orders` resolves a route without a 404.

---

### Phase 2 — Frontend Pages
*Parallel. Depends on Phase 1.*

- [ ] Create `frontend/src/pages/PurchaseOrderListPage.vue` — mirror `RequisitionListPage.vue`
- [ ] Create `frontend/src/pages/PurchaseOrderCreatePage.vue` — fetches open PR lines, builds PO line items, posts to API
- [ ] Create `frontend/src/pages/PurchaseOrderDetailPage.vue` — shows header, lines, and submit button

**Checkpoint B:** List renders seeded POs; create form posts and redirects to detail; submit button transitions DRAFT → SUBMITTED.

---

### Phase 3 — Backend Test Completion
*Parallel with Phase 2.*

- [ ] Happy-path: `createPurchaseOrder` inserts and returns full PO
- [ ] Rejection: over-allocation throws with a clear error message
- [ ] Rejection: `submitPurchaseOrder` rejects non-DRAFT status
- [ ] Happy-path: `submitPurchaseOrder` transitions DRAFT → SUBMITTED

File: `backend/tests/services/purchase-order-service.test.js`

**Checkpoint C:** `npm test` in `backend/` — all tests pass, no skips.

---

### Phase 4 — E2E Test
*Depends on Phase 2.*

- [ ] Create `tests/e2e/po-module.spec.js` — covers: navigate to PO list, create PO from an approved PR, submit PO, verify status on detail page

Reference: `tests/e2e/pr-module.spec.js`

**Checkpoint D:** `npx playwright test` passes the PO spec.

---

### Phase 5 — Docs
- [x] `docs/plan.md` already lists all 4 PO endpoints — no update required

---

## Implementation Quality Checklist

Use before marking any task complete.

### Code
- [ ] Route handler is thin — business logic lives in the service layer
- [ ] All inputs validated at the API boundary with a clear 400 error response
- [ ] No raw SQL strings duplicated across files — queries belong in the service
- [ ] No dead code, commented-out blocks, or unused imports left behind
- [ ] File stays short enough to read in one screen without scrolling

### Business Rules
- [ ] PO allocation qty never exceeds PR line remaining qty (enforced in service)
- [ ] Status transitions are explicit and reject invalid states with a clear error
- [ ] PO can only be created from an approved PR

### Testing
- [ ] Jest unit test covers the happy path for each new service function
- [ ] Jest unit test covers the key rejection case (e.g., over-allocation, bad status)
- [ ] Playwright E2E test covers the primary user flow for any new page
- [ ] Tests use realistic seed data; no magic numbers without a comment
- [ ] All existing tests still pass (`npm test` in `backend/`)

### Documentation
- [ ] `docs/plan.md` endpoint table updated if a new route was added
- [ ] Any non-obvious business rule has a one-line comment in the service file
- [ ] No markdown files created to document a change (use code comments instead)

---

## Reference Files

| Purpose | File |
|---------|------|
| List page pattern | `frontend/src/pages/RequisitionListPage.vue` |
| Create form pattern | `frontend/src/pages/RequisitionCreatePage.vue` |
| Detail + action button pattern | `frontend/src/pages/RequisitionDetailPage.vue` |
| Existing API methods to mirror | `frontend/src/api.js` |
| Route registration pattern | `frontend/src/router/index.js` |
| Fully implemented service (do not change) | `backend/src/services/purchase-order-service.js` |
| Fully implemented routes (do not change) | `backend/src/routes/purchase-order-routes.js` |
| Tests to complete | `backend/tests/services/purchase-order-service.test.js` |
| E2E pattern | `tests/e2e/pr-module.spec.js` |
