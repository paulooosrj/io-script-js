self.addEventListener('fetch', function(event) {
  console.log(event);
  //event.respondWith(fetch(event.request));
});
