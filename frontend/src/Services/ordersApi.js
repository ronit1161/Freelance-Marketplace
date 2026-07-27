/**
 * Mock JSON Data based on the Orders Database Schema:
 * 
 * Fields:
 * - id: BIGINT UNSIGNED (PK AUTO_INCREMENT)
 * - client_id: BIGINT UNSIGNED (FK -> users.id)
 * - freelancer_id: BIGINT UNSIGNED (FK -> users.id)
 * - gig_id: BIGINT UNSIGNED (FK -> gigs.id)
 * - package_id: BIGINT UNSIGNED | NULL (FK -> gig_packages.id)
 * - price_snapshot: INT UNSIGNED (Immutable price at order time in cents or base currency units)
 * - requirements: TEXT (Client instructions)
 * - status: ENUM ('PENDING', 'COMPLETED', 'CANCELLED')
 * - created_at: TIMESTAMP
 * - completed_at: TIMESTAMP | NULL
 * - cancelled_at: TIMESTAMP | NULL
 */

export const MOCK_ORDERS = [
    {
        id: 1001,
        client_id: 42,
        freelancer_id: 108,
        gig_id: 205,
        package_id: 12,
        price_snapshot: 25000,
        requirements: "Need a modern full-stack web dashboard built with React and Tailwind CSS. Please follow the provided Figma designs.",
        status: "PENDING",
        created_at: "2026-07-24T10:30:00Z",
        completed_at: null,
        cancelled_at: null
    },
    {
        id: 1002,
        client_id: 42,
        freelancer_id: 115,
        gig_id: 310,
        package_id: 15,
        price_snapshot: 15000,
        requirements: "Create a minimalist logo and brand guidelines identity vector package for a tech startup.",
        status: "COMPLETED",
        created_at: "2026-07-20T14:15:00Z",
        completed_at: "2026-07-23T18:45:00Z",
        cancelled_at: null
    },
    {
        id: 1003,
        client_id: 55,
        freelancer_id: 108,
        gig_id: 205,
        package_id: 11,
        price_snapshot: 8000,
        requirements: "API bug fixing and performance optimization for Node.js backend endpoints.",
        status: "CANCELLED",
        created_at: "2026-07-21T09:00:00Z",
        completed_at: null,
        cancelled_at: "2026-07-21T11:20:00Z"
    },
    {
        "id": 1004,
        "client_id": 12,
        "freelancer_id": 204,
        "gig_id": 112,
        "package_id": 3,
        "price_snapshot": 15000,
        "requirements": "Redesign e-commerce homepage and mobile checkout flow in Figma.",
        "status": "COMPLETED",
        "created_at": "2026-07-22T10:15:00Z",
        "completed_at": "2026-07-25T16:45:00Z",
        "cancelled_at": null
    },
    {
        "id": 1005,
        "client_id": 89,
        "freelancer_id": 108,
        "gig_id": 301,
        "package_id": 8,
        "price_snapshot": 4500,
        "requirements": "Write 3 SEO-optimized blog posts about renewable energy solutions.",
        "status": "IN_PROGRESS",
        "created_at": "2026-07-23T14:30:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1006,
        "client_id": 55,
        "freelancer_id": 312,
        "gig_id": 405,
        "package_id": 15,
        "price_snapshot": 22000,
        "requirements": "Develop a React Native cross-platform authentication module with Firebase integration.",
        "status": "PENDING",
        "created_at": "2026-07-24T08:00:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1007,
        "client_id": 34,
        "freelancer_id": 150,
        "gig_id": 205,
        "package_id": 12,
        "price_snapshot": 12000,
        "requirements": "Refactor Express.js routes and add Swagger UI documentation.",
        "status": "COMPLETED",
        "created_at": "2026-07-24T11:45:00Z",
        "completed_at": "2026-07-26T18:10:00Z",
        "cancelled_at": null
    },
    {
        "id": 1008,
        "client_id": 101,
        "freelancer_id": 78,
        "gig_id": 509,
        "package_id": 2,
        "price_snapshot": 3500,
        "requirements": "Create a vector logo pack with brand color guidelines and typography.",
        "status": "CANCELLED",
        "created_at": "2026-07-25T09:10:00Z",
        "completed_at": null,
        "cancelled_at": "2026-07-25T10:05:00Z"
    },
    {
        "id": 1009,
        "client_id": 67,
        "freelancer_id": 220,
        "gig_id": 612,
        "package_id": 19,
        "price_snapshot": 35000,
        "requirements": "Setup AWS ECS cluster with CI/CD pipeline via GitHub Actions.",
        "status": "IN_PROGRESS",
        "created_at": "2026-07-25T13:20:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1010,
        "client_id": 42,
        "freelancer_id": 108,
        "gig_id": 104,
        "package_id": 5,
        "price_snapshot": 6000,
        "requirements": "Translate technical user documentation from English to Spanish.",
        "status": "COMPLETED",
        "created_at": "2026-07-25T15:00:00Z",
        "completed_at": "2026-07-26T12:00:00Z",
        "cancelled_at": null
    },
    {
        "id": 1011,
        "client_id": 89,
        "freelancer_id": 401,
        "gig_id": 718,
        "package_id": 22,
        "price_snapshot": 18500,
        "requirements": "Auditing PostgreSQL queries and setting up index strategies for high traffic.",
        "status": "PENDING",
        "created_at": "2026-07-26T07:30:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1012,
        "client_id": 19,
        "freelancer_id": 115,
        "gig_id": 802,
        "package_id": 7,
        "price_snapshot": 9500,
        "requirements": "Produce a 30-second animated promo video for a SaaS product launch.",
        "status": "CANCELLED",
        "created_at": "2026-07-26T10:00:00Z",
        "completed_at": null,
        "cancelled_at": "2026-07-26T14:15:00Z"
    },
    {
        "id": 1013,
        "client_id": 105,
        "freelancer_id": 289,
        "gig_id": 910,
        "package_id": 14,
        "price_snapshot": 28000,
        "requirements": "Build a custom Shopify theme section using Liquid, Tailwind CSS, and Alpine.js.",
        "status": "IN_PROGRESS",
        "created_at": "2026-07-26T16:00:00Z",
        "completed_at": null,
        "cancelled_at": null
    }, {
        "id": 1004,
        "client_id": 12,
        "freelancer_id": 204,
        "gig_id": 112,
        "package_id": 3,
        "price_snapshot": 15000,
        "requirements": "Redesign e-commerce homepage and mobile checkout flow in Figma.",
        "status": "COMPLETED",
        "created_at": "2026-07-22T10:15:00Z",
        "completed_at": "2026-07-25T16:45:00Z",
        "cancelled_at": null
    },
    {
        "id": 1005,
        "client_id": 89,
        "freelancer_id": 108,
        "gig_id": 301,
        "package_id": 8,
        "price_snapshot": 4500,
        "requirements": "Write 3 SEO-optimized blog posts about renewable energy solutions.",
        "status": "IN_PROGRESS",
        "created_at": "2026-07-23T14:30:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1006,
        "client_id": 55,
        "freelancer_id": 312,
        "gig_id": 405,
        "package_id": 15,
        "price_snapshot": 22000,
        "requirements": "Develop a React Native cross-platform authentication module with Firebase integration.",
        "status": "PENDING",
        "created_at": "2026-07-24T08:00:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1007,
        "client_id": 34,
        "freelancer_id": 150,
        "gig_id": 205,
        "package_id": 12,
        "price_snapshot": 12000,
        "requirements": "Refactor Express.js routes and add Swagger UI documentation.",
        "status": "COMPLETED",
        "created_at": "2026-07-24T11:45:00Z",
        "completed_at": "2026-07-26T18:10:00Z",
        "cancelled_at": null
    },
    {
        "id": 1008,
        "client_id": 101,
        "freelancer_id": 78,
        "gig_id": 509,
        "package_id": 2,
        "price_snapshot": 3500,
        "requirements": "Create a vector logo pack with brand color guidelines and typography.",
        "status": "CANCELLED",
        "created_at": "2026-07-25T09:10:00Z",
        "completed_at": null,
        "cancelled_at": "2026-07-25T10:05:00Z"
    },
    {
        "id": 1009,
        "client_id": 67,
        "freelancer_id": 220,
        "gig_id": 612,
        "package_id": 19,
        "price_snapshot": 35000,
        "requirements": "Setup AWS ECS cluster with CI/CD pipeline via GitHub Actions.",
        "status": "IN_PROGRESS",
        "created_at": "2026-07-25T13:20:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1010,
        "client_id": 42,
        "freelancer_id": 108,
        "gig_id": 104,
        "package_id": 5,
        "price_snapshot": 6000,
        "requirements": "Translate technical user documentation from English to Spanish.",
        "status": "COMPLETED",
        "created_at": "2026-07-25T15:00:00Z",
        "completed_at": "2026-07-26T12:00:00Z",
        "cancelled_at": null
    },
    {
        "id": 1011,
        "client_id": 89,
        "freelancer_id": 401,
        "gig_id": 718,
        "package_id": 22,
        "price_snapshot": 18500,
        "requirements": "Auditing PostgreSQL queries and setting up index strategies for high traffic.",
        "status": "PENDING",
        "created_at": "2026-07-26T07:30:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1012,
        "client_id": 19,
        "freelancer_id": 115,
        "gig_id": 802,
        "package_id": 7,
        "price_snapshot": 9500,
        "requirements": "Produce a 30-second animated promo video for a SaaS product launch.",
        "status": "CANCELLED",
        "created_at": "2026-07-26T10:00:00Z",
        "completed_at": null,
        "cancelled_at": "2026-07-26T14:15:00Z"
    },
    {
        "id": 1013,
        "client_id": 105,
        "freelancer_id": 289,
        "gig_id": 910,
        "package_id": 14,
        "price_snapshot": 28000,
        "requirements": "Build a custom Shopify theme section using Liquid, Tailwind CSS, and Alpine.js.",
        "status": "IN_PROGRESS",
        "created_at": "2026-07-26T16:00:00Z",
        "completed_at": null,
        "cancelled_at": null
    }, {
        "id": 1004,
        "client_id": 12,
        "freelancer_id": 204,
        "gig_id": 112,
        "package_id": 3,
        "price_snapshot": 15000,
        "requirements": "Redesign e-commerce homepage and mobile checkout flow in Figma.",
        "status": "COMPLETED",
        "created_at": "2026-07-22T10:15:00Z",
        "completed_at": "2026-07-25T16:45:00Z",
        "cancelled_at": null
    },
    {
        "id": 1005,
        "client_id": 89,
        "freelancer_id": 108,
        "gig_id": 301,
        "package_id": 8,
        "price_snapshot": 4500,
        "requirements": "Write 3 SEO-optimized blog posts about renewable energy solutions.",
        "status": "IN_PROGRESS",
        "created_at": "2026-07-23T14:30:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1006,
        "client_id": 55,
        "freelancer_id": 312,
        "gig_id": 405,
        "package_id": 15,
        "price_snapshot": 22000,
        "requirements": "Develop a React Native cross-platform authentication module with Firebase integration.",
        "status": "PENDING",
        "created_at": "2026-07-24T08:00:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1007,
        "client_id": 34,
        "freelancer_id": 150,
        "gig_id": 205,
        "package_id": 12,
        "price_snapshot": 12000,
        "requirements": "Refactor Express.js routes and add Swagger UI documentation.",
        "status": "COMPLETED",
        "created_at": "2026-07-24T11:45:00Z",
        "completed_at": "2026-07-26T18:10:00Z",
        "cancelled_at": null
    },
    {
        "id": 1008,
        "client_id": 101,
        "freelancer_id": 78,
        "gig_id": 509,
        "package_id": 2,
        "price_snapshot": 3500,
        "requirements": "Create a vector logo pack with brand color guidelines and typography.",
        "status": "CANCELLED",
        "created_at": "2026-07-25T09:10:00Z",
        "completed_at": null,
        "cancelled_at": "2026-07-25T10:05:00Z"
    },
    {
        "id": 1009,
        "client_id": 67,
        "freelancer_id": 220,
        "gig_id": 612,
        "package_id": 19,
        "price_snapshot": 35000,
        "requirements": "Setup AWS ECS cluster with CI/CD pipeline via GitHub Actions.",
        "status": "IN_PROGRESS",
        "created_at": "2026-07-25T13:20:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1010,
        "client_id": 42,
        "freelancer_id": 108,
        "gig_id": 104,
        "package_id": 5,
        "price_snapshot": 6000,
        "requirements": "Translate technical user documentation from English to Spanish.",
        "status": "COMPLETED",
        "created_at": "2026-07-25T15:00:00Z",
        "completed_at": "2026-07-26T12:00:00Z",
        "cancelled_at": null
    },
    {
        "id": 1011,
        "client_id": 89,
        "freelancer_id": 401,
        "gig_id": 718,
        "package_id": 22,
        "price_snapshot": 18500,
        "requirements": "Auditing PostgreSQL queries and setting up index strategies for high traffic.",
        "status": "PENDING",
        "created_at": "2026-07-26T07:30:00Z",
        "completed_at": null,
        "cancelled_at": null
    },
    {
        "id": 1012,
        "client_id": 19,
        "freelancer_id": 115,
        "gig_id": 802,
        "package_id": 7,
        "price_snapshot": 9500,
        "requirements": "Produce a 30-second animated promo video for a SaaS product launch.",
        "status": "CANCELLED",
        "created_at": "2026-07-26T10:00:00Z",
        "completed_at": null,
        "cancelled_at": "2026-07-26T14:15:00Z"
    },
    {
        "id": 1013,
        "client_id": 105,
        "freelancer_id": 289,
        "gig_id": 910,
        "package_id": 14,
        "price_snapshot": 28000,
        "requirements": "Build a custom Shopify theme section using Liquid, Tailwind CSS, and Alpine.js.",
        "status": "IN_PROGRESS",
        "created_at": "2026-07-26T16:00:00Z",
        "completed_at": null,
        "cancelled_at": null
    }
];

let mockOrdersList = [...MOCK_ORDERS];

export async function createOrder(payload) {
    const newOrder = {
        id: Date.now(),
        client_id: payload.client_id || 1,
        freelancer_id: payload.freelancer_id || 1,
        gig_id: payload.gig_id || 1,
        package_id: payload.package_id || null,
        price_snapshot: payload.price_snapshot || 0,
        requirements: payload.requirements || "",
        status: "PENDING",
        created_at: new Date().toISOString(),
        completed_at: null,
        cancelled_at: null
    };
    mockOrdersList.unshift(newOrder);
    console.log(mockOrdersList);
}

export function getOrder({ userId, limit, page, signal }) {
    console.log(limit, page);
    const orders1 = mockOrdersList.slice((page - 1) * limit, page * limit);
    return { orders: orders1, totalPages: mockOrdersList.length / 10 };
}
