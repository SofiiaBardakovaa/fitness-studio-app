"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import clientPromise, { dbName } from "@/lib/mongodb";

export type Client = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    homeAddress?: {
        address: string;
    };
    notes?: string;
};

type ClientDocument = {
    _id: ObjectId;
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    homeAddress?: {
        address: string;
    };
    notes?: string;
};

export async function getClients(search = ""): Promise<Client[]> {
    const client = await clientPromise;
    const db = client.db(dbName);

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const filter = search
        ? {
              $or: [
                  { name: { $regex: escapedSearch, $options: "i" } },
                  { email: { $regex: escapedSearch, $options: "i" } },
                  { phone: { $regex: escapedSearch, $options: "i" } },
              ],
          }
        : {};

    const clients = await db
        .collection<ClientDocument>("clients")
        .find(filter)
        .sort({ name: 1 })
        .toArray();

    return clients.map(
        (item): Client => ({
            _id: item._id.toString(),
            name: item.name,
            email: item.email,
            phone: item.phone,
            dateOfBirth: item.dateOfBirth
                ? new Date(item.dateOfBirth).toISOString().split("T")[0]
                : undefined,
            homeAddress: item.homeAddress
                ? { address: item.homeAddress.address }
                : undefined,
            notes: item.notes,
        }),
    );
}

export async function addClient(data: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    homeAddress?: {
        address: string;
    };
    notes?: string;
}) {
    if (!data.name || !data.email || !data.phone) {
        throw new Error("Name, email and phone are required");
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    await db.collection("clients").insertOne({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim().startsWith("+")
            ? data.phone.trim()
            : `+372${data.phone.trim()}`,
        ...(data.dateOfBirth && {
            dateOfBirth: new Date(data.dateOfBirth),
        }),
        ...(data.homeAddress?.address?.trim() && {
            homeAddress: {
                address: data.homeAddress.address.trim(),
            },
        }),
        ...(data.notes?.trim() && {
            notes: data.notes.trim(),
        }),
    });

    revalidatePath("/clients");
}

export async function updateClient(
    id: string,
    data: {
        name: string;
        email: string;
        phone: string;
        dateOfBirth?: string;
        homeAddress?: {
            address: string;
        };
        notes?: string;
    },
) {
    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid client ID");
    }

    if (!data.name.trim() || !data.email.trim() || !data.phone.trim()) {
        throw new Error("Name, email and phone are required");
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const updateFields: Record<string, unknown> = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim().startsWith("+")
            ? data.phone.trim()
            : `+372${data.phone.trim()}`,
    };

    const unsetFields: Record<string, ""> = {};

    if (data.dateOfBirth) {
        updateFields.dateOfBirth = new Date(data.dateOfBirth);
    } else {
        unsetFields.dateOfBirth = "";
    }

    if (data.homeAddress?.address?.trim()) {
        updateFields.homeAddress = {
            address: data.homeAddress.address.trim(),
        };
    } else {
        unsetFields.homeAddress = "";
    }

    if (data.notes?.trim()) {
        updateFields.notes = data.notes.trim();
    } else {
        unsetFields.notes = "";
    }

    await db.collection("clients").updateOne(
        { _id: new ObjectId(id) },
        {
            $set: updateFields,
            $unset: unsetFields,
        },
    );

    revalidatePath("/clients");
}

export async function deleteClient(id: string) {
    if (!ObjectId.isValid(id)) {
        throw new Error("Invalid client ID");
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    await db.collection("clients").deleteOne({
        _id: new ObjectId(id),
    });

    revalidatePath("/clients");
}
