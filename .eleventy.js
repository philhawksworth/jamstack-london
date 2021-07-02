const sass = require("sass");
const fs = require("fs-extra");


module.exports = (eleventyConfig) => {

  // pass files direclty through to the output
  eleventyConfig.addPassthroughCopy("site/images");

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
        // console.log(e);
        return e
      });
    });

    // console.log(talks.flat());
    return talks.flat();
    

    
  });





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
