const fetchHtml = async (url: string) => {
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
    });
    return await response.text();
  } catch {
    return null;
  }
};

const extractPostId = (html: string) => {
  if (html.slice(0, 17) === '<a href="https://') {
    if (html.includes("/video/")) {
      return html.split("/video/")[1].split("?")[0].replace("/", "");
    } else if (html.includes("/photo/")) {
      return html.split("/photo/")[1].split("?")[0].replace("/", "");
    }
  } else if (
    html.slice(0, 32) === '<a href="https://m.tiktok.com/v/' &&
    html.includes("/v/")
  ) {
    return html.split("/v/")[1].split(".html")[0].replace("/", "");
  }
};

const fetchData = async (urlApi: string, postid: string) => {
  try {
    const response = await fetch(urlApi, {
      method: "OPTIONS",
      headers: { "Content-Type": "application/json" },
    });
    const data: any = await response.json();

    if (data?.aweme_list[0]?.aweme_id === postid) {
      const detail = data.aweme_list[0];
      const description = detail.desc;
      const idPost = detail.aweme_id;
      const author = {
        id: detail.author.uid,
        name: detail.author.nickname,
        signature: detail.author.signature,
        avatar: detail.author.avatar_medium.url_list,
        birthday: detail.author.birthday,
        unique_id: detail.author.unique_id,
      };
      const images = detail.image_post_info?.images;
      const videoWithoutWatermark = detail.video.play_addr.url_list[1];

      if (videoWithoutWatermark) {
        return {
          id: idPost,
          title: description,
          author: author,
          thumbnail: detail.video.cover.url_list[0],
          video_without_watermark: detail.video.play_addr.url_list,
          videoWatermark: detail.video.download_addr.url_list,
          filename: postid,
          type: "video",
        };
      }
      if (images) {
        const imageLinks = images.map((image: any) => {
          const sel = image.display_image.url_list.filter((p: any) =>
            p.includes(".jpeg?")
          );
          return { url: sel[0] };
        });
        return {
          id: idPost,
          title: description,
          author: author,
          url_images: imageLinks,
          type: "image",
        };
      }
    }
  } catch (error) {
    return { error: "Error Fetching Data", success: false };
  }
};

const getPostIdFromUrl = async (url: string) => {
  const regex = /https:\/\/vt\.tiktok\.com\/(.*)\//;
  const regexMobile = /https:\/\/m\.tiktok\.com\/v\/(\d+)\.html/;
  let postid;

  if (regex.test(url)) {
    const html = await fetchHtml(url);
    if (!html) return { error: "Error Couldn't Fetch" };
    postid = extractPostId(html);
  } else if (regexMobile.test(url)) {
    postid = url.split("/v/")[1].split(".html")[0].replace("/", "");
  } else if (url.includes("/video/")) {
    postid = url.split("/video/")[1].split("?")[0].replace("/", "");
  }

  return postid ? { postid } : { error: "Error Can't Get ID" };
};

export const getInfoTiktok = async (url: string) => {
  const regex = /https:\/\/vt\.tiktok\.com\/(.*)\//;
  const regexMobile = /https:\/\/m\.tiktok\.com\/v\/(\d+)\.html/;
  let postid;

  if (regex.test(url)) {
    const html = await fetchHtml(url);
    if (!html) return { error: "Error Couldn't Fetch" };
    postid = extractPostId(html);
  } else if (regexMobile.test(url)) {
    postid = url.split("/v/")[1].split(".html")[0].replace("/", "");
  } else if (url.includes("/video/")) {
    postid = url.split("/video/")[1].split("?")[0].replace("/", "");
  }

  if (!postid) return { error: "Error Can't Get ID" };

  const urlApi = `https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/?aweme_id=${postid}&iid=7318518857994389254&device_id=7318517321748022790&channel=googleplay&app_name=musical_ly&version_code=300904&device_platform=android&device_type=ASUS_Z01QD&version=9`;
  return fetchData(urlApi, postid);
};

export const getInfoTiktokV2 = async (url: string) => {
  const regex = /https:\/\/vt\.tiktok\.com\/(.*)\//;
  const regexMobile = /https:\/\/m\.tiktok\.com\/v\/(\d+)\.html/;
  let postid;

  if (regex.test(url)) {
    const html = await fetchHtml(url);
    if (!html) return { error: "Error Couldn't Fetch" };
    postid = extractPostId(html);
  } else if (regexMobile.test(url)) {
    postid = url.split("/v/")[1].split(".html")[0].replace("/", "");
  } else if (url.includes("/video/")) {
    postid = url.split("/video/")[1].split("?")[0].replace("/", "");
  }

  if (!postid) return { error: "Error Can't Get ID" };

  const urlApi = `https://api31-normal-probe-useast2a.tiktokv.com/aweme/v1/feed/?aweme_id=${postid}`;
  return fetchData(urlApi, postid);
};
