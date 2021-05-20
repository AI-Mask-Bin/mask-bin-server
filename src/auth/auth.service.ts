import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as qs from 'querystring';
import { JwtConfig, kakaoOAuthConfig } from 'src/common/config';
import { UserEntity } from 'src/entity/user.entity';
import CreateUserDTO from 'src/user/dto/create-user-request.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  public CLIENT_ID: string;
  public CALLBACK_URI: string;
  public CLIENT_SECRET: string;
  constructor(private readonly userService: UserService) {
    this.CLIENT_ID = process.env.KAKAO_CLIENT_ID;
    this.CALLBACK_URI = process.env.KAKAO_CALLBACK_URI;
    this.CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
  }

  async getAccessTokenFromKakao(code: string) {
    const { TOKEN_URI: accessTokenURI } = kakaoOAuthConfig;

    const header = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        charset: 'utf-8',
      },
    };

    const queryParams = {
      grant_type: 'authorization_code',
      client_id: this.CLIENT_ID,
      redirect_uri: this.CALLBACK_URI,
      client_secret: this.CLIENT_SECRET,
      code,
    };
    const query = qs.stringify(queryParams);

    try {
      const { data: response } = await axios.post(
        accessTokenURI,
        query,
        header
      );

      return response.access_token;
    } catch (e) {
      throw new BadRequestException('fail to get AccessToken');
    }
  }

  async getUserInfoFromKakao(accessToken: string) {
    const { USER_INFO_URI } = kakaoOAuthConfig;
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        charset: 'utf-8',
      },
    };

    const { data: userInfo } = await axios.get(USER_INFO_URI, header);

    return userInfo;
  }

  async getOrCreateUser(userInfo: CreateUserDTO) {
    const user = await this.userService.findUserById(userInfo.id);

    if (!user) {
      const newUser = await this.userService.createUser(userInfo);
      return newUser;
    }

    return user;
  }

  createAccessToken(userModel: UserEntity) {
    const accessToken = jwt.sign(
      { data: userModel, timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: JwtConfig.tokenExpiresIn }
    );
    return accessToken;
  }
}
