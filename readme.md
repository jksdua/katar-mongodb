Katar MongoDb
=============

MongoDb data adapter for [katar](https://github.com/jksdua/katar "katar")


Usage
-----

```js
// see monk documentation for url format
var DATABASE_URL = 'localhost/db';

// create the database adapter
var katarDb = require('katar-mongodb')(DATABASE_URL);

// instantiate katar with mongodb
var katar = require('katar')({ db: katarDb });
```

Katar creates individual collections for each of the queues. Either use a different database for katar or ensure collections used by Katar are not used by other parts of your application.


### Naming convention

Collections are given the same name as the queue so ensure the queue name meets the Mongodb collection limitations:

- Shorter than 123 characters
- Any UTF8 character which isn't special (contains ".", or starts with "$")..



Changelog
---------

### v0.0.2
- Updated readme

### v0.0.1 - Alpha
- Initial release