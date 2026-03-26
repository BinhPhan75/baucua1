
export interface Symbol {
  id: number;
  name: string;
  value: number;
  image: string;
  color: string;
}

export const SYMBOLS: Symbol[] = [
  { id: 1, name: "Nai", value: 1, image: "https://raw.githubusercontent.com/BinhPhan75/baucua/main/nai.png", color: "bg-orange-100" },
  { id: 2, name: "Bầu", value: 2, image: "https://raw.githubusercontent.com/BinhPhan75/baucua/main/bau.png", color: "bg-green-100" },
  { id: 3, name: "Gà", value: 3, image: "https://raw.githubusercontent.com/BinhPhan75/baucua/main/ga.png", color: "bg-yellow-100" },
  { id: 4, name: "Cá", value: 4, image: "https://raw.githubusercontent.com/BinhPhan75/baucua/main/ca.png", color: "bg-blue-100" },
  { id: 5, name: "Cua", value: 5, image: "https://raw.githubusercontent.com/BinhPhan75/baucua/main/cua.png", color: "bg-red-100" },
  { id: 6, name: "Tôm", value: 6, image: "https://raw.githubusercontent.com/BinhPhan75/baucua/main/tom.png", color: "bg-pink-100" },
];
