import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { kakaoOAuthConfig } from 'src/common/config';
import CreateUserDTO from 'src/user/dto/create-user-request.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  async loginWithKakao(@Res() response: Response) {
    const { AUTHORIZATION_URI } = kakaoOAuthConfig;
    const CLIENT_ID = this.authService.CLIENT_ID;
    const CALLBACK_URI = this.authService.CALLBACK_URI;
    const redirectURI =
      AUTHORIZATION_URI +
      `?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URI}` +
      '&response_type=code';
    response.redirect(redirectURI);
  }

  @Get('callback')
  async kakaoAuthRedirect(
    @Req() request: Request,
    @Query('code') code: string,
    @Res() response: Response
  ) {
    if (!code) {
      throw new BadRequestException('code is required');
    }
    const accessToken = await this.authService.getAccessTokenFromKakao(code);
    const userInfo = await this.authService.getUserInfoFromKakao(accessToken);
    const validatedUser = await this.authService.getOrCreateUser(
      new CreateUserDTO(userInfo.id, userInfo.properties.nickname)
    );

    const jwtToken = this.authService.createAccessToken(validatedUser);
    response.cookie('accessToken', jwtToken);
    response.redirect(process.env.CLIENT_URL);
  }
}
