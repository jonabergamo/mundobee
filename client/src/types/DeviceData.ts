export type Data = {
  temperature: number;
  humidity: number;
  outsideTemp: number;
  outsideHumidity: number;
  inCount: number;
  outCount: number;
  updatedAt?: string; // Atualizado para uma string para facilitar o processamento
};