# Copilot Instructions for This Workshop

## Objective
Build a procurement management system with core modules for Purchase Requisition (PR), Purchase Order (PO), and Goods Receipt (GR).
A procurement system manages how a company buys things, with control and traceability from request to receiving.

The modules for a MVP (minimum viable product) procurement system include:
- **Purchase Requisition (PR)**: Employees request items/services, which are reviewed and approved by managers.
- **Purchase Order (PO)**: Approved requisitions are converted into purchase orders sent to suppliers, tracking order details and status.
- **Goods Receipt (GR)**: When items are delivered, a goods receipt is created to confirm what was received, update inventory, and trigger payment.

In this workshop, we focus on using a prebuilt baseline and a add a backlog sprint.

Reference plan: `docs/plan.md`.

## Scope Constraints (Strict)
- Baseline provided in repo: database schema + Home/Dashboard + PR module (list/create/detail + required PR APIs).
- Participant implementation scope: PO module only (PO list/create/detail + PO APIs + PO validations).
- GR module is out of implementation scope during the workshop and treated as further exploration.
- Keep business scope minimal and teachable.
- Avoid enterprise-only features (SSO, workflow engine, reporting, notifications, advanced compliance).
- Prefer clarity and small modules over abstraction-heavy architecture.

## Technology Decisions (Do Not Change)
- Backend: Fastify + JavaScript
- API style: REST JSON
- Database: PostgreSQL (Docker local)
- Frontend: Vue 3 + Vite + JavaScript
- Unit test: Jest
- E2E test: Playwright
- Do not use Prisma.

## API Requirements
- Maintain compatibility with endpoints listed in `docs/plan.md`.
- For participant backlog, prioritize PO endpoints:
	- `POST /api/purchase-orders`
	- `POST /api/purchase-orders/:id/submit`
	- `GET /api/purchase-orders/:id`
	- `GET /api/purchase-orders/:id/open-lines`
- Enforce PO rule: allocation qty <= PR line remaining qty.
- GR endpoints/rules can be left untouched during workshop implementation.

## Code Style Guidance
- Keep files short and readable for workshop participants.
- Use explicit naming; avoid clever patterns.
- Include basic request validation and clear error responses.
- Favor service functions for business rules and thin route handlers.

## Testing Expectations
- Add focused Jest tests for PO business validations (especially over-allocation and status transition).
- Add Playwright coverage focused on PO pages/flow integrated with existing baseline PR data.
- Do not over-invest in test framework complexity.

## User Interface Guidelines
- Follow the existing UI patterns established in the baseline for consistency.
- Always respect the CSS variables set in the baseline for colors, spacing, and typography.
- Never use emojis in the UI or commit messages. Create a custom SVG icon if needed for visual emphasis.

## Optional Extension
- Bookmark feature (PR|PO|GR) is an optional post-backlog exercise and should be driven via GitHub Issue creation workflow.

## Workshop-First Principle
When there is a trade-off between production robustness and workshop clarity, choose workshop clarity.

---

## Implementation Quality Checklist

Use this checklist before considering any feature complete.

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
- [ ] All existing tests still pass after the change (`npm test` in `backend/`)

### Documentation
- [ ] `docs/plan.md` endpoint table updated if a new route was added
- [ ] Any non-obvious business rule has a one-line comment in the service file
- [ ] No markdown files created to document a change (use code comments instead)
