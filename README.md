# pnlp-publisher

The reference implementation of a Publisher.


TODO:

##### add post-ArticleCreate routing
- on ArticleCreateSuccess we need to route to the article page or the admin dashboard

##### ArticleRead needs formatting work

##### Publication History page (PublicationDashboard)
- list article history and metadata
- show author info

##### add error messages
- add className="text-error sm" error messages to each page where any async action happens and display the *.entity.[load_error | tx_error].message for each one:
- ArticleForm, AwaitingPublication, Sign In, ArticleRead, PublicationList

##### publication error message
- when navigating back to a publication after you've created it, we get this error:
```
  "message": "call revert exception (method=\"publications(string)\", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)"
```

###### add "Show Technical Details" toggle to state
- add IPNS resolver links into state
- add ethereum block explorer links into state
- if (show_tech) { show links inline in appropriate places in UI }


##### add small loading signal on NavBar
- to NavBar, AdminNavbar, ReadNavbar
- keep it on DL
- explain it on click: Web 3 transactions take longer than usual, thus we will move things along, but this indicator shows if communation is happening with eth or ipfs.

##### polish /account page
- add a loader, change header to be a little more substantial
- move the "Create" button to the top right corner

##### create basic /docs page
- use about page as format and just include anchor links
- search for BsQuestionCircle and create doc to reflect each one
