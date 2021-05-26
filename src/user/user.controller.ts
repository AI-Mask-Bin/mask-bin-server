import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserGuard } from 'src/common/guards/user.guard';
import AccumulateMaskDTO from './dto/accumulate-request.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/accumulate')
  @UseGuards(new UserGuard())
  async accumulateMaskPoint(
    @Req() request: Request,
    @Body() body: AccumulateMaskDTO
  ) {
    const { id } = request.user;
    const { collectedMaskCount } = body;
    await this.userService.accumulateMaskPoint(id, collectedMaskCount);
    return { result: 'success' };
  }

  @Patch('/use-coupon')
  @UseGuards(new UserGuard())
  async useMaskCoupon(@Req() request: Request) {
    const { id } = request.user;
    await this.userService.useMaskCoupon(id);
    return { result: 'success' };
  }
}
