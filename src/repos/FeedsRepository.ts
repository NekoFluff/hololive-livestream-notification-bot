import { Collection } from '@asnou/mongodb-wrapper';

export class Feed {
  ["_id"]: any;
  ["firstName"]: string;
  ["lastName"]: string;
  ["topicURL"]: string;
  ["group"]: string;
  ["generation"]: number;
};

export default class FeedsRepository extends Collection<Feed> {
  constructor() {
    super("hololive-en", "feeds", Feed);
  }

  /**
   * @returns A record of auto trade detail id to the AutoTradeDetails object.
   */
  async getFeeds(): Promise<Record<any, Feed>> {
    const filter = {};
    return super.find(filter);
  }

  // /**
  //  * @returns A record of auto trade detail id to the AutoTradeDetails object. There should only be one key-value pair.
  //  */
  // async getAutoTradeDetailsById(id: AutoTradeDetailsId): Promise<Record<AutoTradeDetailsId, AutoTradeDetails>> {
  //   const filter = {
  //     _id: id
  //   };
  //   return super.find(filter);
  // }

  // /**
  //  * @param autoTradeDetails An array of AutoTradeDetails to add to the database.
  //  * @returns InsertWriteOp result.
  //  */
  // async addAutoTradeDetails(autoTradeDetails: AutoTradeDetails[]) {
  //   try {
  //     return super.insert(autoTradeDetails)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
