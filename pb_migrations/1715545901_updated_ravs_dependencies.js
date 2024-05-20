/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uwgrnzmiiqt8mf3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ijrwszer",
    "name": "owner",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "pyvzjleuokyf1x8",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uwgrnzmiiqt8mf3")

  // remove
  collection.schema.removeField("ijrwszer")

  return dao.saveCollection(collection)
})
