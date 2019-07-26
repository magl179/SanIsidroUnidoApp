
**Execute**

json-server --watch db.json


**Plural routes**
GET    /subcategories
GET    /subcategories/1
POST   /subcategories
PUT    /subcategoriesposts/1
PATCH  /subcategories/1
DELETE /subcategories/1

**PAGINATE**
http://127.0.0.1:3001/subcategories?_page=2&_limit=2

**SORT BY ASC**
http://127.0.0.1:3001/subcategories?_sort=name&_order=asc
