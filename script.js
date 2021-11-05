const modal              = document.getElementById('modal');
const modalShow          = document.getElementById('show-modal');
const modalClose         = document.getElementById('close-modal');
const bookmarkForm       = document.getElementById('bookmark-form');
const websiteNameEl      = document.getElementById('website-name');
const websiteUrlEl       = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

//show modal and focus input
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus()
}

//Modal Event listener
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click' , () => modal.classList.remove('show-modal'));
window.addEventListener('click' , (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));


// validation form
function validate(nameValue , urlValue){
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !nameValue){
        alert('please submit value for both field');
        return false;
    }
    if(!urlValue.match(regex)){
        alert('please provide a valid web address');
        return false;
    }
    //valid
    return true;
}

//build Bookmark Dom
function buildBookmarks(){
    //Remove all bookmark container
    bookmarksContainer.textContent = '';
    //build items
    bookmarks.forEach((bookmark) =>{
        const {name , url} = bookmark;
        //Item
        const item = document.createElement('div');
        item.classList.add('item');
        
        //Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title','Delete Bookmark');
        closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`);

        //Favicons / Link Container
        const LinkInfo = document.createElement('div');
        LinkInfo.classList.add('name');

        //Favicon
        const Favicon = document.createElement('img');
        Favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        Favicon.setAttribute('alt', 'Favicon');
        //link
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target','_blank');
        link.textContent = name;
        //Append to Bookmark Cotainer
        LinkInfo.append(Favicon , link);
        item.append(closeIcon , LinkInfo);
        bookmarksContainer.appendChild(item);
    })
}


//Fetch Bookmarks
function fetchBookmark(){
    //Get bookmarks from localStorage if available
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    }else{
        //create bookmarks array in localStorage
        bookmarks = [
            {
                name:'Jacinto design',
                url:'https://Jacinto.com'
            }
        ];
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

//Delete Bookmark
function deleteBookmark(url){
    bookmarks.forEach((bookmark,i) =>{
        if(bookmark.url === url){
            bookmarks.splice(i , 1)
        }
    });
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmark()
}

//Handle Data from Form
function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://' , 'https://')){
        urlValue = `https://${urlValue}`
    }
    if(!validate(nameValue , urlValue)){
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmark()
    bookmarkForm.reset();
    websiteNameEl.focus();
}

//Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

//On load bookmarks
fetchBookmark()