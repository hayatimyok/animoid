document.addEventListener('DOMContentLoaded', () => {
    const animeList = document.getElementById('anime-list');

    fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    Page(page: 1, perPage: 10) {
                        media(type: ANIME, sort: POPULARITY_DESC) {
                            id
                            title {
                                romaji
                            }
                            coverImage {
                                large
                            }
                            description
                        }
                    }
                }
            `
        })
    })
    .then(response => response.json())
    .then(data => {
        const animeData = data.data.Page.media;
        animeData.forEach(anime => {
            const animeItem = document.createElement('li');
            animeItem.innerHTML = `
                <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                <div>
                    <h3>${anime.title.romaji}</h3>
                    <p>${anime.description}</p>
                    <video controls>
                        <source src="path/to/your/video.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
            animeList.appendChild(animeItem);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
});