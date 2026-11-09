import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-900">
                    Fitness Studio
                </h1>

                <p className="mt-2 text-gray-500">Management Dashboard</p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href="/clients"
                        className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                        <h2 className="text-xl font-semibold text-gray-900">
                            Clients
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Manage fitness studio clients
                        </p>
                    </Link>
                    <Link
                        href="/trainings"
                        className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                        <h2 className="text-xl font-semibold text-gray-900">
                            Trainings
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            View training schedule and details
                        </p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
