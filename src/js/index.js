import '../css/style.css';

const form = document.getElementById('form');
const testo = document.getElementById('cerca');
let container = document.getElementById('container');

const createElement = (tagName, className, id, innerHTML, clickHandler) => {
    const element = document.createElement(tagName);

    if (className && className !== '') {
        element.classList.add(className);
    }

    if (id) {
        element.setAttribute('id',id);
    }

    if (innerHTML) {
        element.innerHTML = innerHTML;
    }

    if (clickHandler) {
        element.addEventListener('click', clickHandler);
    }

    return element;
};

const createPhotoElement = (src, alt, className, clickHandler) => {
    const img = document.createElement('img');
    if (src && src.trim() !== '') {
        img.src = src.trim();
    }
    if (alt) {
        img.alt = alt;
    }
    if (className && className.trim() !== '') {
        img.classList.add(className.trim());
    }
    if (clickHandler) {
        img.addEventListener('click', clickHandler);
    }
    return img;
};

function scrollToBanner() {
    const bannerElement = document.querySelector('.bannerLibri');
    if (bannerElement) {
        bannerElement.scrollIntoView({ behavior: 'smooth' });
    }
}

form.addEventListener('submit', function sendResource(event) {

    container.style.paddingTop = '100px';
    scrollToBanner();

    document.getElementById('loader').style.display = 'block';

    event.preventDefault(); 

    console.log('#### JSON API ####')
    let urlBase = 'https://openlibrary.org/subjects/';
    let minTesto = testo.value.toLowerCase();
    

    let urlGet = urlBase+minTesto+'.json'; 
    container.innerHTML = ''; 

    fetch(urlGet)
    .then(response => response.json())
    .then(json => {
        let fetchResponse = json;
        
        let works = fetchResponse.works
        if(works == 0){
            document.getElementById('loader').style.display = 'none';
            let allert = createElement('h3', 'allert');
            container.appendChild(allert);
            allert.innerHTML = 'LA RICERCA NON HA RESTITUITO NESSUN RISULTATO';
        }else{
            for (let i = 0; i < works.length; i++) {
                let title = works[i].title;
                let author = works[i].authors[0]['name'];
                let descriptionId = works[i].key
                let descriptionUrl = 'https://openlibrary.org'+descriptionId+'.json'
                let availability = works[i].availability
    
                const card = createElement('div', 'col-xxl-3', 'card', '', () => toggleDescription(descriptionUrl, card));
                container.appendChild(card);
                card.classList.add('col-lg-4');
                card.classList.add('col-md-6');
                
    
                if(availability){
                    let isbn = availability['isbn'];
                    if(isbn){
                        let linkImg = 'https://covers.openlibrary.org/b/isbn/'+isbn+'-M.jpg'
        
                        let imgRespnse = createPhotoElement(linkImg, '', 'imgCover')
                        card.appendChild(imgRespnse);
                    } else{
                        let linkImg = 'https://www.shutterstock.com/shutterstock/photos/2059817444/display_1500/stock-vector-no-image-available-photo-coming-soon-illustration-vector-2059817444.jpg'
        
                        let imgRespnse = createPhotoElement(linkImg, '', 'imgCover')
                        card.appendChild(imgRespnse);
                    }
                    
                }else{
                    let linkImg = 'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg'
                    let imgRespnse = createPhotoElement(linkImg, '', 'imgCover')
                    card.appendChild(imgRespnse);
                }
    
                document.getElementById('loader').style.display = 'none';
    
                let titleRespnse = createElement('h5', 'title-book');
                card.appendChild(titleRespnse)
    
                let authorsRespnse = createElement('p', 'authors-book');
                card.appendChild(authorsRespnse);
    
                titleRespnse.innerHTML = title;
                authorsRespnse.innerHTML = author;
                
                console.log('----- TITOLO ---- \n', works[i].title);
                console.log('----- AUTORE ---- \n', works[i].authors[0]['name']);
                console.log('----- DESCRIZIONE ---- \n', descriptionUrl);
                
            } 
        }

        
    })
    .catch(error => console.error('Errore durante il fetch:', error));
});

function toggleDescription(descriptionUrl, card) {
    let descriptionElement = card.querySelector('.description-book');
    if (descriptionElement) {
        descriptionElement.remove();
    } else {
        fetch(descriptionUrl)
            .then(response => response.json())
            .then(json => {
                let description = json.description;
                console.log(description)
                console.log(typeof description)
                let descriptionResponse = createElement('p', 'description-book');
                descriptionResponse.innerHTML = description;
                if (typeof description === 'string') {
                    descriptionResponse.innerHTML = description;
                } else if(typeof description === 'object') {
                    descriptionResponse.innerHTML = description['value'];
                } else{
                    descriptionResponse.innerHTML = 'DESCRIZIONE NON DISPONIBILE';
                }
                card.appendChild(descriptionResponse);
            })
            .catch(error => console.error('Errore durante il fetch:', error)); 
    }
}