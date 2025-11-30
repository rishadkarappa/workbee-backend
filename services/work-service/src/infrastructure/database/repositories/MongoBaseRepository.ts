import { Model, HydratedDocument } from "mongoose";

export abstract class MongoBaseRepository<TDomain, TDocument> {
    protected readonly model: Model<TDocument>;

    constructor(model: Model<TDocument>) {
        this.model = model;
    }

    protected abstract map(doc: HydratedDocument<TDocument>): TDomain;

    async findById(id: string): Promise<TDomain | null> {
        const doc = await this.model.findById(id);
        return doc ? this.map(doc) : null;
    }

    async findAll(): Promise<TDomain[]> {
        const docs = await this.model.find();
        return docs.map((doc) => this.map(doc as HydratedDocument<TDocument>));
    }

    async create(data: Partial<TDocument>): Promise<TDomain> {
        const doc = await this.model.create(data);
        return this.map(doc as HydratedDocument<TDocument>);
    }

    async update(id: string, update: Partial<TDocument>): Promise<TDomain | null> {
        const doc = await this.model.findByIdAndUpdate(id, update, { new: true });
        return doc ? this.map(doc as HydratedDocument<TDocument>) : null;
    }

    async deleteById(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }
}
