import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/_administration/document-types/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(openapi.documentTypes.list.queryOptions());
  },
});

import { Suspense } from "react";

import { ErrorZone } from "#/components/ErrorZone";

import DocumentTypesTable from "#/features/document-types/components/DocumentTypesTable";
import { openapi } from "#/lib/openapi";
import Header from "#/components/ui/Header";
import Button from "#/components/ui/Button";

function RouteComponent() {
  return (
    <div className="text-text">
      <ErrorZone>
        <Header
          action={
            <Link to="/administration/document-types/add">
              <Button>Add</Button>
            </Link>
          }
        ></Header>
        <div className="m-auto flex w-200 flex-col gap-4">
          <Suspense fallback={<p>loading...</p>}>
            <DocumentTypesTable />
          </Suspense>
        </div>
      </ErrorZone>
    </div>
  );
}
