
import { fetchImages } from './js/pixabay-api.js';
import { renderImages } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const imagesBoxEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader'); 
let gallery = null;

// показ завантажувача виправлення
function showLoader() {
    loaderEl.style.display = 'block';
}

//приховування завантажувача виправлення
function hideLoader() {
    loaderEl.style.display = 'none';
}


// подія форми 
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    
    const query = event.target.elements.query.value.trim();

    if (!query) {
        return; 
    }

    imagesBoxEl.innerHTML =
     showLoader();    '';

    fetchImages(query)
        .then(data => {
            const { hits } = data;
            
            if (hits.length === 0) {
                throw new Error('No images found for this search query.');
            }

            const imagesMarkup = renderImages(hits);
            imagesBoxEl.innerHTML = imagesMarkup;

            //SimpleLightbox
            if (gallery) {
                gallery.refresh();
            } else {
                gallery = new SimpleLightbox('.gallery a', {
                    captions: true,
                    captionDelay: 250,
                });
            }
        })
        .catch(error => {
            iziToast.error({
                title: 'Error',
                message: error.message,
            });
        })
    .finally(() => {
        hideLoader();
    });
});