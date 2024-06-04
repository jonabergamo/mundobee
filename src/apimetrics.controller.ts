import { Controller, Get, Res } from "@nestjs/common";
import { PrometheusController } from "@willsoto/nestjs-prometheus";

@Controller("apimetrics")
export class ApiMetricsController extends PrometheusController {
  @Get()
  async index(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}

