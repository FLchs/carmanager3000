import { useSuspenseQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { Suspense, useState } from "react";

import { orpc } from "@/lib/orpc";

import Button from "../ui/Button";
import { Table } from "../ui/table/Table";
import NewOperationModal from "./NewOperationModal";

function MaintenanceLogTable({ id }: { id: number }) {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <div className="bg-bg border-border rounded-lg border-1">
      <div className="flex flex-row justify-between px-4 pt-2">
        <h3 className="text-text-muted">Recorded operations</h3>
        <Button callback={() => setShowAddModal(true)}>Add</Button>
      </div>
      <Suspense
        fallback={<LoaderCircleIcon className="m-auto mb-4 animate-spin" />}
      >
        <OperationTable id={id} />
      </Suspense>
      <NewOperationModal
        id={id.toString()}
        onClose={() => setShowAddModal(false)}
        visible={showAddModal}
      />
    </div>
  );
}

function OperationTable({ id }: { id: number }) {
  const { data } = useSuspenseQuery(
    orpc.vehicles.operations.list.queryOptions({
      input: { params: { vehicleId: id } },
    }),
  );

  return (
    <div>
      <Table headers={["Date", "Mileage", "Note", "Type"]} rows={data} />
    </div>
  );
}

export default MaintenanceLogTable;
