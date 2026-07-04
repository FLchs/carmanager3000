## Naming Conventions

### Modules (Business Logic)

Each domain lives under `src/modules/<entity>/` and contains its service and router. Services hold the business logic, routers expose it.

Use the **`verbDomain`** pattern for all service functions.

- **Format:** `verbDomain`
- **Verb:** CRUD or meaningful operation (`create`, `update`, `remove`, `get`, `list`, …)
- **Domain:** singular entity name (`Vehicle`, `User`, `Maintenance`, …)

**Rules:**

- Services contain **pure business logic**: no framework or routing code, only db layer calls.
- Avoid reserved keywords (`delete` → `remove`).
- Services return a `Result<T, E>` from `true-myth` (`ok(value)` / `err(ServiceError)`).

Example (`src/modules/vehicles/service.ts`):

```ts
export const createVehicle = async (input: z.infer<typeof createVehicleSchema>) => {
  try {
    const [{ id }] = await db.insert(vehicles).values(input).returning({ id: vehicles.id });
    return ok(id);
  } catch (error) {
    return err(new DbError(error));
  }
};
```

---

### Database (Drizzle Schema)

Each domain defines its own **Drizzle schema** file, while **relations** live in a shared file.

**Rules:**

- `src/db/schemas/<entity>.ts`: defines table structure.
- `src/db/schemas/relations.ts`: defines inter-entity relationships.

**Example files (for `vehicles`):**

```
src/
  db/
    schemas/
      vehicle.ts          # drizzle schema
      relations.ts         # global Drizzle relations
```

---

### Validation

Validation schemas live in the **`@cm3k/validation`** workspace package, shared by server and web.

**Rules:**

- One schema file per domain (`packages/validation/src/schemas/<entity>.ts`).
- Use Zod.
- Routers import validators from `@cm3k/validation`.

**Example:**

```
packages/
  validation/
    src/
      schemas/
        vehicles.ts          # createVehicleSchema, updateVehicleSchema
```

---

### oRPC Routers

Routers live next to the service in the module directory and expose **domain-level endpoints** connected to the service layer.

- **Router Name:** Plural + `Router` (`vehiclesRouter`)
- **Functions:** Verb only (`create`, `get`, etc.)
- **Business Logic:** **No** business logic — only delegate to the service.
- Routers use the contract from `@cm3k/contract` via `implement(<domainContract>)`.

- **Allowed Verbs (CRUD Operations):**
  - **`create`**: Maps to **Create**.
  - **`get`**: Maps to **Read** (single entity).
  - **`list`**: Maps to **Read** (multiple entities).
  - **`update`**: Maps to **Update**.
  - **`remove`**: Maps to **Delete** (due to JavaScript reserved keyword).

---

### TL;DR

#### Naming Summary

| Layer        | Pattern               | Example                          | Responsibility            |
|---------------|----------------------|----------------------------------|----------------------------|
| Schema        | `<entity>.ts`        | `vehicle` table                  | Table structure            |
| Relations     | `relations.ts`       | `vehiclesRelations`              | Entity relationships       |
| Validation    | `<entity>.ts`         | `createVehicleSchema`            | Input validation (shared)  |
| Service       | `verbDomain`         | `createVehicle`, `listVehicle`   | Business logic             |
| Router        | `pluralDomainRouter` | `vehiclesRouter`                 | API interface              |

---

### Full Example (for one entity: `Vehicle`)

```
apps/server/src/
├── db/
│   └── schemas/
│       ├── vehicle.ts             # drizzle schema
│       └── relations.ts           # global relations
│
├── modules/
│   └── vehicles/
│       ├── service.ts             # business logic (createVehicle, etc.)
│       └── router.ts              # exposes vehiclesRouter
│
└── routers/
    └── index.ts                   # composes all module routers

packages/
  validation/
    src/
      schemas/
        vehicles.ts                # zod schemas (shared with web)
```

Tests are colocated with the module (`router.test.ts`, `service.integration.test.ts`).

---
