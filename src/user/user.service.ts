import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateUserDto } from './dto/create-user.dto';
import { Status } from 'src/ability/ability.factory';
import db1 from '../db/db1.json';
import db2 from '../db/db2.json';
import { CustomerDetails, CustomerLocation } from './entities/customer.entity';

let users = new Map();
let emitted = []; //find out if theres a way to not have to use an array

@Injectable()
export class UserService {
  constructor(private eventEmitter: EventEmitter2) { }

  findOne(id: number) {
    let location: CustomerLocation
    let details: CustomerDetails

    if (db1.hasOwnProperty(id)) {
      let body = db1[id]
      details = new CustomerDetails(body.firstName, body.lastName, body.age)
      location = new CustomerLocation(body.city, body.state)

    }
    else if (db2.hasOwnProperty(id)) {
      let body = db2[id]
      details = new CustomerDetails(body.customer.firstName, body.customer.lastName, body.age)
      location = new CustomerLocation(body.location.city, body.location.state)
    }
    return {id: id, customer: details, location: location}
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {

    if (users.has(id)) {
      let existingUser = users.get(id)
      if (existingUser.status !== Status.Complete && updateUserDto.status === Status.Complete && !emitted.includes(id)) {
        this.eventEmitter.emit(
          'user.complete',
          new CreateUserDto(1, updateUserDto.status)
        );
        emitted.push(id)
      }
    }
    else {
      let user = new User();
      console.log("creating user", id)
      user.id = id;
      user.status = updateUserDto.status
      users.set(id, user)
    }

    return `This action updates a #${id} user`;
  }
  @OnEvent('user.complete')
  handleComplpeteEvent(payload: CreateUserDto) {
    console.log(`resource with id:${payload.id} was completed`)
  }
}
