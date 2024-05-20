/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "uwgrnzmiiqt8mf3",
    "created": "2024-05-12 20:29:05.769Z",
    "updated": "2024-05-12 20:29:05.769Z",
    "name": "ravs_dependencies",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "w58v7fci",
        "name": "fullname",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "hpxnzuwx",
        "name": "nin",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("uwgrnzmiiqt8mf3");

  return dao.deleteCollection(collection);
})
