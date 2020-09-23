import { Collection, MongoClient } from "mongodb";

let subscriptions: Collection;

export default class subscriptionsDAO {
  static async injectDB(conn: MongoClient) {
    if (subscriptions) return;

    try {
      subscriptions = await conn
        .db(process.env.DATABASE_NAMESPACE)
        .collection("subscriptions");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in subscriptionsDAO: ${e}`
      );
    }
  }

  /**
   * Finds the market price stored in the 'marketPrice' collection
   */
  static async getSubscriptions(user: string) {
    let pipeline = [
      { $match: { user: user } },
      // { $match: { $text: { $search: user } } },
      // { $sort: { score: { $meta: "textScore" } } },
    ];

    try {
      return await subscriptions.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Unable to run aggregation, ${e}`);
      throw e;
    }
  }

  static async addSubscriptions(user: string, newSubs: [string]) {
    if (user == null) return;

    try {
      const _datum = [];
      for (const sub of newSubs) {
        let _data = {
          user: user,
          subscription: sub,
        };
        _datum.push(_data);
      }
      const result = await subscriptions.insertMany(_datum, { ordered: false });

      return result;
    } catch (e) {
      console.error(e);
    }
  }

  static async removeSubscriptions(user: string, subs: [string]) {
    if (user == null) return;

    const operations = [];
    for (const sub of subs) {
      operations.push({
        deleteOne: { filter: { user: user, subscription: sub } },
      });
    }
    const result = await subscriptions.bulkWrite(operations, {
      ordered: false,
    });

    return result;
  }
}
