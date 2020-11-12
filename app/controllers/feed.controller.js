const { logger } = require('../logger/winstonLogger');
const { Item } = require('../models/item.model');
const convertFiltersToMongoose = require('../utility/convertFiltersToMongoose');

exports.getItemsFeed = async (req, res) => {
  try {
    const items = await Item.find({});
    if (!items) {
      logger.warn('getItemsFeed item not found');
      return res.status(404).send();
    }
    res.status(200).send(items);
  } catch (e) {
    logger.error(`could not fetch feed: ${e}`);
    res.status(500).send();
  }
};

exports.getCategoryItemsFeed = async (req, res) => {
  if (!req || !req.params) {
    logger.warn('getCategoryItemsFeed bad request. missing data/params')
    res.status(400).send()
  }
  const category = req.params.category;
  const filters = {
    category: category,
    masterCategory: 'realestate',
  };
  try {
    const feed = await Item.find(filters).exec();
    if (!feed) {
      logger.warn('getCategoryItemsFeed item not found');
      return res.status(404).send();
    }
    res.status(200).send(feed);
  } catch (e) {
    logger.error(`could not fetch feed by category: ${e}`);
    res.status(500).send();
  }
};
exports.getUserItemsFeed = async (req, res) => {
  if (!req || !req.params) {
    logger.warn('bad getUserItemsFeed request. missing data/params')
    res.status(400).send()
  }
  const userId = req.params.userId;
  const filters = {
    owner: userId,
    masterCategory: 'realestate',
  };
  try {
    const feed = await Item.find(filters).exec();
    if (!feed) {
      logger.warn('getUserItemsFeed item not found');
      return res.status(404).send();
    }
    res.status(200).send(feed);
  } catch (e) {
    logger.error(`could not fetch feed by category: ${e}`);
    res.status(500).send();
  }
};
exports.getFilteredFeed = async (req, res) => {
  if (!req || !req.body) {
    logger.warn('bad getFilteredFeed request. missing body')
    res.status(400).send()
  }
  const filters = (convertFiltersToMongoose(req.body))
  try {
    const feed = await Item.find(filters).exec();
    if (!feed) {
      logger.warn('getFilteredFeed item not found');
      return res.status(404).send();
    }
    res.status(200).send(feed)
  } catch (e) {

  }
}