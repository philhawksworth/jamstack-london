const sass = require("sass");
const fs = require("fs-extra");
const { DateTime } = require("luxon");


module.exports = (eleventyConfig) => {

  // pass files directly through to the output
  eleventyConfig.addPassthroughCopy({ 
    "src/site/images": "images" 
  });

  // watch the scss source files in case of need to regenerate
  eleventyConfig.addWatchTarget("src/scss/");

  // Compile Sass before a build
  eleventyConfig.on("beforeBuild", () => {
    let result = sass.renderSync({
      file: "src/scss/main.scss",
      sourceMap: false,
      outputStyle: "compressed",
    });
    fs.ensureDirSync('dist/css/');
    fs.writeFile("dist/css/main.css", result.css, (err) => {
      if (err) throw err;
      console.log("CSS generated");
    });
  });


  eleventyConfig.addCollection("talks", function(collectionApi) {
    const talks = collectionApi.getFilteredByTag("event").map(event => {      
      // add the date to each talk
      return event.data.talks.map(e => {
        e['date'] = event.date;
        return e
      });
    });
    return talks.flat();
  });

  // Add date formatting
  eleventyConfig.addFilter("formatDate", (dateObj, format="yyyy-MM-dd") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  // determine if a date is in the future or in the past
  eleventyConfig.addFilter("future", (dateObj) => {
    const today = DateTime.now().endOf('day');
    const date = DateTime.fromJSDate(dateObj).endOf('day');
    return date >= today;
  })


  // where do things live?
  return {
    dir: {
      input: "src/site",
      output: "dist"
    },
    templateFormats : ["njk", "md"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    
  };

};
