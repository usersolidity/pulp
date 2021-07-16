# pnlp-publisher

The reference implementation of a Publisher.


TODO:

##### Factor out etherscan address into environment variable


##### ArticleRead needs formatting work

##### Icons/Images

##### Publication History page (PublicationDashboard)
- list article history and metadata
- show author info

##### Publication Settings page
- list article history and metadata
- show author info

##### add error messages
- add className="text-error sm" error messages to each page where any async action happens and display the *.entity.[load_error | tx_error].message for each one:
- ArticleForm, AwaitingPublication, Sign In, ArticleRead, PublicationList

###### findDOMNode error on AwaitingPublication
- findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here

###### controlId on NewPublication
- Warning: `controlId` is ignored on `<FormControl>` when `id` is specified.

###### component changing uncontrolled input
- A component is changing an uncontrolled input of type input to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info:

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

##### rename admin-redux and move out of admin directory
