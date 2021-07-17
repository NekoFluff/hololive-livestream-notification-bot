import { Collection } from "@asnou/mongodb-wrapper";

export type SubscriptionName = string;

export class Subscription {
  ["_id"]: any;
  ["user"]: string;
  ["subscription"]: string;
};

export default class SubscriptionsRepository extends Collection<Subscription> {
  constructor() {
    super("hololive-en", "subscriptions", Subscription);
  }

  /**
   * @returns A record of portfolio name (id) to Subscription object.
   */
  async getAllSubscriptions(): Promise<Record<SubscriptionName, Subscription>> {
    const filter = {};
    return super.find(filter);
  }

  async getSubscriptions(user: string) {
    let pipeline = [
      { $match: { user: user } },
      // { $match: { $text: { $search: user } } },
      // { $sort: { score: { $meta: "textScore" } } },
    ];

    try {
      return await super.aggregate(pipeline);
    } catch (e) {
      console.error(`Unable to run aggregation: ${e}`);
      throw e;
    }
  }

  async getSubscriptionsForAuthors(authors: string[]) {
    let pipeline = [
      {
        $match: {
          subscription: {
            $in: authors,
          },
        },
      },
      {
        $group: {
          _id: "$user",
          count: {
            $sum: 1,
          },
        },
      },
    ];

    try {
      return await super.aggregate(pipeline);
    } catch (e) {
      console.error(`Unable to run aggregation: ${e}`);
      throw e;
    }
  }

  async addSubscriptions(user: string, newSubs: string[]) {
    if (user == null) return null;

    try {
      const _datum = [];
      for (const sub of newSubs) {
        let _data = {
          user: user,
          subscription: sub,
        };
        _datum.push(_data);
      }
      const result = await (await this.getCollection()).insertMany(_datum, { ordered: false });

      return result;
    } catch (e) {
      console.error(e);
    }
  }

  async removeSubscriptions(user: string, subs: string[]) {
    if (user == null) return;

    const operations = [];
    for (const sub of subs) {
      operations.push({
        deleteOne: { filter: { user: user, subscription: sub } },
      });
    }

    const result = await (await this.getCollection()).bulkWrite(operations, {
      ordered: false,
    });

    return result;
  }
}
