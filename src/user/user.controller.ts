import { Controller, Get, Body, Patch, Param, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbilityFactory, Action } from 'src/ability/ability.factory';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly abilityFactory: AbilityFactory) { }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = { id: id }; //this would be pulled from auth in req.user
    const ability = this.abilityFactory.defineAbility(user, updateUserDto)

    const isAllowed = ability.can(Action.Update, User, updateUserDto.status)
    if (!isAllowed) {
      throw new ForbiddenException('cannot update')
    }
    return this.userService.update(id, updateUserDto);
  }
}
