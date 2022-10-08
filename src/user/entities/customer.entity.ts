export class CustomerDetails {
    firstName: string;
    lastName?: string
    age?: string;
    constructor(firstName: string, lastName: string, age: string) {
        this.firstName = firstName
        this.lastName = lastName
        this.age = age
    }
}
export class CustomerLocation {
    city: string;
    state: string
    constructor(city: string, state: string) {
        this.city = city
        this.state = state
    }
}