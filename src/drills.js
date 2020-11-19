require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

function searchTermQuery(searchTerm) {
    knexInstance
        .select('name')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(results => {
            console.log(results);
        });
}

function paginateTable(pageNumber) {
    const itemsPerPage = 6;
    const offset = itemsPerPage * (pageNumber - 1);
    knexInstance
        .from('shopping_list')
        .select('name', 'price', 'date_added', 'checked', 'category')
        .limit(itemsPerPage)
        .offset(offset)
        .then(results => {
            console.log(results);
        })
}

function itemsAddedAfterDate(daysAgo) {
    knexInstance
        .from('shopping_list')
        .select('*')
        .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
        .then(results => {
            console.log(results);
        });
}

function totalCostForCategories() {
    knexInstance
        .from('shopping_list')
        .select('category')
        .sum('price AS total_price')
        .groupBy('category')
        .then(results => {
            console.log(results);
        })
}

searchTermQuery('urger');
paginateTable(2);
itemsAddedAfterDate(5);
totalCostForCategories();