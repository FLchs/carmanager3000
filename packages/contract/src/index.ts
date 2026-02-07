import { documentsContract } from "#contracts/documents";
import { documentTypesContract } from "#contracts/documentTypes";
import { operationsContract } from "#contracts/operations";
import { vehiclesContract } from "#contracts/vehicles";

export { vehiclesContract } from "#contracts/vehicles";
export { documentsContract } from "#contracts/documents";
export { documentTypesContract } from "#contracts/documentTypes";
export { operationsContract } from "#contracts/operations";
export { errors } from "#errors";

export const contract = {
  ...vehiclesContract,
  ...documentsContract,
  ...documentTypesContract,
  ...operationsContract,
};
