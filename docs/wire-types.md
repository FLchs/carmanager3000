# Wire Type Rules

These rules define how types are represented on the wire (HTTP/JSON or multipart).

## Date
- Use ISO 8601 strings (OpenAPI: `string` with `format: datetime`).

## File
- Use multipart only; never JSON.
- Validate presence without relying on `File` in OpenAPI schemas.

## BigInt / Large Integers
- Encode as `string` on the wire when values can exceed JS safe integer.

## Decimal / Currency
- Encode as `string` with documented precision rules.

## Enums
- Use `z.enum([...])` so values are shared and strict.

## Nullable vs Optional
- `optional` means the field may be absent.
- `nullable` means the field is present but null.

## Unions
- Prefer discriminators to avoid ambiguous payloads.
