/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "pyvzjleuokyf1x8",
    "created": "2024-05-10 23:03:56.928Z",
    "updated": "2024-05-10 23:03:56.928Z",
    "name": "ravs_data",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bsn7w05b",
        "name": "registeredData",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("pyvzjleuokyf1x8");

  return dao.deleteCollection(collection);
})
