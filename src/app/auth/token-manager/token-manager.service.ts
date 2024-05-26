import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstant } from 'src/utils/constant/jwt.constant';
import { IJwtPayload } from 'src/utils/interface/jwtPayload.interface';

@Injectable()
export class TokenManagerService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(iJwtPayload: IJwtPayload): Promise<string> {
    return await this.jwtService.signAsync({ ...iJwtPayload });
  }

  async generateRefreshToken(iJwtPayload: IJwtPayload): Promise<string> {
    return await this.jwtService.signAsync(
      { ...iJwtPayload },
      { secret: jwtConstant.refreshTokenSecret, expiresIn: '7d' },
    );
  }

  async verifyRefreshToken(refreshToken: string): Promise<string> {
    const { id, email, roles } = await this.jwtService.verify(refreshToken, {
      secret: jwtConstant.refreshTokenSecret,
    });

    return await this.generateAccessToken({
      id,
      email,
      roles,
    });
  }
}
