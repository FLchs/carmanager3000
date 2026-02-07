# Wire Type Rules

These rules define how types are represented on the wire (HTTP/JSON or multipart)
and how they map to runtime types in services and UI code.

## Wire vs Runtime Types
- Wire types are the serialized payloads in HTTP requests/responses (JSON or multipart).
- Runtime types are the in-process representations used by services, DB adapters, and UI.
- Convert at the boundaries only (router/controllers for server, UI components for client).

### Example: Document date
Wire (JSON):
```json
{
  "date": "2024-03-10T12:00:00.000Z"
}
```
Runtime (server):
```ts
{
  date: new Date("2024-03-10T12:00:00.000Z")
}
```

## Date
- Use ISO 8601 strings (OpenAPI: `string` with `format: datetime`).
### Request example
```json
{
  "date": "2024-03-10T12:00:00.000Z"
}
```
### Response example
```json
{
  "date": "2024-03-10T12:00:00.000Z"
}
```

## File
- Use multipart only; never JSON.
- Validate presence without relying on `File` in OpenAPI schemas.
### Multipart example
```
POST /documents
Content-Type: multipart/form-data

file=@invoice.pdf
typeId=1
date=2024-03-10T12:00:00.000Z
```
### oRPC note
For file uploads, use multipart endpoints and avoid JSON serialization.

## BigInt / Large Integers
- Encode as `string` on the wire when values can exceed JS safe integer.
### Example
```json
{
  "odometer": "123456789012345"
}
```

## Decimal / Currency
- Encode as `string` with documented precision rules.
### Example
```json
{
  "amount": "1234.56"
}
```

## Enums
- Use `z.enum([...])` so values are shared and strict.
### Example
```json
{
  "status": "ACTIVE"
}
```

## Nullable vs Optional
- `optional` means the field may be absent.
- `nullable` means the field is present but null.
### Example
```json
{
  "note": null
}
```

## Unions
- Prefer discriminators to avoid ambiguous payloads.

## Checklist for New Fields
- Confirm the wire representation matches the rules above.
- Decide `optional` vs `nullable` semantics explicitly.
- Add boundary adapters for string-to-runtime conversions.
- Update API tests to use wire types in request/response payloads.
- Document new fields if they introduce non-trivial types.
