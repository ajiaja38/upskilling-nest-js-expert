import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginDto from './dto/login.dto';
import { ILoginResponse } from './dto/login.response.dto';
import { RefreshTokenDto } from './dto/refreshtoken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginHandler(@Body() loginDto: LoginDto): Promise<ILoginResponse> {
    return this.authService.login(loginDto);
  }

  @Put('refreshtoken')
  refreshTokenHandler(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
