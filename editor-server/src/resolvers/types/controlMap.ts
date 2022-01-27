import { Field, ObjectType, Resolver, FieldResolver, Ctx, Float, Query, Root } from "type-graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";
import db from "../../models"
import { ControlFrame } from "./controlFrame";

interface LooseObject {
    [key: string]: any
}

@ObjectType()
export class ControlMap {
    @Field(type => ControlMapScalar)
    frames: ObjectId[]
}

export const ControlMapScalar = new GraphQLScalarType({
    name: "ControlMapQueryObjectId",
    description: "Mongo object id scalar type",
    async serialize(value: any): Promise<any> {
        // check the type of received value
        const result: LooseObject = {}
        const dancers = await db.Dancer.find()
        await Promise.all(
            value.map(async(id: string)=> {
                const {fade, start, editing} = await db.ControlFrame.findById(id)
                const status: LooseObject = {}
                await Promise.all(
                    dancers.map(async(dancer: any)=> {
                        const {name, parts} = await db.Dancer.findById(dancer.id)
                        status[name] = parts
                    })
                )
                result[id] = {fade, start, editing, status}
            })
        )
        return result; // value sent to the client
    },
    parseValue(value: unknown): any {
        // check the type of received value

        return value; // value from the client input variables
    },
    parseLiteral(ast: any): any {
        // check the type of received value

        return ast.value; // value from the client query
    },
})




