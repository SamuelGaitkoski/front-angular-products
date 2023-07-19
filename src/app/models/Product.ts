// criando um modelo para o nosso Product, que será o que nosso produto terá, receberá e mandará para o back.
export default interface Product {
    id: string;
    name: string;
    price: number;
    category: number;
}