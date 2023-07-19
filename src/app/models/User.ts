export default interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    // não vamos criar password aqui, pois não vamos devolver a senha nas requisições na nossa api.
}