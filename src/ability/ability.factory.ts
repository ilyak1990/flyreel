import { Injectable } from "@nestjs/common";
import { InferSubjects, PureAbility, AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { User } from "src/user/entities/user.entity";
import { UpdateUserDto } from "src/user/dto/update-user.dto";


//very simple only focusing on update as per requirements and for time constraint reason

export enum Action {
    Update = 'update'
}
export enum Status {
    InProgress = 'in-progress',
    Complete = 'complete'
}
export type Subjects = InferSubjects<typeof User> | 'all'
export type AppAbility = PureAbility<[Action, Subjects]>


@Injectable()
export class AbilityFactory {
    defineAbility(user: User, body: UpdateUserDto) {

        const { can, cannot, build } = new AbilityBuilder(PureAbility as AbilityClass<AppAbility>)

        can(Action.Update, 'all')
        if (this.canUpdateStatus(user.id, body.status)) {
            can(Action.Update, 'all') 
        }
        else {
            cannot(Action.Update, 'all')
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>
        })

    }
    canUpdateStatus(id: number, status: Status) {
        return (id == 1 && status === Status.InProgress) || (id == 2 && (status === Status.InProgress || status === Status.Complete))
        //would go into more detail with this if I had more time
    }



}
