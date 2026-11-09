"use client";

import { useState } from "react";
import {
    getTrainingCards,
    increaseAllTrainingPrices,
    type TrainingCard,
    type TrainingFilters,
} from "../actions/trainings";

type Props = {
    initialTrainings: TrainingCard[];
};

export default function TrainingsManager({ initialTrainings }: Props) {
    const [trainings, setTrainings] = useState(initialTrainings);

    const [trainingName, setTrainingName] = useState("");
    const [trainerName, setTrainerName] = useState("");
    const [date, setDate] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [priceIncrease, setPriceIncrease] = useState("");
    const [updatingPrices, setUpdatingPrices] = useState(false);

    async function handleFilter() {
        setLoading(true);
        setError("");

        const filters: TrainingFilters = {
            trainingName: trainingName.trim(),
            trainerName: trainerName.trim(),
            date,
            maxPrice,
        };

        try {
            const result = await getTrainingCards(filters);
            setTrainings(result);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to filter trainings.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleReset() {
        setTrainingName("");
        setTrainerName("");
        setDate("");
        setMaxPrice("");

        setLoading(true);
        setError("");

        try {
            const result = await getTrainingCards();
            setTrainings(result);
        } catch {
            setError("Failed to reset filters.");
        } finally {
            setLoading(false);
        }
    }

    async function handleIncreasePrices() {
        if (!priceIncrease.trim() || Number(priceIncrease) <= 0) {
            setError("Enter a valid amount.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to increase the price of ALL trainings by €${priceIncrease}?`,
        );

        if (!confirmed) return;

        setUpdatingPrices(true);
        setError("");

        try {
            const modifiedCount =
                await increaseAllTrainingPrices(priceIncrease);

            const updatedTrainings = await getTrainingCards();

            setTrainings(updatedTrainings);
            setPriceIncrease("");

            alert(
                `Prices updated successfully! Updated trainings: ${modifiedCount}`,
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update training prices.",
            );
        } finally {
            setUpdatingPrices(false);
        }
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    Upcoming Trainings
                </h2>
            </div>

            {/* Filters */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-semibold text-gray-900">
                    Filter trainings
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Training name
                        </label>
                        <input
                            type="text"
                            value={trainingName}
                            onChange={(e) => setTrainingName(e.target.value)}
                            placeholder="e.g. Yoga"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Trainer
                        </label>
                        <input
                            type="text"
                            value={trainerName}
                            onChange={(e) => setTrainerName(e.target.value)}
                            placeholder="e.g. John Miller"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Price (euro)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="e.g. 20"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        onClick={handleFilter}
                        disabled={loading}
                        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Apply filters"}
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Reset
                    </button>
                </div>

                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>

            {/* Update all training prices */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Increase all training prices
                </h3>

                <div className="flex flex-wrap items-end gap-3">
                    <div className="w-full sm:w-64">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Price increase (euro)
                        </label>

                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={priceIncrease}
                            onChange={(e) => setPriceIncrease(e.target.value)}
                            placeholder="e.g. 5"
                            disabled={updatingPrices}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleIncreasePrices}
                        disabled={updatingPrices || !priceIncrease.trim()}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {updatingPrices ? "Updating..." : "Increase all prices"}
                    </button>
                </div>
            </div>

            {/* Training cards */}
            {trainings.length === 0 ? (
                <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
                    No scheduled trainings found.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {trainings.map((training) => (
                        <div
                            key={training._id}
                            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                        >
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">
                                {training.trainingName}
                            </h3>
                            {training.description && (
                                <p className="mb-4 text-sm text-gray-500">
                                    {training.description}
                                </p>
                            )}

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Date</span>
                                    <span className="font-medium text-gray-900">
                                        {training.date}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Time</span>
                                    <span className="font-medium text-gray-900">
                                        {training.time}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Trainer</span>
                                    <span className="font-medium text-gray-900">
                                        {training.trainerName}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Duration</span>
                                    <span className="font-medium text-gray-900">
                                        {training.duration} min
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Price</span>
                                    <span className="font-semibold text-gray-900">
                                        €{training.price}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Capacity</span>
                                    <span className="font-medium text-gray-900">
                                        {training.capacity} people
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="mt-4 text-sm text-gray-500">
                Total trainings: {trainings.length}
            </p>
        </>
    );
}
