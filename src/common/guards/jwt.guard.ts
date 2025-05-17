import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly secret: string;

  public constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.secret = this.configService.getOrThrow('APP_JWT_SECRET');
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const [_, token] = request.headers?.authorization?.split(' ') ?? [];

    if (!token) throw new UnauthorizedException();

    try {
      await this.jwtService.verifyAsync(token, { secret: this.secret });

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token', {
        cause: error,
      });
    }
  }
}
