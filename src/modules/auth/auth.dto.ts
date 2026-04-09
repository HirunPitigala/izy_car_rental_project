export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterCustomerDto {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterManagerDto {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterEmployeeDto {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
