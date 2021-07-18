import SubscriptionsRepository from "./repos/SubscriptionsRepository";

const subscriptionsRepo = new SubscriptionsRepository();


async function test() {
  const authors = ['amelia', 'test'];
  const existingSubs = Object.values(await subscriptionsRepo.getSubscriptions("142090800279453696")).map((sub) => { return sub['subscription'] });
  console.log(existingSubs);
  const duplicates: string[] = [];
  const newAuthors = authors.filter(function (author) {
    if (existingSubs.includes(author)) {
      duplicates.push(author);
      return false; // Don't include
    }
    return true;
  });
  console.log(duplicates)
  console.log(newAuthors);
}

test();
