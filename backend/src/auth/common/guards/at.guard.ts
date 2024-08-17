import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AtGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [context.getHandler(), context.getClass()]);
    const request = context.switchToHttp().getRequest();
    const path = request.path;

    if (path.startsWith("/prometrics")) {
      return true;
    }

    if (isPublic) return true;

    return super.canActivate(context);
  }
}

