import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstant } from 'src/utils/constant/jwt.constant';
import { IJwtPayload } from 'src/utils/interface/jwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.accessTokenSecret,
    });
  }

  async validate(iJwtPayload: IJwtPayload): Promise<IJwtPayload> {
    if (!iJwtPayload) throw new UnauthorizedException('Invalid Token');

    return iJwtPayload;
  }
}
