/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows (query) {
	let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
	const data = res.data;
	let shows = [];
	for (let i = 0; i < data.length; i++) {
		const showID = res.data[i].show.id;
		const showName = res.data[i].show.name;
		const showSummary = res.data[i].show.summary;
		const showImage = res.data[i].show.image;
		const showImg = (showImage) => {
			return showImage === null
				? `https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300`
				: showImage.original;
		};

		shows.push({
			id      : `${showID}`,
			name    : `${showName}`,
			summary : `${showSummary}`,
			image   : showImg(showImage)
		});
	}
	return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows (shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="episodes-btn">Episodes</button>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
	// attach function to episode-btn to indentify it's show card and reveal it's episodes
	$('.episodes-btn').on('click', function (evt) {
		const id = $(evt.target).closest('.card').data('show-id');
		console.log(id);
		populateEpisodes(getEpisodes(id));
	});
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch (evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	// $('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes (id) {
	//  get episodes from tvmaze
	let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	const data = res.data;
	// return array-of-episode-info, as described in docstring above
	let episodes = [];
	// push each episode obj into an array
	for (let i = 0; i < data.length; i++) {
		const episodeID = res.data[i].id;
		const episodeName = res.data[i].name;
		const episodeSeason = res.data[i].season;
		const episodeNum = res.data[i].number;

		episodes.push({
			id     : `${episodeID}`,
			name   : `${episodeName}`,
			season : `${episodeSeason}`,
			number : `${episodeNum}`
		});
	}
	return episodes;
}

// appends each episode to an episodes-list
function populateEpisodes (episodes) {
	const $episodesList = $('#episodes-list');
	$episodesList.empty();

	for (let episode of episodes) {
		let $item = $(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`);

		$episodesList.append($item);
	}
}

// Episodes aren't apeending to page properly
