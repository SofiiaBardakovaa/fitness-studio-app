
import { Suspense } from "react";
import { connection } from "next/server";
import { getClients } from "../actions/clients";
import type { Client } from "../actions/clients";
import ClientManager from "./ClientManager";

async function ClientsData() {
    await connection();

    const clients: Client[] = await getClients();

    return <ClientManager initialClients={clients} />;
}

export default function ClientsPage() {
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Fitness Studio
                    </h1>
                </div>

                <Suspense
                    fallback={
                        <div className="rounded-xl bg-white p-6 text-gray-500">
                            Loading clients...
                        </div>
                    }
                >
                    <ClientsData />
                </Suspense>
            </div>
        </main>
    );
}
