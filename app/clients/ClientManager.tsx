"use client";

import { useState } from "react";
import {
    getClients,
    addClient,
    updateClient,
    deleteClient,
} from "../actions/clients";
import type { Client } from "../actions/clients";

type Props = {
    initialClients: Client[];
};

export default function ClientManager({ initialClients }: Props) {
    const [clients, setClients] = useState(initialClients);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    async function handleSearch() {
        setLoading(true);
        setError("");

        try {
            const result = await getClients(search);
            setClients(result);
        } catch {
            setError("Failed to search clients.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddClient(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);

        try {
            await addClient({
                name: String(formData.get("name") || ""),
                email: String(formData.get("email") || ""),
                phone: String(formData.get("phone") || ""),
                dateOfBirth:
                    String(formData.get("dateOfBirth") || "") || undefined,
                homeAddress: {
                    address: String(formData.get("address") || ""),
                },
                notes: String(formData.get("notes") || ""),
            });

            const result = await getClients(search);
            setClients(result);
            setShowForm(false);
        } catch {
            setError("Failed to add client. Check the email and phone.");
        } finally {
            setLoading(false);
        }
    }

    async function handleEditClient(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!editingClient) return;

        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);

        try {
            await updateClient(editingClient._id, {
                name: String(formData.get("name") || ""),
                email: String(formData.get("email") || ""),
                phone: String(formData.get("phone") || ""),
                dateOfBirth:
                    String(formData.get("dateOfBirth") || "") || undefined,
                homeAddress: {
                    address: String(formData.get("address") || ""),
                },
                notes: String(formData.get("notes") || ""),
            });

            setClients(await getClients(search));
            setEditingClient(null);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update client.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteClient(id: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this client?",
        );

        if (!confirmed) return;

        setLoading(true);
        setError("");

        try {
            await deleteClient(id);
            setClients(await getClients(search));
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete client.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Clients</h2>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="rounded-lg bg-blue-600 px-14 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    {showForm ? "Cancel" : "Add Client"}
                </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") handleSearch();
                    }}
                    placeholder="Search by name, email or phone..."
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />

                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                >
                    Search
                </button>

                <button
                    onClick={async () => {
                        setSearch("");
                        setLoading(true);
                        try {
                            setClients(await getClients());
                        } finally {
                            setLoading(false);
                        }
                    }}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50"
                >
                    Reset
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <form
                        onSubmit={handleAddClient}
                        onClick={(event) => event.stopPropagation()}
                        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Add new client
                            </h3>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="text-2xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Name *
                                </label>
                                <input
                                    name="name"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Email *
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Phone *
                                </label>
                                <input
                                    name="phone"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Date of birth
                                </label>
                                <input
                                    name="dateOfBirth"
                                    type="date"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium">
                                    Home address
                                </label>
                                <input
                                    name="address"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="mt-4 text-sm text-red-600">{error}</p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Add Client"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {editingClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <form
                        onSubmit={handleEditClient}
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Edit client
                            </h3>

                            <button
                                type="button"
                                onClick={() => setEditingClient(null)}
                                className="text-2xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Name *
                                </label>
                                <input
                                    name="name"
                                    required
                                    defaultValue={editingClient.name}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Email *
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    defaultValue={editingClient.email}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Phone *
                                </label>
                                <input
                                    name="phone"
                                    required
                                    defaultValue={editingClient.phone}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Date of birth
                                </label>
                                <input
                                    name="dateOfBirth"
                                    type="date"
                                    defaultValue={
                                        editingClient.dateOfBirth || ""
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium">
                                    Home address
                                </label>
                                <input
                                    name="address"
                                    defaultValue={
                                        editingClient.homeAddress?.address || ""
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    rows={3}
                                    defaultValue={editingClient.notes || ""}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="mt-4 text-sm text-red-600">{error}</p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditingClient(null)}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-sm text-gray-500">
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Date of birth</th>
                            <th className="px-4 py-3">Home address</th>
                            <th className="px-4 py-3">Notes</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clients.map((client) => (
                            <tr
                                key={client._id}
                                className="border-b last:border-0 hover:bg-gray-50"
                            >
                                <td className="px-4 py-4 font-medium text-gray-900">
                                    {client.name}
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    {client.email}
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    {client.phone}
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    {client.dateOfBirth || "—"}
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    {client.homeAddress?.address || "—"}
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    {client.notes || "—"}
                                </td>
                                <td className="px-4 py-4 text-right whitespace-nowrap">
                                    <button
                                        onClick={() => setEditingClient(client)}
                                        className="mr-3 text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteClient(client._id)
                                        }
                                        disabled={loading}
                                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {clients.length === 0 && (
                    <p className="py-10 text-center text-gray-500">
                        No clients found.
                    </p>
                )}
            </div>

            <p className="mt-4 text-sm text-gray-500">
                Total clients: {clients.length}
            </p>
        </div>
    );
}
