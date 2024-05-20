/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "etfubetemu83yj5",
    "created": "2024-04-17 10:48:13.243Z",
    "updated": "2024-04-17 10:48:13.243Z",
    "name": "ravs_data",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "cpacsuma",
        "name": "actions",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "y4citfsx",
        "name": "registeredData",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
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
  const collection = dao.findCollectionByNameOrId("etfubetemu83yj5");

  return dao.deleteCollection(collection);
})
