import { Suspense } from "react";
import { connection } from "next/server";
import { getTrainingCards } from "../actions/trainings";
import TrainingsManager from "./TrainingsManager";

async function TrainingsData() {
    await connection();

    const trainings = await getTrainingCards();

    return <TrainingsManager initialTrainings={trainings} />;
}

export default function TrainingsPage() {
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Fitness Studio
                </h1>

                <p className="mb-8 text-gray-500">Training schedule</p>

                <Suspense
                    fallback={
                        <div className="rounded-xl bg-white p-6 text-gray-500">
                            Loading trainings...
                        </div>
                    }
                >
                    <TrainingsData />
                </Suspense>
            </div>
        </main>
    );
}
