/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pyvzjleuokyf1x8")

  // remove
  collection.schema.removeField("bsn7w05b")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0mcfgmhm",
    "name": "registeredData",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pyvzjleuokyf1x8")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // remove
  collection.schema.removeField("0mcfgmhm")

  return dao.saveCollection(collection)
})
