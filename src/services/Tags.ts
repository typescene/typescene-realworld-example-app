import { ManagedList, ManagedRecord, ManagedService, service } from "typescene";
import { RemoteService } from "./Remote";

/** Tag record fields */
export interface Tag {
    tag: string;
}

/** Managed list of tags */
export type TagList = ManagedList<ManagedRecord & Tag>;

/** Service that handles tags only */
export class TagsService extends ManagedService {
    name = "App.Tags";

    @service("App.Remote")
    remote?: RemoteService;

    /** Returns a full list of 'popular' tags */
    async getTagsAsync(): Promise<TagList> {
        let result = await this.remote!.getAsync("tags");
        let tags: string[] = result.tags;
        return new ManagedList(...tags.map(tag => ManagedRecord.create({ tag })));
    }
}
