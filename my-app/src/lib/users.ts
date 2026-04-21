import { faker } from "@faker-js/faker";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    job: string;
    city: string;
    age: number;
}

function createUser(): User {
    return {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        job: faker.person.jobTitle(),
        city: faker.location.city(),
        age: faker.number.int({min: 20, max: 80})
    }
}

function createUsers(): User[] {
    return Array.from({ length: 50 }, createUser)
}

export const getUsers = () => {
    return createUsers();
}