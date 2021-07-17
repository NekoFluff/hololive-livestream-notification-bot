import { Collection } from "@asnou/mongodb-wrapper";

export class Livestream {
  ["_id"]: any;
  ['author']: string;
  ["url"]: string;
  ["date"]: Date;
};


export default class LivestreamsRepository extends Collection<Livestream> {
  constructor() {
    super("hololive-en", "scheduledLivestreams", Livestream);
  }

  /**
   * @returns A record of livestream name (id) to Livestream object.
   */
  async getLivestreams(): Promise<Record<string, Livestream>> {
    const filter = {};
    return super.find(filter);
  }

  /**
   * @param livestreams An array of Livestreams to add to the database.
   * @returns InsertWriteOp result.
   */
  async addLivestreams(livestreams: Livestream[]) {
    try {
      return super.update(livestreams, { upsert: true })
    } catch (error) {
      console.log(error);
    }
  }
}
