/**
 * @title User Data Processing with Deno Collections
 * @difficulty advanced
 * @tags collections, data-processing, deno
 * @group Data Processing
 * @run --allow-read data-processing.ts
 *
 * Demonstrates using Deno's @std/collections library for processing user data.
 * This example uses pick, omit, and partition to manipulate data structures.
 */

import { omit, partition, pick } from "jsr:@std/collections";

// Define the User type with fields for id, name, role, age, and country
type User = {
  id: number;
  name: string;
  role: string;
  age: number;
  country: string;
};

// Sample array of user data for demonstration purposes
const users: User[] = [
  { id: 1, name: "Alice", role: "admin", age: 30, country: "USA" },
  { id: 2, name: "Bob", role: "user", age: 25, country: "Canada" },
  { id: 3, name: "Charlie", role: "user", age: 28, country: "USA" },
  { id: 4, name: "Dave", role: "admin", age: 35, country: "Canada" },
  { id: 5, name: "Eve", role: "user", age: 22, country: "UK" },
];

// 1. Pick specific fields from each user for selective data extraction
// Using pick to include only id, name, and country for each user in the new array
const pickedUsers = users.map((user) => pick(user, ["id", "name", "country"]));
console.log("Picked user data:", pickedUsers);

// 2. Omit specific fields from each user to remove sensitive data
// Using omit to exclude the "id" field from each user object in the new array
const omitUsers = users.map((user) => omit(user, ["id"]));
console.log("Omitted user data:", omitUsers);

// 3. Partition users based on role to categorize them into admins and regular users
// Using partition to split users array into two groups: admins and regular users
const [admins, regularUsers] = partition(
  users,
  (user) => user.role === "admin", // Condition to check if user role is admin
);
console.log("Admins:", admins);
console.log("Regular Users:", regularUsers);
