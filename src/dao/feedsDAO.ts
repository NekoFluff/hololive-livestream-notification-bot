import { Collection, MongoClient } from "mongodb";

let feeds: Collection;

export default class feedsDAO {
  static async injectDB(conn: MongoClient) {
    if (feeds) return;

    try {
      feeds = await conn.db(process.env.DATABASE_NAMESPACE).collection("feeds");
    } catch (e) {
      console.error(`Unable to establish collection handles in feedsDAO: ${e}`);
    }
  }

  static async getFeeds() {
    try {
      return await feeds.find().toArray();
    } catch (e) {
      console.error(`Unable to run aggregation: ${e}`);
      throw e;
    }
  }
}
