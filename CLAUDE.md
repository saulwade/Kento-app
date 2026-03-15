# Kento - Project Context

Kento is a modern SaaS web app for restaurant operations.

Its purpose is to solve internal restaurant operational problems, not marketing or customer acquisition.

Core problems Kento solves:
1. Inventory control
2. Food cost control
3. Staff operations and checklist compliance

## Product principles

- Focus on operational clarity
- Minimize manual work
- Keep flows simple for restaurant owners and managers
- Prioritize usability over complexity
- Design should feel premium, calm, minimal, and modern
- Avoid cluttered dashboards
- Every feature should save time or reduce operational mistakes

## Tech stack

- Next.js
- React
- TailwindCSS
- Clerk for authentication
- Convex for backend and database

## Main modules

- Dashboard
- Inventory
- Menu & Recipes
- Food Cost
- Staff
- Settings

## Core logic

### Inventory
Ingredients have units, stock, supplier price, and transaction history.

Supported inventory transaction types:
- purchase
- usage
- waste
- adjustment

### Recipes
Each menu item can be linked to a recipe.
Recipes define ingredient consumption per sale.

When a sale is recorded, ingredient stock should be deducted automatically.

### Food Cost
Food cost is calculated from recipe ingredient quantities and current ingredient costs.

### Staff
Managers can create operational checklists by role or shift.
Employees mark tasks complete.
Managers can review compliance.

## Design rules

- Light background
- Large spacing
- Soft shadows
- Rounded cards
- Minimal borders
- Premium SaaS look
- Calm neutral palette
- Avoid visual noise
- Use clear hierarchy and whitespace

## UI behavior rules

- Keep forms short and segmented
- Prefer cards over dense tables when possible
- Show only the most relevant KPIs
- Use empty states thoughtfully
- Show alerts only when operationally important

## Engineering rules

- Use modular components
- Keep files clean and easy to scale
- Create reusable UI primitives
- Separate business logic from UI components
- Prefer clear naming over clever naming
- Do not overengineer first version
- Build MVP-ready structure first

## What to optimize for

- speed to build
- clean codebase
- simple user flows
- scalability for future POS integrations

## Avoid

- unnecessary complexity
- fake demo logic when real logic can be built
- overly decorative UI
- generic startup copy that does not relate to restaurant operations