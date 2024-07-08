const axios = require("axios").default;
const qs = require("qs");
const cheerio = require('cheerio');

const instagramVid = (url_media) => {
  return new Promise(async (resolve, reject) => {
    try {
      const BASE_URL = "https://v3.saveig.app/api/ajaxSearch";
      const params = {
        q: url_media,
        t: "media",
        lang: "en",
      };

      const headers = {
        Accept: "*/*",
        Origin: "https://saveig.app",
        Referer: "https://saveig.app/",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded",
        "Sec-Ch-Ua": '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183",
        "X-Requested-With": "XMLHttpRequest",
      };

      const response = await axios.post(BASE_URL, qs.stringify(params), { headers });
      const responseData = response.data.data;
      if (!responseData) reject({ results_number: 0, url_list: [] });

      const $ = cheerio.load(responseData);
      const downloadItems = $(".download-items");
      const videoUrl = [];
      const imageResource = [];
      downloadItems.each((index, element) => {
        const downloadLink = $(element).find(".download-items__btn > a").attr("href").replace("&dl=1", "");
        if (downloadLink.includes("instagram")) {
          imageResource.push({
            display_resources: downloadLink
          });
        } else {
          videoUrl.push(downloadLink);
        }
      });
      let caption = {
        created_at: null,
        text: null,
        id: null
      };
      let owner = {
        id: null,
        username: null
      };
      let thumbnail = null;
      let isVideo = true;
      if (imageResource.length > 0) {
        isVideo = false;
      }
      try {
        const responseContent = await axios.get(`https://i.instagram.com/api/v1/oembed/?url=${url_media}`);
        const response = responseContent.data;
        if (response) {
          caption.text = response.title;
          caption.id = response.media_id;
          owner.id = response.author_id;
          owner.username = response.author_name;
          thumbnail = response.thumbnail_url;
        }
      } catch (error) {
        console.error("Error fetching oembed data: ", error.message);
        // You can set default values or leave them as null
      }

      let igresponse = { videoUrl: videoUrl, imageResource: imageResource, owner, caption, thumbnail, isVideo };
      resolve(igresponse);
    } catch (err) {
      reject(err);
    }
  });
};

export default instagramVid;
