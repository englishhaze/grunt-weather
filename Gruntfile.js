/**
 * Grunt file to demonstrate multi-tasks
 */
module.exports = function(grunt) {

	// Configuration options go in here
	grunt.config.init({
		
		// Weather locations (target: data)
		weather : {
			home: '60632',
			work: '60622',
			dorrell: '21054',
			london: 'london,uk'
		}
	});
	
	
	/**
	 * Register a task to make retrieve weather from multiple locations.
	 * This task is called once for each target: data element in the config. options
	 */
	grunt.registerMultiTask('weather', 'Fetch location weather', function() {

		var done, location, request, requestOptions, zipCode;
		
		// Location and target come from the multi-task config. options with the same
		// name as the task. Target is property name and data is property value
		location = this.target;
		zipCode = this.data;
		
		requestOptions = {
			host: 'api.openweathermap.org',
			path: '/data/2.5/weather?imperial&q=' + zipCode,
			port: 80,
			method: 'GET'
		};
		
		http = require('http');
		
		// Set an asynchronous marker variable to trigger when we're done
		// otherwise Grunt would end the task before the HTTP response was received
		done = this.async();
		
		request = http.request(requestOptions, function(response) {
			var buffer = [];
			
			// Push each block of received data into the buffer
			response.on('data', function(data) {
				buffer.push(data);
			});
			
			response.on('end', function() {
				// Join up the buffer parts
				var weather = JSON.parse(buffer.join());
				console.log(location + ' : ' + weather.main.temp + ' degrees');
				
				// Tell Grunt we've finished processing asynchronous data so it can end
				done();
			});
		});
		
		request.end();
	});
};


