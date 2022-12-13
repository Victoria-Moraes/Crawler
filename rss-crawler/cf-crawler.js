require('dotenv').config();

const { create, find } = require("./database/mongodb");
const { query } = require("express");

const Parser = require('rss-parser');
const parser = new Parser();

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const watsonNLU = new NaturalLanguageUnderstandingV1({
  version: process.env.WATSON_NLU_VERSION,
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_NLU_KEY,
  }),
  serviceUrl: process.env.WATSON_NLU_URL,
});

const database = process.env.MONGO_DATABASE;
const collection = process.env.MONGO_COLLECTION;


function main(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await getPosts(process.env.RSS_TARGET, process.env.RSS_NAME);
      return resolve({
        target: res.target,
        n_matches: res.n_matches,
        result: res.message,
      });
    } catch (error) {
      return reject({
        query: query,
        error: error,
      });
    }
  });
}

function getPosts(target, source) {
  return new Promise(async (resolve, reject) => {
      try {
        let feed = await parser.parseURL(target);
        
        for (let item of feed.items) {
          let data = item;
          data.crawled_source = source;
          data.domain = process.env.RSS_DOMAIN;
          data.crawler_id = source +"::"+(data.guid?data.guid:data.link);
          data.crawler_content = data[process.env.RSS_CONTENT_FIELD]
          
          const analyzeParams = {
            'text': data.title+" : "+data.crawler_content,
            'features': {
              'sentiment': {
              },
              'entities': {
                'sentiment': true,
                'emotion': true
              },
              'keywords': {
                'emotion': true,
                'sentiment': true
              }
            }
          };

          let exists = await find(database, collection, {
            "crawler_id": data.crawler_id,
          });


          if (!exists && data.crawler_content && data.crawler_content != "") {
            let analysisResult = await watsonNLU.analyze(analyzeParams);
            data.keywords = analysisResult.result.keywords;
            data.sentiment = analysisResult.result.sentiment;
            data.entities = analysisResult.result.entities;
            await create(database, collection, data);
            console.log("SAVED: "+data.crawler_id)
          } else {
            if (data.crawler_content && data.crawler_content != "") {
              console.log("ALRIGHT SAVED: "+data.crawler_id)
            } else {
              console.log("NOT SAVING - EMPTY CONTENT: "+data.crawler_id)
            }
            
          }
          
        }   
      return resolve({
        message: "RSS crawling finished.",
        target: target,
        n_matches: feed.items.length,
      });

      } catch (error) {
        return reject({ error: error });
      }
    }
  );
}

main({ query: process.env.QUERY }).then((res) => console.log(res)).catch(err => (console.log(err)));
exports.main = main;
