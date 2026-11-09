"use server";

import { Decimal128, type Document } from "mongodb";
import clientPromise, { dbName } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export type TrainingCard = {
    _id: string;
    trainingName: string;
    description: string;
    trainerName: string;
    specialization: string;
    duration: number;
    price: string;
    capacity: number;
    date: string;
    time: string;
};

export type TrainingFilters = {
    trainingName?: string;
    trainerName?: string;
    date?: string;
    maxPrice?: string;
};

// Захист від спеціальних символів у регулярному виразі
function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getTrainingCards( filters: TrainingFilters = {},): Promise<TrainingCard[]> {

    const client = await clientPromise;
    const db = client.db(dbName);

    const pipeline: Document[] = [
        // 1. Приєднуємо інформацію про тренування
        {
            $lookup: {
                from: "trainings",
                localField: "trainingId",
                foreignField: "_id",
                as: "training",
            },
        },
        { $unwind: "$training" },

        // 2. Приєднуємо інформацію про тренера
        {
            $lookup: {
                from: "trainers",
                localField: "training.trainerId",
                foreignField: "_id",
                as: "trainer",
            },
        },
        {
            $unwind: {
                path: "$trainer",
                preserveNullAndEmptyArrays: true,
            },
        },
    ];

    // 3. Формуємо умови фільтрації
    const match: Document = {};

    if (filters.trainingName?.trim()) {
        match["training.name"] = {
            $regex: escapeRegex(filters.trainingName.trim()),
            $options: "i",
        };
    }

    if (filters.trainerName?.trim()) {
        match["trainer.name"] = {
            $regex: escapeRegex(filters.trainerName.trim()),
            $options: "i",
        };
    }

    if (filters.date) {
        const startDate = new Date(`${filters.date}T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + 1);

        match.date = {
            $gte: startDate,
            $lt: endDate,
        };
    }

    if (filters.maxPrice?.trim()) {
        const maxPrice = Number(filters.maxPrice);

        if (!Number.isFinite(maxPrice) || maxPrice < 0) {
            throw new Error("Invalid maximum price");
        }

        match["training.price"] = {
            $lte: Decimal128.fromString(maxPrice.toFixed(2)),
        };
    }

    // 4. Застосовуємо фільтрацію, якщо є хоча б одна умова
    if (Object.keys(match).length > 0) {
        pipeline.push({ $match: match });
    }

    // 5. Вибираємо поля для картки
    pipeline.push(
        {
            $project: {
                _id: { $toString: "$_id" },
                trainingName: "$training.name",
                trainerName: "$trainer.name",
                description: "$training.description",
                specialization: "$trainer.specialization",
                duration: "$training.duration",
                price: { $toString: "$training.price" },
                capacity: "$training.capacity",
                date: "$date",
                time: "$time",
            },
        },

        // 6. Сортуємо за датою та часом
        {
            $sort: {
                date: 1,
                time: 1,
            },
        },
    );

    const result = await db
        .collection("schedules")
        .aggregate<Document>(pipeline)
        .toArray();

    return result.map(
        (item): TrainingCard => ({
            _id: String(item._id),
            date:
                item.date instanceof Date
                    ? item.date.toISOString().split("T")[0]
                    : String(item.date ?? ""),
            time: String(item.time ?? ""),
            trainingName: String(item.trainingName ?? ""),
            description: String(item.description ?? ""),
            trainerName: String(item.trainerName ?? "Trainer not assigned"),
            specialization: Array.isArray(item.specialization)
                ? item.specialization.join(", ")
                : String(item.specialization ?? ""),
            duration: Number(item.duration ?? 0),
            price: String(item.price ?? "0"),
            capacity: Number(item.capacity ?? 0),
        }),
    );
}

export async function increaseAllTrainingPrices(amount: string) {
    const normalizedAmount = amount.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(normalizedAmount)) {
        throw new Error("Enter a valid positive amount");
    }

    if (Number(normalizedAmount) <= 0) {
        throw new Error("Amount must be greater than zero");
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const result = await db.collection("trainings").updateMany(
        {},
        {
            $inc: {
                price: Decimal128.fromString(normalizedAmount),
            },
        },
    );

    revalidatePath("/trainings");

    return result.modifiedCount;
}
