import { Resolver, FieldResolver, ID, Ctx, Root, Query } from 'type-graphql'
import { ControlMap } from './types/controlMap'


@Resolver(of => ControlMap)
export class ControlMapResolver {
    @Query(returns => ControlMap)
    async ControlMap(@Ctx() ctx: any) {
        let frames = await ctx.db.ControlFrame.find()
        const id = frames.map((frame: any) => { return { id: frame.id, _id: frame._id } })
        return { frames: id }
    }

}
