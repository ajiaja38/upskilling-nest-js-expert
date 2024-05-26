import { Injectable } from '@nestjs/common';
import { TokenManagerService } from './token-manager/token-manager.service';
import { UserService } from '../user/user.service';
import LoginDto from './dto/login.dto';
import { ILoginResponse } from './dto/login.response.dto';
import { IJwtPayload } from 'src/utils/interface/jwtPayload.interface';
import { RefreshTokenDto } from './dto/refreshtoken.dto';

@Injectable()
export class AuthService {
  constructor(
    private tokenManagerService: TokenManagerService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const iJwtPayload: IJwtPayload =
      await this.userService.validateCredentials(loginDto);

    return {
      accessToken:
        await this.tokenManagerService.generateAccessToken(iJwtPayload),
      refreshToken:
        await this.tokenManagerService.generateRefreshToken(iJwtPayload),
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return {
      accessToken: await this.tokenManagerService.verifyRefreshToken(
        refreshTokenDto.refreshToken,
      ),
    };
  }
}
