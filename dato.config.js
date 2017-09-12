const path = require('path');

const dir = 'data/';

module.exports = (dato, root, i18n) => {
  root.createDataFile(path.join(dir, `home.json`), 'json', itemToJson(dato.home));
  dato.blogs.forEach(item => {
    root.createDataFile(path.join(dir, 'blog', `${item.slug}.json`), 'json', itemToJson(item));
  });
};

function itemsToJson(items) {
  return items.map(itemToJson);
}

function itemToJson(item) {
  const itemJson = item.toMap()
  const meta = itemJson.seoMetaTags
    .filter(tag => tag.tagName === 'meta')
    .map(tag => tag.attributes)
    .reduce((all, tag) => Object.assign(all, { [tag.name || tag.property]: tag.content }), {})

  itemJson.seo = Object.assign({
    'article:modified_time': meta['article:modified_time'],
    'article:publisher': meta['article:publisher'],
    'twitter:site': meta['twitter:site'],
  }, itemJson.seo || {})

  return removeSeoMetaTags(itemJson)
}

function removeSeoMetaTags(item) {
  item.seoMetaTags = []
  if (item.content) {
    item.content.forEach(item => item.seoMetaTags = [])
  }
  return item
}
