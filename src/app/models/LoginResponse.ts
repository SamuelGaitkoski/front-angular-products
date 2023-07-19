import User from "./User";

// sem o export não temos como importar o LoginResponse nos arquivos que quisermos usar o modelo.
// nosso modelo LoginResponse vai receber um user e um token, ao fazer login.
export default interface LoginResponse {
    user: User;
    token: string;
}