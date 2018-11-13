/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   * Change this to `http://localhost:1337/restaurants` to point to your local sails server.
   */
  static get DATABASE_URL() {
    // return `https://mws-restaurants-app.herokuapp.com/restaurants`;
    return `http://localhost:1337/restaurants`;
  }

  /**
   * Reviews URL.
   * Change this to `http://localhost:1337/re` to point to your local sails server.
   */
  static get REVIEWS_URL() {
    // return `https://mws-restaurants-app.herokuapp.com/reviews`;
    return `http://localhost:1337/reviews`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL)
      .then(res => res.json())
      .then(restaurants => {
        self.addDataToIdb("restaurantsArray", JSON.stringify(restaurants));
        callback(null, restaurants);
      })
      .catch(err => {
        self.getDataFromIdb("restaurantsArray").then(restaurants => {
          if (restaurants) {
            callback(null, JSON.parse(restaurants));
            return;
          }
          const error = `Request failed`;
          callback(error, null);
        });
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    fetch(`${DBHelper.DATABASE_URL}/${id}`)
      .then(res => res.json())
      .then(restaurant => {
        self.addDataToIdb(id, JSON.stringify(restaurant));
        callback(null, restaurant);
      })
      .catch(err => {
        self.getDataFromIdb(id).then(restaurants => {
          if (restaurants) {
            callback(null, JSON.parse(restaurants));
            return;
          }
          const error = `Request failed`;
          callback(error, null);
        });
      });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    callback
  ) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != "all") {
          // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != "all") {
          // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    // self.getDataFromIdb("restaurantsArray").then(restaurants => {
    //   if (restaurants) {
    //     const neighborhoods = restaurants.map(
    //       (v, i) => restaurants[i].neighborhood
    //     );
    //     // Remove duplicates from neighborhoods
    //     const uniqueNeighborhoods = neighborhoods.filter(
    //       (v, i) => neighborhoods.indexOf(v) == i
    //     );
    //     callback(null, uniqueNeighborhoods);
    //   }
    //   const error = `Request failed`;
    //   callback(error, null);
    // })
    // .catch(console.log);
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map(
          (v, i) => restaurants[i].neighborhood
        );
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter(
          (v, i) => neighborhoods.indexOf(v) == i
        );
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter(
          (v, i) => cuisines.indexOf(v) == i
        );
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return `./img/${restaurant.photograph}`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker(
      [restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      }
    );
    marker.addTo(newMap);
    return marker;
  }
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

  /**
   * Favorite Restaurant.
   */
  static likeRestaurant(id, like = true) {
    return fetch(`${DBHelper.DATABASE_URL}/${id}/?is_favorite=${like}`, {
      method: 'PUT'
    })
      .then(res => res.json())
  }

  /**
   * Fetch restaurant review with id.
   */
  static fetchReviewsById(id) {
    return fetch(`${DBHelper.REVIEWS_URL}?restaurant_id=${id}`)
      .then(res => res.json())
      .then(reviews => {
        addDataToIdb('reviews', reviews);
        return reviews;
    })
  }

  
  /**
   * Add review for restaurant
   */
  static addRestaurantReview(review) {
    return fetch(DBHelper.REVIEWS_URL, 
      {
        method: 'POST',
        body: JSON.stringify(review)
      })
      .then(res => res.json())
      .catch(err => {
        return err;
      });
  }

  /**
   * Adds reviews when connection is reestablished
   */
  static addRestaurantReviewOffline(review) {
  // make each review saved in localStorage unique
  const date = Date.now();
  localStorage.setItem(`restaurant-${date}`, JSON.stringify(review));
  window.addEventListener('online', ()=>{
    const review = localStorage.getItem(`restaurant-${date}`)
    if(review) DBHelper.addRestaurantReview(review);
    localStorage.removeItem(`restaurant-${date}`)
    //remove class of ofline from reviews
    document.querySelectorAll('.offline').forEach(review => review.classList.remove('offline'));
  })
  return Promise.resolve(review);
  }
}
