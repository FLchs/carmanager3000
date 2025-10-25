import { useSuspenseQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { Suspense, useState } from "react";

import { orpc } from "@/lib/orpc";

import Button from "../ui/Button";
import { Table } from "../ui/table/Table";
import NewLogModal from "./NewLogModal";

function LogTable({ id }: { id: number }) {
  const { data } = useSuspenseQuery(
    orpc.vehicles.logs.find.queryOptions({ input: { id } }),
  );

  return (
    <div>
      <Table headers={["Date", "Mileage", "Note", "Type"]} rows={data} />
    </div>
  );
}

function MaintenanceLogTable({ id }: { id: number }) {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <div className="bg-bg border-border rounded-lg border-1">
      <div className="flex flex-row justify-between px-4 pt-2">
        <h3 className="text-text-muted">Recorded maintenance log</h3>
        <Button callback={() => setShowAddModal(true)}>Add</Button>
      </div>
      <Suspense
        fallback={<LoaderCircleIcon className="m-auto mb-4 animate-spin" />}
      >
        <LogTable id={id} />
      </Suspense>
      <NewLogModal
        id={id.toString()}
        onClose={() => setShowAddModal(false)}
        visible={showAddModal}
      />
    </div>
  );
}

export default MaintenanceLogTable;
