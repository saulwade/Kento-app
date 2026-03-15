# Kento Data Model

## Entities

### Restaurant
- id
- name
- ownerUserId
- createdAt

### User
- id
- clerkId
- restaurantId
- name
- email
- role
- createdAt

### Ingredient
- id
- restaurantId
- name
- unit
- currentStock
- costPerUnit
- minStockLevel
- supplierName
- createdAt

### Recipe
- id
- restaurantId
- menuItemId
- name
- createdAt

### RecipeIngredient
- id
- recipeId
- ingredientId
- quantity

### MenuItem
- id
- restaurantId
- name
- sellingPrice
- category
- isActive
- createdAt

### InventoryTransaction
- id
- restaurantId
- ingredientId
- type
- quantity
- notes
- createdBy
- createdAt

Supported types:
- purchase
- usage
- waste
- adjustment

### StaffRole
- id
- restaurantId
- name
- createdAt

### Checklist
- id
- restaurantId
- title
- roleId
- shiftType
- createdAt

### ChecklistTask
- id
- checklistId
- label
- sortOrder

### ChecklistCompletion
- id
- checklistId
- completedBy
- completedAt
- shiftDate

## Logic notes

- ingredient stock changes through inventory transactions
- recipe ingredients determine theoretical ingredient consumption
- food cost is calculated from recipe ingredient quantities and ingredient cost per unit
- menu item sales should eventually trigger automatic usage transactions