

var newsSource = "https://newsapi.org/v1/articles?source=reuters&sortBy=latest&apiKey=171b320fb1374ecfb4da6f5d4af3b81f";

fetchnews = new XMLHttpRequest();
fetchnews.open("GET", newsSource, true);
fetchnews.send(null);

// serialize response

fetchnews.onloadend = function () {
    if (this.status === 200) {

        var responseOld = JSON.stringify(this.response);
        //  var responseOld = "starykod";

        var newsObject = JSON.parse(this.response);

        var articles = newsObject.articles;
        var titles = [],
            dates = [],
            images = [],
            intros = [],
            authors = [],
            readmore = [];

        getTitles(newsObject, articles, titles);
        getDates(newsObject, articles, dates);
        getImages(newsObject, articles, images);
        getIntros(newsObject, articles, intros);
        getAuthors(newsObject, articles, authors);
        getReadmoreUrl(newsObject, articles, readmore);


        // let's make some noise in DOM :-)

        console.log("fetchnews.onloadend");

        buildNews(articles.length, titles, dates, images, intros, authors, readmore);
        // evenizer();
        showFooter();

        setTimeout(updateChecker.bind(null, responseOld), 60000);


    }
};

function buildNews(length, titles, dates, images, intros, authors, readmore) {

    for (i = 0; i < length; i++) {

        var singleNews = document.createDocumentFragment();

        var setTitle = Structure().titleHolder();
        setTitle.textContent = titles[i];

        if (dates[i].toString() != "Invalid Date") {
            var setDates = Structure().dateHolder();
            var niceMonth = 0 + (dates[i].getMonth() + 1).toString();
            var niceDate = dates[i].getDate() + "/" + niceMonth.slice(-2) + "/" + dates[i].getFullYear();
            setDates.innerHTML = "<i class=\"fa fa-calendar\" aria-hidden=\"true\"></i>" + niceDate;
            // setDate.textContent = niceDate;
        } else {
            var setDates = Structure().dateHolder();
        }



        var setImage = Structure().imgHolder();
        setImage.querySelector("img").setAttribute("src", images[i]);

        var setIntro = Structure().introHolder();
        setIntro.textContent = intros[i];

        var setAuthor = Structure().authorHolder();
        setAuthor.innerHTML = "<i class=\"fa fa-user\" aria-hidden=\"true\"></i> " + String(authors[i]);
        // setAuthor.textContent =  authors[i];

        var setLink = Structure().moreHolder();
        setLink.setAttribute("href", readmore[i]);


        var setNewsHolder = Structure().newsHolder();
        var setInner = Structure().newsHolderInner();


        setNewsHolder.appendChild(setInner);
        setInner.appendChild(setTitle);
        setInner.appendChild(setImage);
        setInner.appendChild(setAuthor);
        setInner.appendChild(setDates);
        setInner.appendChild(setIntro);
        setInner.appendChild(setLink);
        singleNews.appendChild(setNewsHolder);
        content.appendChild(singleNews);
    }

console.log("buildNews()");
}


function Structure() {
    structure = {
        titleHolder: function() {
            var holder = document.createElement("h2");
            holder.classList.add("title", "news" + (i + 1));
            return holder;
        },
        dateHolder: function() {
            var holder = document.createElement("span");
            holder.classList.add("date", "news" + (i + 1));
            return holder;
        },
        imgHolder: function() {
            var holder = document.createElement("div");
            holder.classList.add("image", "news" + (i + 1));
            holder.appendChild(this.imgElem());
            return holder;
        },
        imgElem: function() {
            var image = document.createElement("img");
            return image;
        },
        introHolder: function() {
            var holder = document.createElement("p");
            holder.classList.add("content", "news" + (i + 1));
            return holder;
        },
        authorHolder: function() {
            var holder = document.createElement("span");
            holder.classList.add("author", "news" + (i + 1));
            return holder;
        },
        moreHolder: function() {
            var holder = document.createElement("a");
            holder.classList.add("button", "news" + (i + 1));
            holder.setAttribute("target", "_blank");
            holder.textContent = "Read more";
            return holder;
        },
        newsHolder: function() {
            var holder = document.createElement("div");
            holder.classList.add("newsholder", "col-xs-12", "col-sm-6", "col-md-6", "col-lg-4", "news" + (i + 1));
            // setTimeout(holder.classList.add("fullop"), 5000);
            return holder;
        },
        newsHolderInner: function() {
            var holder = document.createElement("div");
            holder.classList.add("inner", "news" + (i + 1));
            return holder;
        },
    };
    return structure;
}

function getTitles(newsObject, articles, titles) {
    for (i = 0; i < articles.length; i++) {
        titles[i] = articles[i].title;
    }
}

function getDates(newsObject, articles, dates) {
    for (i = 0; i < articles.length; i++) {
        dates[i] = new Date(Date.parse(articles[i].publishedAt));
    }
}

function getImages(newsObject, articles, images) {
    for (i = 0; i < articles.length; i++) {
        images[i] = articles[i].urlToImage;
    }
}

function getIntros(newsObject, articles, intros) {
    for (i = 0; i < articles.length; i++) {
        intros[i] = articles[i].description;
    }
}

function getAuthors(newsObject, articles, authors) {
    for (i = 0; i < articles.length; i++) {
        authors[i] = articles[i].author;
    }
}

function getReadmoreUrl(newsObject, articles, readmore) {
    for (i = 0; i < articles.length; i++) {
        readmore[i] = articles[i].url;
    }
}

/////////////////////////////////////////// handling updates


function updateChecker(responseOld) {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", newsSource, true);
    xhr2.send(null);
    xhr2.addEventListener("load", getUpdateAnwser.bind(xhr2, responseOld), false);
    // console.log(responseOld);

    console.log("updateChecker()");
}

function getUpdateAnwser(responseOld) {

    if (this.status === 200) {
        var responseNew = JSON.stringify(this.response);
        // var responseNew = "nowykod";

        if (responseOld === responseNew) {
            console.log("%c nic się nie zmieniło", 'background: #222; color: #bada55');
             console.log(new Date);
            setTimeout(updateChecker.bind(null, responseOld), 60000);
        } else if (responseOld !== responseNew) {
             console.log("%c ooo, nowe wiadomosci :-)", 'background: #222; color: #bada55');
             console.log(new Date);
            console.log("-------------------------");
             console.log("%c OLD:", 'background: #222; color: #f0ccf1');
            console.log(responseOld);
            console.log("-------------------------");
             console.log("%c NEW:", 'background: #222; color: #f0ccf1');
             console.log(responseNew);
            makeChanges();
        }
    }
}


var content = document.querySelector("main>div");

function makeChanges() {

    content.innerHTML() = "";
    fetchnews.onloadend();
    console.log("makeChanges()");

}


/////////////////////////////////////////////

var section = document.querySelector("section");



function showFooter() {
    document.querySelector("footer").classList.add("show");
}
