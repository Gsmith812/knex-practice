const { expect } = require('chai');
const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const ArticlesService = require('../src/articles-service');

describe(`Shopping List Service object`, () => {
    let db;
    let testList = [
        { 
            id: 1, 
            name: 'Fish tricks', 
            price: '13.10', 
            category: 'Main', 
            checked: false, 
            date_added: new Date() 
        },
        { 
            id: 2, 
            name: 'Not Dogs', 
            price: '4.99', 
            category: 'Snack', 
            checked: true, 
            date_added: new Date() 
        },
        { 
            id: 3, 
            name: 'Bluffalo Wings', 
            price: '5.50', 
            category: 'Snack', 
            checked: false, 
            date_added: new Date() 
        },
    ];
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    });

    before(() => db('shopping_list').truncate());

    afterEach(() => db('shopping_list').truncate());

    after(() => db.destroy());

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testList);
        });

        it(`getAllListItems() resolves the entire list of items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllListItems(db)
                    .then(list => {
                        expect(list).to.eql(testList);
                    });
        });

        it(`getById() resolves the item matching the 'id' parameter from 'shopping_list' table`, () => {
            const itemId = 3;
            const expectedItem = testList[itemId - 1];
            return ShoppingListService.getById(db, itemId)
                .then(list => {
                    expect(list).to.eql(expectedItem);
                });
        });

        it(`updateListItem() updates the specified list item from 'shopping_list' table`, () => {
            const itemId = 2;
            const newItemData = {
                name: 'New Name',
                price: '10.00'
            };
            return ShoppingListService.updateListItem(db, itemId, newItemData)
                .then(() => ShoppingListService.getById(db, itemId))
                .then(item => {
                    expect(item).to.eql({id: itemId, ...newItemData, category: item.category, checked: item.checked, date_added: item.date_added });
                });
        });

        it(`deleteListItem() deletes a specified list item from 'shopping_list' table`, () => {
            const itemId = 3;
            return ShoppingListService.deleteListItem(db, itemId)
                .then(() => ShoppingListService.getAllListItems(db))
                .then(allItems => {
                    const expected = testList.filter(li => li.id !== itemId);
                    expect(expected).to.eql(allItems);
                });
        });
    });

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllListItems() resolves to an empty array`, () => {
            return ShoppingListService.getAllListItems(db)
                .then(allItems => {
                    expect(allItems).to.eql([]);
                });
        });
        it(`insertNewListItem() creates a new item with 'id' into 'shopping_list' table`, () => {
            const newListItem = {
                id: 1,
                name: 'New Item',
                price: '10.00',
                category: 'Main',
                checked: true,
                date_added: new Date(),
            };
            return ShoppingListService.insertNewListItem(db, newListItem)
                .then(item => {
                    expect(newListItem).to.eql(item);
                });
        });
    })
});