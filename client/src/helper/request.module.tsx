import axios, { AxiosError } from "axios";
import { error } from "console";
export class ApiRequest {
  private Api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  });
  async ApiRequest(endpoint: string, payload: Object) {
    // { email: 'jonathanbergamo16@gmail.com', password: 'senha' }
    console.log(payload);

    try {
      const response = await this.Api.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = { statusCode: response.status, ...response.data };
      console.log(data);
      return data;
    } catch (error: any) {
      console.log(error.request);
      return error.response;
    }
  }
}
