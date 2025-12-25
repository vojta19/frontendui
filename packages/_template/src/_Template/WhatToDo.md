

## Base Copy

- copy /_template/ directory to your place

## Adapt to new type
- in Link.jsx file (see subdir ./components/) change LinkURI
- in Link.jsx file change registerLink('YourGQLModel)
- use http://localhost:8001/doc to get queries and update AsyncActions, fragments, etc. in directory Queries
  - readById
  - readPage
  - mutations (CUD)

- rename RouterSegments in Page/RouterSegments.jsx
- insert RouterSegments into app router, so make them working
- try to navigate in your app to URI defined in Link to reach list of items `/template/YOUDEFINED/list/'
- remove all errors until you get your app showing a table
- try to navigate from table into individual items
- check permission at API (source code etc.) to get info about neede roles for particular mutations 
  - UserAbsoluteAccessControlExtension or RbacProviderExtension
  - set


- Update MediumContent.jsx file to show more or less data
- Update MediumEditableContent.jsx file to allow edit of more or less data


## Add new Mutations

### Update