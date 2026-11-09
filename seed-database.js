const fitnessDb = db.getSiblingDB("fitness_studio_db");

// 1. CLIENTS
// 3. INSERT CLIENT DOCUMENTS
fitnessDb.clients.insertMany([
    {
        name: "Anna Smith",
        phone: "+1234567890",
        email: "anna@gmail.com",
        homeAddress: {
            address: "Kesklinn, Tallinn, Estonia",
            point: {
                type: "Point",
                coordinates: [24.7536, 59.437],
            },
        },
    },
    {
        name: "John Doe",
        phone: "+0987654321",
        email: "john@gmail.com",
        homeAddress: {
            address: "Lasnamäe, Tallinn, Estonia",
            point: {
                type: "Point",
                coordinates: [24.797, 59.448],
            },
        },
    },
    {
        name: "Emily Johnson",
        phone: "+1122334455",
        email: "emily22@gmail.com",
        homeAddress: {
            address: "Mustamäe, Tallinn, Estonia",
            point: {
                type: "Point",
                coordinates: [24.658, 59.397],
            },
        },
    },
]);

// 2. TRAINERS
fitnessDb.trainers.insertMany([
    {
        name: "John Miller",
        email: "john@example.com",
        phone: "+3725550201",
        specialization: ["Yoga", "Stretching"],
        experience: 5,
    },
    {
        name: "Kate Wilson",
        email: "kate@example.com",
        phone: "+3725550202",
        specialization: ["Pilates"],
        experience: 3,
    },
    {
        name: "David Taylor",
        email: "david@example.com",
        phone: "+3725550203",
        specialization: ["Fitness", "Strength Training"],
        experience: 7,
    },
]);

// 3. GET TRAINERS
const john = fitnessDb.trainers.findOne({
    email: "john@example.com",
});

const kate = fitnessDb.trainers.findOne({
    email: "kate@example.com",
});

const david = fitnessDb.trainers.findOne({
    email: "david@example.com",
});

if (!john || !kate || !david) {
    throw new Error("Trainer not found!");
}

// 4. TRAININGS
fitnessDb.trainings.insertMany([
    {
        name: "Morning Yoga",
        duration: 60,
        price: Decimal128("15.00"),
        capacity: 12,
        trainerId: john._id,
        location: {
            name: "Central Fitness Studio",
            address: "P.Pinna 34, Tallinn, Estonia",
            point: {
                type: "Point",
                coordinates: [24.7536, 59.437],
            },
        },
    },
    {
        name: "Pilates Basics",
        duration: 50,
        price: Decimal128("18.00"),
        capacity: 10,
        trainerId: kate._id,
        location: {
            name: "Lasnamäe Centrum",
            address: "Puu 67, Tallinn, Estonia",
            point: {
                type: "Point",
                coordinates: [24.7666, 59.5876],
            },
        },
    },
    {
        name: "Strength Training",
        duration: 60,
        price: Decimal128("20.00"),
        capacity: 8,
        trainerId: david._id,
        location: {
            name: "Mustamäe Gym",
            address: "Safari 90, Tallinn, Estonia",
            point: {
                type: "Point",
                coordinates: [24.6536, 59.397],
            },
        },
    },
    {
        name: "Yoga for Beginners",
        duration: 50,
        price: Decimal128("14.00"),
        capacity: 12,
        trainerId: john._id,
        location: {
            name: "Central Fitness Studio",
            address: "Tallinn, Estonia (demo location)",
            point: {
                type: "Point",
                coordinates: [24.7536, 59.437],
            },
        },
    },
]);

// 5. GET TRAININGS
const yoga = fitnessDb.trainings.findOne({
    name: "Morning Yoga",
});

const pilates = fitnessDb.trainings.findOne({
    name: "Pilates Basics",
});

const strength = fitnessDb.trainings.findOne({
    name: "Strength Training",
});

if (!yoga || !pilates || !strength) {
    throw new Error("Training not found!");
}

// 6. SCHEDULES
fitnessDb.schedules.insertMany([
    {
        trainingId: yoga._id,
        date: ISODate("2026-11-10T00:00:00Z"),
        time: "10:00",
    },
    {
        trainingId: yoga._id,
        date: ISODate("2026-11-17T00:00:00Z"),
        time: "18:00",
    },
    {
        trainingId: pilates._id,
        date: ISODate("2026-11-14T00:00:00Z"),
        time: "12:00",
    },
    {
        trainingId: pilates._id,
        date: ISODate("2026-11-23T00:00:00Z"),
        time: "17:00",
    },
    {
        trainingId: strength._id,
        date: ISODate("2026-11-18T00:00:00Z"),
        time: "09:00",
    },
    {
        trainingId: strength._id,
        date: ISODate("2026-11-20T00:00:00Z"),
        time: "19:00",
    },
]);

// 7. GET CLIENTS
const anna = fitnessDb.clients.findOne({
    email: "anna@gmail.com",
});

const johnClient = fitnessDb.clients.findOne({
    email: "john@gmail.com",
});

const emily = fitnessDb.clients.findOne({
    email: "emily22@gmail.com",
});

if (!anna || !johnClient || !emily) {
    throw new Error("Client not found!");
}

// 8. GET SCHEDULE SESSIONS
const yogaSession = fitnessDb.schedules.findOne({
    trainingId: yoga._id,
    date: ISODate("2026-11-10T00:00:00Z"),
    time: "10:00",
});

const pilatesSession = fitnessDb.schedules.findOne({
    trainingId: pilates._id,
    date: ISODate("2026-11-14T00:00:00Z"),
    time: "12:00",
});

const strengthSession = fitnessDb.schedules.findOne({
    trainingId: strength._id,
    date: ISODate("2026-11-18T00:00:00Z"),
    time: "09:00",
});

if (!yogaSession || !pilatesSession || !strengthSession) {
    throw new Error("Schedule session not found!");
}

// 9. BOOKINGS
fitnessDb.bookings.insertMany([
    {
        clientId: anna._id,
        scheduleId: yogaSession._id,
        createdAt: new Date(),
        status: "Confirmed",
    },
    {
        clientId: johnClient._id,
        scheduleId: strengthSession._id,
        createdAt: new Date(),
        status: "Confirmed",
    },
    {
        clientId: emily._id,
        scheduleId: pilatesSession._id,
        createdAt: new Date(),
        status: "Confirmed",
    },
]);

// 10. RESULT
print("Database successfully populated!");

print("Clients: " + fitnessDb.clients.countDocuments());
print("Trainers: " + fitnessDb.trainers.countDocuments());
print("Trainings: " + fitnessDb.trainings.countDocuments());
print("Schedules: " + fitnessDb.schedules.countDocuments());
print("Bookings: " + fitnessDb.bookings.countDocuments());
