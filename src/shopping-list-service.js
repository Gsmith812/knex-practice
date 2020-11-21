const ShoppingListService = {
    getAllListItems(knex) {
        return knex.select('*').from('shopping_list');
    },
    insertNewListItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => rows[0]);
    },
    getById(knex, id) {
        return knex
            .from('shopping_list')
            .select('*')
            .where({ id })
            .first();
    },
    updateListItem(knex, id, updatedItemFields) {
        return knex
            .from('shopping_list')
            .where({ id })
            .update(updatedItemFields)
    },
    deleteListItem(knex, id) {
        return knex
            .from('shopping_list')
            .where({ id })
            .delete();
    }
}

module.exports = ShoppingListService;